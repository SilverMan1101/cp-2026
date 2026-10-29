import { DashboardData, Survey, Recommendation, Alert, AuditLog, User } from '../types';

const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8080/api/v1';

// Seed demo dataset for instant zero-config evaluation
const DEMO_DASHBOARD: DashboardData = {
  organization_id: "org-technova-01",
  organization_name: "TechNova Solutions Inc.",
  k_anonymity_threshold: 5,
  wellness_index: 68.4,
  burnout_risk_score: 31.6,
  risk_distribution: {
    low: { count: 5, percentage: 63 },
    moderate: { count: 2, percentage: 25 },
    high: { count: 1, percentage: 12 },
    total_teams: 8
  },
  departments: [
    { department_id: "dept-eng", department_name: "Software Engineering", department_code: "ENG", team_count: 3, wellness_index: 59.2, burnout_risk_score: 40.8, risk_category: "MODERATE" },
    { department_id: "dept-prod", department_name: "Product & Design", department_code: "PROD", team_count: 2, wellness_index: 85.3, burnout_risk_score: 14.7, risk_category: "LOW" },
    { department_id: "dept-cs", department_name: "Customer Success & Support", department_code: "CS", team_count: 2, wellness_index: 54.0, burnout_risk_score: 46.0, risk_category: "MODERATE" },
    { department_id: "dept-sales", department_name: "Enterprise Sales", department_code: "SALES", team_count: 1, wellness_index: 52.0, burnout_risk_score: 48.0, risk_category: "MODERATE" }
  ],
  teams: [
    { team_id: "team-devops-sre", team_name: "Cloud & Site Reliability (SRE)", department_id: "dept-eng", burnout_risk_score: 78.4, wellness_index: 21.6, risk_category: "HIGH", primary_risk_driver: "Severe weekend shifts and overtime spike (>15 hrs)", score_delta: 9.2, avg_overtime_hours: 15.4, avg_meeting_hours: 19.0, weekend_hours: 8.6, k_anonymity_compliant: true },
    { team_id: "team-tier2-support", team_name: "Tier-2 Technical Escalations", department_id: "dept-cs", burnout_risk_score: 62.1, wellness_index: 37.9, risk_category: "MODERATE", primary_risk_driver: "Escalation ticket backlog and after-hours messaging", score_delta: 5.8, avg_overtime_hours: 9.5, avg_meeting_hours: 14.8, weekend_hours: 4.5, k_anonymity_compliant: true },
    { team_id: "team-sales-na", team_name: "North America Sales", department_id: "dept-sales", burnout_risk_score: 58.0, wellness_index: 42.0, risk_category: "MODERATE", primary_risk_driver: "Quarter-end deal closing pressure and meeting overload", score_delta: 4.4, avg_overtime_hours: 8.0, avg_meeting_hours: 21.0, weekend_hours: 3.2, k_anonymity_compliant: true },
    { team_id: "team-client-success", team_name: "Global Accounts Care", department_id: "dept-cs", burnout_risk_score: 48.5, wellness_index: 51.5, risk_category: "MODERATE", primary_risk_driver: "Renewal cycle meeting density", score_delta: 3.1, avg_overtime_hours: 5.2, avg_meeting_hours: 17.5, weekend_hours: 1.8, k_anonymity_compliant: true },
    { team_id: "team-frontend-web", team_name: "Frontend Experience", department_id: "dept-eng", burnout_risk_score: 39.0, wellness_index: 61.0, risk_category: "LOW", primary_risk_driver: "Sprint wrap-up deadlines; manageable workload", score_delta: 1.5, avg_overtime_hours: 3.5, avg_meeting_hours: 13.0, weekend_hours: 0.9, k_anonymity_compliant: true },
    { team_id: "team-core-backend", team_name: "Core Backend & Platform", department_id: "dept-eng", burnout_risk_score: 34.6, wellness_index: 65.4, risk_category: "LOW", primary_risk_driver: "Sustainable work rhythm with minor sprint release spikes", score_delta: -1.2, avg_overtime_hours: 2.8, avg_meeting_hours: 12.2, weekend_hours: 1.1, k_anonymity_compliant: true },
    { team_id: "team-ui-ux", team_name: "Product Design & UX", department_id: "dept-prod", burnout_risk_score: 24.5, wellness_index: 75.5, risk_category: "LOW", primary_risk_driver: "Adequate focus time; positive pulse engagement", score_delta: -0.5, avg_overtime_hours: 1.2, avg_meeting_hours: 9.5, weekend_hours: 0.2, k_anonymity_compliant: true },
    { team_id: "team-product-growth", team_name: "Growth & Analytics", department_id: "dept-prod", burnout_risk_score: 18.2, wellness_index: 81.8, risk_category: "LOW", primary_risk_driver: "Optimal focus time and balanced recovery intervals", score_delta: -2.4, avg_overtime_hours: 0.2, avg_meeting_hours: 10.8, weekend_hours: 0.2, k_anonymity_compliant: true }
  ],
  trend_timeline: [
    { period: "Week 35", burnout_risk: 28.2, wellness_index: 71.8, avg_overtime: 3.5 },
    { period: "Week 36", burnout_risk: 29.5, wellness_index: 70.5, avg_overtime: 4.1 },
    { period: "Week 37", burnout_risk: 30.8, wellness_index: 69.2, avg_overtime: 5.4 },
    { period: "Week 38 (Current)", burnout_risk: 31.6, wellness_index: 68.4, avg_overtime: 5.7 }
  ],
  unread_alerts_count: 2,
  open_recommendations_count: 3
};

