import datetime
from django.db import transaction

def generate_document_number(doc_prefix: str, organization=None) -> str:
    """
    Concurrency-safe sequence number generator using database transaction locks.
    Generates gapless numbers in format: <PREFIX>-<YEAR>-<0000N> (e.g. PR-2026-0001)
    """
    from apps.procurement.models import DocumentSequence
    
    current_year = datetime.datetime.now().year
    
    with transaction.atomic():
        seq_obj, created = DocumentSequence.objects.select_for_update().get_or_create(
            prefix=doc_prefix.upper(),
            year=current_year,
            organization=organization,
            defaults={'last_number': 0}
        )
        seq_obj.last_number += 1
        seq_obj.save(update_fields=['last_number'])
        next_val = seq_obj.last_number

    return f"{doc_prefix.upper()}-{current_year}-{next_val:04d}"
