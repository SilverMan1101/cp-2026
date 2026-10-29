export type UserRole = 'ADMIN' | 'HR_ADMIN' | 'MANAGER' | 'EMPLOYEE';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  organizationId: string;
  departmentId?: string;
  teamId?: string;
}

export interface RiskDistribution {
  low: { count: number; percentage: number };
  moderate: { count: number; percentage: number };
  high: { count: number; percentage: number };
  total_teams: number;
}

export interface DepartmentSummary {
  department_id: string;
  department_name: string;
  department_code: string;
  team_count: number;
  wellness_index: number;
  burnout_risk_score: number;
  risk_category: 'LOW' | 'MODERATE' | 'HIGH';
}

export interface TeamCard {
  team_id: string;
  team_name: string;
  department_id: string;
  burnout_risk_score: number;
  wellness_index: number;
  risk_category: 'LOW' | 'MODERATE' | 'HIGH';
  primary_risk_driver: string;
  score_delta: number;
  avg_overtime_hours: number;
  avg_meeting_hours: number;
  weekend_hours: number;
  k_anonymity_compliant: boolean;
}

export interface TrendPeriod {
  period: string;
  burnout_risk: number;
  wellness_index: number;
  avg_overtime: number;
}

export interface DashboardData {
  organization_id: string;
  organization_name: string;
  k_anonymity_threshold: number;
  wellness_index: number;
  burnout_risk_score: number;
  risk_distribution: RiskDistribution;
  departments: DepartmentSummary[];
  teams: TeamCard[];
  trend_timeline: TrendPeriod[];
  unread_alerts_count: number;
  open_recommendations_count: number;
}

export interface SurveyQuestion {
  id: string;
  dimension: string;
  prompt_text: string;
  scale_min: number;
  scale_max: number;
  sort_order: number;
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  cycle_type: string;
  is_active: boolean;
  start_date: string;
  end_date: string;
  questions?: SurveyQuestion[];
}

export interface Recommendation {
  id: string;
  organization_id: string;
  team_id?: string;
  category: 'WORKLOAD_BALANCING' | 'TIME_OFF_LEAVE' | 'SCHEDULE_OPTIMIZATION' | 'TEAM_WELLNESS_ACTION';
  title: string;
  description: string;
  rationale: string;
  action_type: string;
  estimated_impact: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'DISMISSED';
  created_at: string;
}

export interface Alert {
  id: string;
  organization_id: string;
  team_id?: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  alert_type: string;
  title: string;
  message: string;
  is_acknowledged: boolean;
  triggered_at: string;
}

export interface AuditLog {
  id: string;
  organization_id: string;
  user_id?: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  ip_address: string;
  details?: string;
  created_at: string;
}