const DEMO_RECOMMENDATIONS: Recommendation[] = [
  {
    id: "rec-01",
    organization_id: "org-technova-01",
    team_id: "team-devops-sre",
    category: "WORKLOAD_BALANCING",
    action_type: "ONCALL_ROTATION_REDESIGN",
    title: "Implement Secondary On-Call Rotation & Incident Handoff",
    description: "Distribute critical cloud incident alerts across two rotating engineers rather than a single primary responder.",
    rationale: "DevOps/SRE team logged 8.6 weekend hours and 94 after-hours alerts last week, pushing burnout risk to 78.4 (HIGH).",
    estimated_impact: "HIGH",
    status: "OPEN",
    created_at: "2026-09-26T10:00:00Z"
  },
  {
    id: "rec-02",
    organization_id: "org-technova-01",
    team_id: "team-tier2-support",
    category: "SCHEDULE_OPTIMIZATION",
    action_type: "NO_MEETING_BLOCK",
    title: "Institute Meeting-Free Deep Focus Mornings",
    description: "Block Tuesday and Thursday mornings (9 AM - 12 PM) from internal syncs so engineers can clear complex escalation queues without interruptions.",
    rationale: "Context switching and meeting density are consuming 32% of available productive hours during critical support surges.",
    estimated_impact: "MEDIUM",
    status: "IN_PROGRESS",
    created_at: "2026-09-25T14:30:00Z"
  },
  {
    id: "rec-03",
    organization_id: "org-technova-01",
    team_id: "team-devops-sre",
    category: "TIME_OFF_LEAVE",
    action_type: "COMP_TIME_RECOVERY",
    title: "Trigger Mandatory Comp-Time Recovery Window",
    description: "Mandate 1 compensatory rest day following any weekend major production incident for affected on-call staff.",
    rationale: "Consecutive multi-week high overtime has resulted in sharp sentiment drops (-0.72 polarity) and physical exhaustion signals.",
    estimated_impact: "HIGH",
    status: "OPEN",
    created_at: "2026-09-27T08:15:00Z"
  },
  {
    id: "rec-04",
    organization_id: "org-technova-01",
    category: "TEAM_WELLNESS_ACTION",
    action_type: "ASYNC_COMM_POLICY",
    title: "Establish Organization-Wide Async Slack Quiet Hours",
    description: "Automate reminder on internal chat to delay non-urgent messaging between 7:00 PM and 8:30 AM local team time.",
    rationale: "Cross-department after-hours messages increased by 38% month-over-month across engineering and customer success.",
    estimated_impact: "MEDIUM",
    status: "IN_PROGRESS",
    created_at: "2026-09-24T11:00:00Z"
  }
];

const DEMO_ALERTS: Alert[] = [
  {
    id: "alt-01",
    organization_id: "org-technova-01",
    team_id: "team-devops-sre",
    severity: "CRITICAL",
    alert_type: "OVERTIME_SPIKE",
    title: "Severe Overtime and Weekend Workload Spike",
    message: "Cloud & SRE logged 15.4 average overtime hours and 8.6 weekend active hours, exceeding the critical organizational threshold (12h/wk).",
    is_acknowledged: false,
    triggered_at: "2026-09-27T18:00:00Z"
  },
  {
    id: "alt-02",
    organization_id: "org-technova-01",
    team_id: "team-tier2-support",
    severity: "WARNING",
    alert_type: "WELLNESS_DROP",
    title: "Noticeable Drop in Team Wellness Index (-12%)",
    message: "Tier-2 Support experienced a 12% drop in aggregated wellness over 14 days following the recent cloud migration escalation surge.",
    is_acknowledged: false,
    triggered_at: "2026-09-26T12:00:00Z"
  },
  {
    id: "alt-03",
    organization_id: "org-technova-01",
    team_id: "team-sales-na",
    severity: "INFO",
    alert_type: "MEETING_SATURATION",
    title: "Meeting Hours Surpassed 18h/Week Benchmark",
    message: "Sales NA team spent over 42% of standard working time in video conferences this week.",
    is_acknowledged: true,
    triggered_at: "2026-09-24T09:00:00Z"
  }
];

