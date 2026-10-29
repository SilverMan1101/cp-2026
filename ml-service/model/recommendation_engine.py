from typing import Dict, List, Any

def generate_recommendations_for_team(
    team_name: str,
    burnout_risk_score: float,
    risk_category: str,
    factors: Dict[str, float],
    detected_themes: List[str] = None
) -> List[Dict[str, Any]]:
    """
    Synthesizes organizational interventions rather than diagnosing individuals.
    Matches ergonomic workload patterns and sentiment themes to high-impact managerial actions.
    """
    recommendations = []
    detected_themes = detected_themes or []

    overtime = factors.get("overtime_hours", 0.0)
    weekend = factors.get("weekend_hours", 0.0)
    meetings = factors.get("meeting_hours", 0.0)
    after_hours = factors.get("after_hours_messages", 0.0)
    exhaustion = factors.get("exhaustion_score", 0.0)
    pto_deficit = factors.get("pto_deficit_days", 0.0)
    support = factors.get("support_score", 3.5)

    # 1. High Overtime & Weekend Workload Intervention
    if overtime >= 8.0 or weekend >= 4.0 or "OVERTIME_AND_HOURS" in detected_themes:
        recommendations.append({
            "category": "WORKLOAD_BALANCING",
            "action_type": "CAPACITY_REBALANCING_SPRINT",
            "title": f"Reduce Sprint Story Point Commitment for {team_name}",
            "estimated_impact": "HIGH" if overtime >= 12.0 else "MEDIUM",
            "rationale": (
                f"Team logged an average of {overtime:.1f} overtime hours and {weekend:.1f} weekend hours. "
                "Sustained load beyond 45 total hours/week increases attrition risk and error rates by up to 35%."
            ),
            "suggested_action_plan": [
                "Reduce planned sprint velocity by 20% for the next two sprint cycles.",
                "Conduct a priority triage with Product management to defer non-essential backlog items.",
                "Review dependencies that routinely cause end-of-sprint delivery scrambles."
            ]
        })

    # 2. On-call / Production Alert Saturation
    if "ON_CALL_AND_INCIDENTS" in detected_themes or (weekend >= 5.0 and overtime >= 8.0):
        recommendations.append({
            "category": "WORKLOAD_BALANCING",
            "action_type": "ONCALL_ROTATION_REDESIGN",
            "title": f"Restructure On-Call Rotation & Incident Handoff for {team_name}",
            "estimated_impact": "HIGH",
            "rationale": (
                "High weekend activity combined with negative pulse sentiment indicates severe production firefighting fatigue. "
                "Single-responder rotations lead directly to chronic exhaustion."
            ),
            "suggested_action_plan": [
                "Establish a secondary on-call shadow rotation to share out-of-hours alert burden.",
                "Audit alert noise: silence or downgrade non-actionable P3/P4 notifications during nighttime.",
                "Introduce mandatory compensatory recovery time within 48 hours of night incidents."
            ]
        })

    # 3. Meeting Saturation & Context Switching
    if meetings >= 14.0 or "MEETING_SATURATION" in detected_themes:
        impact = "HIGH" if meetings >= 18.0 else "MEDIUM"
        recommendations.append({
            "category": "SCHEDULE_OPTIMIZATION",
            "action_type": "FOCUS_BLOCK_DAYS",
            "title": f"Institute 'Focus Block Days' (No-Meeting Policy) for {team_name}",
            "estimated_impact": impact,
            "rationale": (
                f"Team spends {meetings:.1f} hours/week in meetings, reducing continuous deep focus blocks below the healthy threshold (15h/wk). "
                "Frequent calendar fragmentation forces employees to catch up on core work during evenings."
            ),
            "suggested_action_plan": [
                "Designate Wednesday as an organization-wide zero-internal-meeting day.",
                "Cap standard internal syncs at 25 or 45 minutes instead of 30 or 60 minutes.",
                "Transition daily status updates to asynchronous Slack/Teams morning check-in threads."
            ]
        })

    # 4. Mandatory Recovery / PTO Vacation Usage
    if pto_deficit >= 8.0 or exhaustion >= 3.8 or "EMOTIONAL_EXHAUSTION" in detected_themes:
        recommendations.append({
            "category": "TIME_OFF_LEAVE",
            "action_type": "PTO_UTILIZATION_NUDGE",
            "title": f"Initiate Rest & Recovery Window for {team_name}",
            "estimated_impact": "HIGH" if exhaustion >= 4.0 else "MEDIUM",
            "rationale": (
                f"Pulse survey exhaustion index ({exhaustion:.1f}/5.0) has reached warning levels alongside an accrued PTO deficit of {pto_deficit:.1f} days. "
                "Rest deficit is the leading predictor of acute workplace detachment."
            ),
            "suggested_action_plan": [
                "Managers should proactively prompt team members with high accrued leave balances to schedule upcoming time off.",
                "Enforce a 'coverage buddy' model so team members can completely disconnect during PTO without checking emails.",
                "Ensure managers visibly model healthy PTO habits by not responding to messages during leave."
            ]
        })

    # 5. After-Hours Communication & Async Guidelines
    if after_hours >= 35 or weekend >= 3.0:
        recommendations.append({
            "category": "TEAM_WELLNESS_ACTION",
            "action_type": "ASYNC_COMM_POLICY",
            "title": f"Establish Asynchronous Off-Hours Communication Norms",
            "estimated_impact": "MEDIUM",
            "rationale": (
                f"High volume of after-hours messages ({int(after_hours)} events) creates implicit pressure for immediate response, "
                "preventing psychological detachment and cognitive recovery."
            ),
            "suggested_action_plan": [
                "Configure email and chat platforms to default to 'Schedule Send' during business hours for non-urgent items.",
                "Clarify explicit SLAs: non-incident messages after 7:00 PM require no response until the following morning.",
                "Encourage team members to mute mobile work notifications outside standard working windows."
            ]
        })

    # 6. Low Managerial Support / Psychological Safety
    if support <= 3.0 or "MANAGEMENT_AND_SUPPORT" in detected_themes:
        recommendations.append({
            "category": "TEAM_WELLNESS_ACTION",
            "action_type": "MANAGER_1ON1_CADENCE_REVIEW",
            "title": f"Strengthen Managerial 1:1 Check-In Cadence for {team_name}",
            "estimated_impact": "MEDIUM",
            "rationale": (
                f"Aggregated team support rating ({support:.1f}/5.0) indicates team members feel unassisted during technical blockers or workload bottlenecks."
            ),
            "suggested_action_plan": [
                "Ensure bi-weekly 1:1s prioritize workload manageability and well-being rather than solely task status updates.",
                "Provide frontline managers with coaching on recognizing early subtle burnout and disengagement indicators.",
                "Foster open retrospective forums where blockers can be surfaced without attribution fear."
            ]
        })

    # If no severe risk trigger, maintain positive reinforcement
    if not recommendations:
        recommendations.append({
            "category": "TEAM_WELLNESS_ACTION",
            "action_type": "SUSTAINABLE_PRACTICE_PRESERVATION",
            "title": f"Maintain Current Sustainable Rhythm for {team_name}",
            "estimated_impact": "LOW",
            "rationale": (
                f"Team demonstrates a balanced wellness profile (Risk Score: {burnout_risk_score:.1f}, Category: {risk_category}). "
                "Workload indicators are within optimal ergonomic operating boundaries."
            ),
            "suggested_action_plan": [
                "Document existing sprint planning rituals as a best practice playbook for other departments.",
                "Continue monitoring weekly pulse check-ins to catch any emerging delivery strains early."
            ]
        })

    return recommendations
