from apps.procurement.models import PurchaseRequest, WorkflowRule, ApprovalLog, Notification

DEFAULT_CHAIN = ['DEPARTMENT_HEAD', 'FINANCE']
ENTERPRISE_HIGH_VALUE_CHAIN = ['DEPARTMENT_HEAD', 'FINANCE', 'CIO', 'CEO']

def get_required_approval_chain(purchase_request: PurchaseRequest) -> list:
    """
    Evaluates database WorkflowRules dynamically based on budget amount, department, and category.
    Returns an ordered list of required approval roles.
    Example: ['DEPARTMENT_HEAD', 'FINANCE', 'CIO', 'CEO']
    """
    amount = purchase_request.total_budget
    dept = purchase_request.department
    cat = purchase_request.category

    # Query active workflow rules ordered by specificity
    rules = WorkflowRule.objects.filter(
        is_active=True,
        min_amount__lte=amount,
        max_amount__gte=amount
    )

    if dept:
        dept_rules = rules.filter(department=dept)
        if dept_rules.exists():
            rules = dept_rules

    if cat:
        cat_rules = rules.filter(category=cat)
        if cat_rules.exists():
            rules = cat_rules

    matched_rule = rules.first()

    if matched_rule and matched_rule.approval_chain:
        return matched_rule.approval_chain

    # Fallback thresholds
    if amount > 1000000:
        return ENTERPRISE_HIGH_VALUE_CHAIN
    return DEFAULT_CHAIN

def process_approval_action(purchase_request: PurchaseRequest, approver, action: str, comments: str = ""):
    """
    Processes an approval/rejection action for a purchase request.
    Advances status dynamically along the approval chain.
    """
    chain = get_required_approval_chain(purchase_request)
    
    # Record approval log
    ApprovalLog.objects.create(
        purchase_request=purchase_request,
        approver=approver,
        action=action,
        comments=comments
    )

    if action == ApprovalLog.Action.REJECTED:
        purchase_request.status = PurchaseRequest.Status.REJECTED
        purchase_request.save(update_fields=['status'])
        
        # Notify requester
        Notification.objects.create(
            user=purchase_request.created_by,
            organization=purchase_request.organization,
            title=f"Purchase Request {purchase_request.request_number} Rejected",
            message=f"Request '{purchase_request.title}' was rejected by {approver.email}. Reason: {comments}",
            notification_type=Notification.Type.APPROVAL_REQUIRED,
            link=f"/purchase-requests"
        )
        return purchase_request

    # Count approvals so far
    approved_logs = purchase_request.approval_logs.filter(action=ApprovalLog.Action.APPROVED).count()

    if approved_logs >= len(chain):
        purchase_request.status = PurchaseRequest.Status.APPROVED
        
        # Trigger Notification for RFQ readiness
        Notification.objects.create(
            user=purchase_request.created_by,
            organization=purchase_request.organization,
            title=f"Purchase Request {purchase_request.request_number} Fully Approved",
            message=f"All {len(chain)} approval stages cleared. Ready for RFQ dispatch.",
            notification_type=Notification.Type.APPROVAL_REQUIRED,
            link=f"/rfqs"
        )
    else:
        # Move to next step status
        next_role = chain[approved_logs]
        role_status_map = {
            'DEPARTMENT_HEAD': PurchaseRequest.Status.PENDING_MANAGER,
            'FINANCE': PurchaseRequest.Status.PENDING_FINANCE,
            'CIO': PurchaseRequest.Status.PENDING_CIO,
            'CEO': PurchaseRequest.Status.PENDING_CIO
        }
        purchase_request.status = role_status_map.get(next_role, PurchaseRequest.Status.PENDING_FINANCE)

    purchase_request.save(update_fields=['status'])
    return purchase_request
