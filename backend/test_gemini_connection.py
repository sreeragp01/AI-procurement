import os
import django
from dotenv import load_dotenv

load_dotenv()
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.ai_engine.providers.gemini_provider import call_gemini_api
from apps.ai_engine.services.contract_analysis import audit_contract_with_gemini
from apps.ai_engine.services.quote_comparison import compare_quotes_with_gemini

print("Testing Google GenAI SDK Provider Integration...")
print(f"GEMINI_API_KEY Configured: {bool(os.getenv('GEMINI_API_KEY'))}")

res = audit_contract_with_gemini("Master Supply Agreement", contract_text="Delays shall incur no penalty.")
print("Contract Audit Result Risk Level:", res.get("risk_level"))
print("Missing Clauses Detected:", len(res.get("missing_clauses", [])))

print("Google GenAI Integration Verification Complete!")
