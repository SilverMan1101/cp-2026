-- ==============================================================================
-- EmotionSense Platform - PostgreSQL Database Schema
-- Multi-Tenant B2B Workplace Wellness and Burnout Analytics
-- Privacy-Preserving Organizational Risk Architecture
-- ==============================================================================

-- Clean up existing tables in reverse dependency order
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS alerts CASCADE;
DROP TABLE IF EXISTS recommendations CASCADE;
DROP TABLE IF EXISTS burnout_assessments CASCADE;
DROP TABLE IF EXISTS leave_records CASCADE;
DROP TABLE IF EXISTS workload_metrics CASCADE;
DROP TABLE IF EXISTS survey_responses CASCADE;
DROP TABLE IF EXISTS survey_questions CASCADE;
DROP TABLE IF EXISTS surveys CASCADE;
DROP TABLE IF EXISTS pseudonymous_tokens CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS teams CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;

-- 1. Organizations (Tenants)
CREATE TABLE organizations (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE NOT NULL,
    subscription_tier VARCHAR(50) DEFAULT 'ENTERPRISE',
    k_anonymity_threshold INT DEFAULT 5, -- Minimum cohort size for aggregate reporting
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Departments
CREATE TABLE departments (
    id VARCHAR(64) PRIMARY KEY,
    organization_id VARCHAR(64) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_org_dept_code UNIQUE (organization_id, code)
);

-- 3. Teams
CREATE TABLE teams (
    id VARCHAR(64) PRIMARY KEY,
    organization_id VARCHAR(64) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    department_id VARCHAR(64) NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Users (Role-Based Access Control)
CREATE TABLE users (
    id VARCHAR(64) PRIMARY KEY,
    organization_id VARCHAR(64) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE')),
    department_id VARCHAR(64) REFERENCES departments(id) ON DELETE SET NULL,
    team_id VARCHAR(64) REFERENCES teams(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_org_user_email UNIQUE (organization_id, email)
);

-- 5. Pseudonymous Tokens (Decouples user identity from wellness submissions)
CREATE TABLE pseudonymous_tokens (
    id VARCHAR(64) PRIMARY KEY,
    organization_id VARCHAR(64) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    team_id VARCHAR(64) NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    cycle_identifier VARCHAR(64) NOT NULL, -- e.g., '2026-W38'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Wellness Surveys
CREATE TABLE surveys (
    id VARCHAR(64) PRIMARY KEY,
    organization_id VARCHAR(64) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    cycle_type VARCHAR(50) DEFAULT 'WEEKLY', -- WEEKLY, BIWEEKLY, MONTHLY
    is_active BOOLEAN DEFAULT TRUE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Survey Questions
CREATE TABLE survey_questions (
    id VARCHAR(64) PRIMARY KEY,
    survey_id VARCHAR(64) NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
    dimension VARCHAR(50) NOT NULL CHECK (dimension IN ('EXHAUSTION', 'ENGAGEMENT', 'WORKLOAD', 'SUPPORT', 'AUTONOMY')),
    prompt_text TEXT NOT NULL,
    scale_min INT DEFAULT 1,
    scale_max INT DEFAULT 5,
    sort_order INT DEFAULT 0
);

-- 8. Pseudonymous Survey Responses
CREATE TABLE survey_responses (
    id VARCHAR(64) PRIMARY KEY,
    survey_id VARCHAR(64) NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
    organization_id VARCHAR(64) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    team_id VARCHAR(64) NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    pseudonymous_token_id VARCHAR(64) REFERENCES pseudonymous_tokens(id) ON DELETE SET NULL,
    exhaustion_score NUMERIC(3,2) NOT NULL,  -- 1.00 to 5.00
    engagement_score NUMERIC(3,2) NOT NULL,  -- 1.00 to 5.00
    workload_score NUMERIC(3,2) NOT NULL,    -- 1.00 to 5.00
    support_score NUMERIC(3,2) NOT NULL,     -- 1.00 to 5.00
    feedback_text TEXT,
    sentiment_polarity NUMERIC(3,2),         -- -1.00 (negative) to +1.00 (positive)
    sentiment_label VARCHAR(32),             -- POSITIVE, NEUTRAL, NEGATIVE
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Workload Metrics (Aggregated or pseudonymized work rhythm indicators)
CREATE TABLE workload_metrics (
    id VARCHAR(64) PRIMARY KEY,
    organization_id VARCHAR(64) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    team_id VARCHAR(64) NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    week_start_date DATE NOT NULL,
    avg_weekly_hours NUMERIC(5,2) NOT NULL,
    avg_overtime_hours NUMERIC(5,2) NOT NULL,
    avg_meeting_hours NUMERIC(5,2) NOT NULL,
    weekend_active_hours NUMERIC(5,2) NOT NULL,
    focus_time_hours NUMERIC(5,2) NOT NULL,
    after_hours_messages_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_team_workload_week UNIQUE (team_id, week_start_date)
);

-- 10. Attendance and Leave Pattern Records
CREATE TABLE leave_records (
    id VARCHAR(64) PRIMARY KEY,
    organization_id VARCHAR(64) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    team_id VARCHAR(64) NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    month_identifier VARCHAR(10) NOT NULL, -- '2026-09'
    total_planned_pto_days INT DEFAULT 0,
    total_unplanned_sick_days INT DEFAULT 0,
    pto_utilization_rate NUMERIC(5,2) DEFAULT 0.0, -- Percentage of allotted vacation taken
    working_on_leave_events INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_team_leave_month UNIQUE (team_id, month_identifier)
);

-- 11. Burnout Risk Assessments (Produced by ML Model)
CREATE TABLE burnout_assessments (
    id VARCHAR(64) PRIMARY KEY,
    organization_id VARCHAR(64) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    team_id VARCHAR(64) NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    assessment_date DATE NOT NULL,
    burnout_risk_score NUMERIC(5,2) NOT NULL CHECK (burnout_risk_score >= 0 AND burnout_risk_score <= 100),
    wellness_index NUMERIC(5,2) NOT NULL CHECK (wellness_index >= 0 AND wellness_index <= 100),
    risk_category VARCHAR(32) NOT NULL CHECK (risk_category IN ('LOW', 'MODERATE', 'HIGH')),
    score_delta NUMERIC(5,2) DEFAULT 0.0, -- Change from previous assessment
    confidence_score NUMERIC(3,2) DEFAULT 0.90,
    primary_risk_driver VARCHAR(255),
    contributing_factors JSONB, -- Breakdown: {"overtime": 32, "meeting_density": 28, "unplanned_leave": 15}
    model_version VARCHAR(32) DEFAULT 'v1.0.0-rf',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. AI-Powered Organizational Recommendations
CREATE TABLE recommendations (
    id VARCHAR(64) PRIMARY KEY,
    organization_id VARCHAR(64) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    team_id VARCHAR(64) REFERENCES teams(id) ON DELETE CASCADE, -- NULL indicates Org-wide
    category VARCHAR(64) NOT NULL CHECK (category IN ('WORKLOAD_BALANCING', 'TIME_OFF_LEAVE', 'SCHEDULE_OPTIMIZATION', 'TEAM_WELLNESS_ACTION')),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    rationale TEXT NOT NULL,
    action_type VARCHAR(64) NOT NULL, -- e.g. 'NO_MEETING_DAY', 'SPRINT_CAPACITY_REDUCTION', 'PTO_MANDATE'
    estimated_impact VARCHAR(32) DEFAULT 'MEDIUM' CHECK (estimated_impact IN ('LOW', 'MEDIUM', 'HIGH')),
    status VARCHAR(32) DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'DISMISSED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. Real-Time Alerts
CREATE TABLE alerts (
    id VARCHAR(64) PRIMARY KEY,
    organization_id VARCHAR(64) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    team_id VARCHAR(64) REFERENCES teams(id) ON DELETE CASCADE,
    severity VARCHAR(32) NOT NULL CHECK (severity IN ('INFO', 'WARNING', 'CRITICAL')),
    alert_type VARCHAR(64) NOT NULL, -- 'OVERTIME_SPIKE', 'WELLNESS_DROP', 'MEETING_SATURATION'
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_acknowledged BOOLEAN DEFAULT FALSE,
    acknowledged_by VARCHAR(64) REFERENCES users(id),
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    triggered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. Audit Logs (GDPR / HIPAA / Enterprise Compliance)
CREATE TABLE audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    organization_id VARCHAR(64) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL, -- e.g. 'VIEW_ANALYTICS', 'EXPORT_REPORT_PDF', 'SUBMIT_SURVEY'
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(100),
    ip_address VARCHAR(45),
    user_agent TEXT,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_org ON users(organization_id);
CREATE INDEX idx_teams_dept ON teams(department_id);
CREATE INDEX idx_survey_responses_team ON survey_responses(team_id, submitted_at);
CREATE INDEX idx_workload_metrics_team ON workload_metrics(team_id, week_start_date);
CREATE INDEX idx_burnout_assessments_team ON burnout_assessments(team_id, assessment_date);
CREATE INDEX idx_recommendations_org_status ON recommendations(organization_id, status);
CREATE INDEX idx_alerts_org_unread ON alerts(organization_id, is_acknowledged);
CREATE INDEX idx_audit_logs_org_time ON audit_logs(organization_id, created_at DESC);