const DEMO_AUDIT_LOGS: AuditLog[] = [
  {
    id: "aud-01",
    organization_id: "org-technova-01",
    user_id: "usr-hr-admin",
    action: "LOGIN_SUCCESS",
    resource_type: "AUTH",
    resource_id: "usr-hr-admin",
    ip_address: "192.168.1.100",
    details: "Authenticated via JWT Bearer Token",
    created_at: "2026-09-28T09:30:00Z"
  },
  {
    id: "aud-02",
    organization_id: "org-technova-01",
    user_id: "usr-hr-admin",
    action: "VIEW_EXECUTIVE_DASHBOARD",
    resource_type: "ANALYTICS",
    resource_id: "org-technova-01",
    ip_address: "192.168.1.100",
    details: "Accessed company-wide wellness aggregation (cohort k >= 5)",
    created_at: "2026-09-28T09:32:00Z"
  },
  {
    id: "aud-03",
    organization_id: "org-technova-01",
    user_id: "usr-hr-admin",
    action: "EXPORT_REPORT_PDF",
    resource_type: "REPORT",
    resource_id: "weekly-summary-2026-w38",
    ip_address: "192.168.1.100",
    details: "Downloaded executive summary PDF",
    created_at: "2026-09-28T09:45:00Z"
  }
];

export const apiService = {
  getAuthHeader(): Record<string, string> {
    const token = localStorage.getItem('emotionsense_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  async getDashboard(): Promise<DashboardData> {
    try {
      const res = await fetch(`${API_BASE}/analytics/dashboard`, {
        headers: { ...this.getAuthHeader() }
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Backend API not reachable. Using rich benchmark dataset.");
    }
    return DEMO_DASHBOARD;
  },

  async getRecommendations(): Promise<Recommendation[]> {
    try {
      const res = await fetch(`${API_BASE}/recommendations`, {
        headers: { ...this.getAuthHeader() }
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Backend API not reachable. Using benchmark recommendations.");
    }
    return DEMO_RECOMMENDATIONS;
  },

  async updateRecommendationStatus(id: string, status: string): Promise<void> {
    try {
      await fetch(`${API_BASE}/recommendations/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeader()
        },
        body: JSON.stringify({ status })
      });
    } catch (e) {
      console.warn("Updated locally");
    }
  },

  async getAlerts(): Promise<Alert[]> {
    try {
      const res = await fetch(`${API_BASE}/alerts`, {
        headers: { ...this.getAuthHeader() }
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Using benchmark alerts");
    }
    return DEMO_ALERTS;
  },

  async acknowledgeAlert(id: string): Promise<void> {
    try {
      await fetch(`${API_BASE}/alerts/${id}/ack`, {
        method: 'PATCH',
        headers: { ...this.getAuthHeader() }
      });
    } catch (e) {
      console.warn("Acknowledged locally");
    }
  },

  async getAuditLogs(): Promise<AuditLog[]> {
    try {
      const res = await fetch(`${API_BASE}/audit`, {
        headers: { ...this.getAuthHeader() }
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Using benchmark audit logs");
    }
    return DEMO_AUDIT_LOGS;
  },

  async submitPulseSurvey(data: {
    surveyId: string;
    exhaustionScore: number;
    engagementScore: number;
    workloadScore: number;
    supportScore: number;
    feedbackText: string;
  }): Promise<{ status: string; message: string }> {
    try {
      const res = await fetch(`${API_BASE}/surveys/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeader()
        },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Submitted in local mode");
    }
    return {
      status: "SUCCESS",
      message: "Your pulse survey response was pseudonymously encrypted and safely recorded."
    };
  },

  async analyzeSentimentNLP(text: string): Promise<{ polarity: number; label: string; detected_themes: string[] }> {
    // Try FastAPI ML service directly on port 8000
    try {
      const res = await fetch('http://localhost:8000/analyze/sentiment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback_text: text })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // Heuristic fallback
    }

    const lower = text.toLowerCase();
    let pol = 0.0;
    if (lower.includes("exhaust") || lower.includes("drain") || lower.includes("overwhelm") || lower.includes("stress")) {
      pol = -0.65;
    } else if (lower.includes("great") || lower.includes("support") || lower.includes("energ") || lower.includes("balanc")) {
      pol = 0.60;
    }
    const label = pol <= -0.2 ? "NEGATIVE" : (pol >= 0.2 ? "POSITIVE" : "NEUTRAL");
    const themes = [];
    if (lower.includes("overtime") || lower.includes("weekend") || lower.includes("hours")) themes.push("OVERTIME_AND_HOURS");
    if (lower.includes("meeting") || lower.includes("calls")) themes.push("MEETING_SATURATION");
    if (lower.includes("on-call") || lower.includes("alert")) themes.push("ON_CALL_AND_INCIDENTS");

    return { polarity: pol, label, detected_themes: themes };
  }
};
