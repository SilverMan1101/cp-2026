-- ==============================================================================
-- EmotionSense Platform - Seed Benchmark Dataset
-- Sample Multi-Tenant Enterprise: TechNova Solutions
-- ==============================================================================

-- 1. Organization
INSERT INTO organizations (id, name, domain, subscription_tier, k_anonymity_threshold, created_at)
VALUES ('org-technova-01', 'TechNova Solutions Inc.', 'technova.com', 'ENTERPRISE', 5, CURRENT_TIMESTAMP - INTERVAL '120 days');

-- 2. Departments
INSERT INTO departments (id, organization_id, name, code, created_at) VALUES
('dept-eng', 'org-technova-01', 'Software Engineering', 'ENG', CURRENT_TIMESTAMP - INTERVAL '120 days'),
('dept-prod', 'org-technova-01', 'Product & Design', 'PROD', CURRENT_TIMESTAMP - INTERVAL '120 days'),
('dept-cs', 'org-technova-01', 'Customer Success & Support', 'CS', CURRENT_TIMESTAMP - INTERVAL '120 days'),
('dept-sales', 'org-technova-01', 'Enterprise Sales', 'SALES', CURRENT_TIMESTAMP - INTERVAL '120 days');

-- 3. Teams
INSERT INTO teams (id, organization_id, department_id, name, created_at) VALUES
('team-core-backend', 'org-technova-01', 'dept-eng', 'Core Backend & Platform', CURRENT_TIMESTAMP - INTERVAL '120 days'),
('team-frontend-web', 'org-technova-01', 'dept-eng', 'Frontend Experience', CURRENT_TIMESTAMP - INTERVAL '120 days'),
('team-devops-sre', 'org-technova-01', 'dept-eng', 'Cloud & Site Reliability (SRE)', CURRENT_TIMESTAMP - INTERVAL '120 days'),
('team-product-growth', 'org-technova-01', 'dept-prod', 'Growth & Analytics', CURRENT_TIMESTAMP - INTERVAL '120 days'),
('team-ui-ux', 'org-technova-01', 'dept-prod', 'Product Design & UX', CURRENT_TIMESTAMP - INTERVAL '120 days'),
('team-tier2-support', 'org-technova-01', 'dept-cs', 'Tier-2 Technical Escalations', CURRENT_TIMESTAMP - INTERVAL '120 days'),
('team-client-success', 'org-technova-01', 'dept-cs', 'Global Accounts Care', CURRENT_TIMESTAMP - INTERVAL '120 days'),
('team-sales-na', 'org-technova-01', 'dept-sales', 'North America Sales', CURRENT_TIMESTAMP - INTERVAL '120 days');

-- 4. Users (Pass: 'password123' bcrypt hash: $2a$10$e7ZtAekxSgKz9zHqXv2N4uS1sHsmW6yJv6oJc7rX4o1fH7g4l6o9y or simplified)
INSERT INTO users (id, organization_id, email, password_hash, full_name, role, department_id, team_id, is_active) VALUES
('usr-hr-admin', 'org-technova-01', 'hr@technova.com', '$2a$10$w81W6/Wn.5yqE0RjYj2V2eR8158W8mXy6gH7j.7v5kE3b4s9w3f8K', 'Sarah Jenkins', 'HR_ADMIN', 'dept-eng', 'team-core-backend', true),
('usr-mgr-eng', 'org-technova-01', 'david.eng@technova.com', '$2a$10$w81W6/Wn.5yqE0RjYj2V2eR8158W8mXy6gH7j.7v5kE3b4s9w3f8K', 'David Zhang', 'MANAGER', 'dept-eng', 'team-core-backend', true),
('usr-mgr-sre', 'org-technova-01', 'elena.sre@technova.com', '$2a$10$w81W6/Wn.5yqE0RjYj2V2eR8158W8mXy6gH7j.7v5kE3b4s9w3f8K', 'Elena Rostova', 'MANAGER', 'dept-eng', 'team-devops-sre', true),
('usr-mgr-cs', 'org-technova-01', 'marcus.cs@technova.com', '$2a$10$w81W6/Wn.5yqE0RjYj2V2eR8158W8mXy6gH7j.7v5kE3b4s9w3f8K', 'Marcus Vance', 'MANAGER', 'dept-cs', 'team-tier2-support', true),
('usr-emp-01', 'org-technova-01', 'alex.chen@technova.com', '$2a$10$w81W6/Wn.5yqE0RjYj2V2eR8158W8mXy6gH7j.7v5kE3b4s9w3f8K', 'Alex Chen', 'EMPLOYEE', 'dept-eng', 'team-core-backend', true),
('usr-emp-02', 'org-technova-01', 'priya.patel@technova.com', '$2a$10$w81W6/Wn.5yqE0RjYj2V2eR8158W8mXy6gH7j.7v5kE3b4s9w3f8K', 'Priya Patel', 'EMPLOYEE', 'dept-eng', 'team-devops-sre', true),
('usr-emp-03', 'org-technova-01', 'jordan.taylor@technova.com', '$2a$10$w81W6/Wn.5yqE0RjYj2V2eR8158W8mXy6gH7j.7v5kE3b4s9w3f8K', 'Jordan Taylor', 'EMPLOYEE', 'dept-cs', 'team-tier2-support', true),
('usr-emp-04', 'org-technova-01', 'maria.gonzalez@technova.com', '$2a$10$w81W6/Wn.5yqE0RjYj2V2eR8158W8mXy6gH7j.7v5kE3b4s9w3f8K', 'Maria Gonzalez', 'EMPLOYEE', 'dept-prod', 'team-product-growth', true);

-- 5. Active Survey
INSERT INTO surveys (id, organization_id, title, description, cycle_type, is_active, start_date, end_date) VALUES
('srv-cycle-current', 'org-technova-01', 'Weekly Team Health & Work-Life Pulse', 'Continuous pseudonymous signal collection on workload, recovery, and support.', 'WEEKLY', true, CURRENT_DATE - INTERVAL '6 days', CURRENT_DATE + INTERVAL '1 days');

-- 6. Survey Questions (Standard validated organizational ergonomic dimensions)
INSERT INTO survey_questions (id, survey_id, dimension, prompt_text, sort_order) VALUES
('sq-01', 'srv-cycle-current', 'EXHAUSTION', 'How mentally drained or depleted did you feel at the end of this work week?', 1),
('sq-02', 'srv-cycle-current', 'WORKLOAD', 'How manageable was the volume and urgency of your assigned tasks?', 2),
('sq-03', 'srv-cycle-current', 'SUPPORT', 'Did you feel adequately supported by teammates and manager when blockers arose?', 3),
('sq-04', 'srv-cycle-current', 'AUTONOMY', 'Did you have sufficient focus time without excessive meeting disruptions?', 4),
('sq-05', 'srv-cycle-current', 'ENGAGEMENT', 'How enthusiastic and connected do you feel toward our upcoming milestones?', 5);

-- 7. Pseudonymous Survey Responses (Sample aggregate cohorts, meets k>=5)
INSERT INTO survey_responses (id, survey_id, organization_id, team_id, exhaustion_score, engagement_score, workload_score, support_score, feedback_text, sentiment_polarity, sentiment_label, submitted_at) VALUES
('resp-01', 'srv-cycle-current', 'org-technova-01', 'team-devops-sre', 4.5, 2.1, 4.8, 3.0, 'Late night incident alerts have ruined sleep for two straight weeks. We desperately need secondary on-call rotation.', -0.72, 'NEGATIVE', CURRENT_TIMESTAMP - INTERVAL '3 days'),
('resp-02', 'srv-cycle-current', 'org-technova-01', 'team-devops-sre', 4.2, 2.5, 4.4, 3.2, 'Too many context switches and urgent pipeline hotfixes during the weekend.', -0.55, 'NEGATIVE', CURRENT_TIMESTAMP - INTERVAL '2 days'),
('resp-03', 'srv-cycle-current', 'org-technova-01', 'team-devops-sre', 4.0, 2.8, 4.2, 3.5, 'Meeting load is fine, but constant production firefighting is draining team morale.', -0.48, 'NEGATIVE', CURRENT_TIMESTAMP - INTERVAL '2 days'),
('resp-04', 'srv-cycle-current', 'org-technova-01', 'team-devops-sre', 4.6, 2.0, 4.9, 2.8, 'Exhausted from back-to-back night shifts. Need urgent workload redistribution.', -0.81, 'NEGATIVE', CURRENT_TIMESTAMP - INTERVAL '1 days'),
('resp-05', 'srv-cycle-current', 'org-technova-01', 'team-devops-sre', 3.9, 3.0, 4.1, 3.8, 'Supportive team members, but total hours this sprint are unsustainable.', -0.35, 'NEGATIVE', CURRENT_TIMESTAMP - INTERVAL '1 days'),

('resp-06', 'srv-cycle-current', 'org-technova-01', 'team-core-backend', 3.2, 3.8, 3.4, 4.0, 'Good sprint progress, though the Wednesday release was tight. Focus time is decent.', 0.25, 'POSITIVE', CURRENT_TIMESTAMP - INTERVAL '2 days'),
('resp-07', 'srv-cycle-current', 'org-technova-01', 'team-core-backend', 2.8, 4.1, 3.0, 4.2, 'Clear specs and great code reviews. Workload feels balanced.', 0.60, 'POSITIVE', CURRENT_TIMESTAMP - INTERVAL '2 days'),
('resp-08', 'srv-cycle-current', 'org-technova-01', 'team-core-backend', 3.5, 3.5, 3.6, 3.9, 'Occasional late Slack messages, but generally manageable workload.', 0.10, 'NEUTRAL', CURRENT_TIMESTAMP - INTERVAL '1 days'),
('resp-09', 'srv-cycle-current', 'org-technova-01', 'team-core-backend', 2.9, 4.0, 3.1, 4.1, 'Feeling motivated. The new feature architecture is coming together cleanly.', 0.55, 'POSITIVE', CURRENT_TIMESTAMP - INTERVAL '1 days'),
('resp-10', 'srv-cycle-current', 'org-technova-01', 'team-core-backend', 3.1, 3.7, 3.3, 3.8, 'Sprint was reasonable, appreciate manager respecting after-hours quiet hours.', 0.40, 'POSITIVE', CURRENT_TIMESTAMP - INTERVAL '1 days'),

('resp-11', 'srv-cycle-current', 'org-technova-01', 'team-tier2-support', 4.1, 2.9, 4.3, 3.1, 'Ticket queues spiked significantly following the v2.4 cloud migration.', -0.40, 'NEGATIVE', CURRENT_TIMESTAMP - INTERVAL '3 days'),
('resp-12', 'srv-cycle-current', 'org-technova-01', 'team-tier2-support', 3.8, 3.2, 4.0, 3.5, 'Back-to-back customer escalation calls leaving zero buffer time for documentation.', -0.38, 'NEGATIVE', CURRENT_TIMESTAMP - INTERVAL '2 days'),
('resp-13', 'srv-cycle-current', 'org-technova-01', 'team-tier2-support', 4.3, 2.6, 4.5, 2.9, 'High stress levels dealing with frustrated enterprise clients without adequate tier-3 staffing.', -0.65, 'NEGATIVE', CURRENT_TIMESTAMP - INTERVAL '2 days'),
('resp-14', 'srv-cycle-current', 'org-technova-01', 'team-tier2-support', 3.7, 3.3, 3.9, 3.6, 'Team spirit is strong, but overtime is creeping up consistently.', -0.20, 'NEUTRAL', CURRENT_TIMESTAMP - INTERVAL '1 days'),
('resp-15', 'srv-cycle-current', 'org-technova-01', 'team-tier2-support', 3.9, 3.1, 4.1, 3.4, 'Need clearer escalation workflows to reduce after-hours on-call interruptions.', -0.32, 'NEGATIVE', CURRENT_TIMESTAMP - INTERVAL '1 days'),

('resp-16', 'srv-cycle-current', 'org-technova-01', 'team-product-growth', 2.2, 4.5, 2.6, 4.4, 'Excellent collaboration with design team. Highly energized by user test feedback.', 0.75, 'POSITIVE', CURRENT_TIMESTAMP - INTERVAL '2 days'),
('resp-17', 'srv-cycle-current', 'org-technova-01', 'team-product-growth', 2.4, 4.2, 2.8, 4.3, 'Smooth sprint planning and healthy work-life balance this cycle.', 0.68, 'POSITIVE', CURRENT_TIMESTAMP - INTERVAL '2 days'),
('resp-18', 'srv-cycle-current', 'org-technova-01', 'team-product-growth', 2.1, 4.6, 2.5, 4.6, 'Clear priorities and great support from our product lead.', 0.82, 'POSITIVE', CURRENT_TIMESTAMP - INTERVAL '1 days'),
('resp-19', 'srv-cycle-current', 'org-technova-01', 'team-product-growth', 2.5, 4.0, 2.9, 4.1, 'Good cadence, Friday focus time was respected.', 0.50, 'POSITIVE', CURRENT_TIMESTAMP - INTERVAL '1 days'),
('resp-20', 'srv-cycle-current', 'org-technova-01', 'team-product-growth', 2.3, 4.4, 2.7, 4.5, 'Sustainable workload and meaningful impact on Q3 growth metrics.', 0.70, 'POSITIVE', CURRENT_TIMESTAMP - INTERVAL '1 days');

-- 8. Workload Metrics (Recent weeks)
INSERT INTO workload_metrics (id, organization_id, team_id, week_start_date, avg_weekly_hours, avg_overtime_hours, avg_meeting_hours, weekend_active_hours, focus_time_hours, after_hours_messages_count) VALUES
-- SRE Team (High Stress / Overwork)
('wm-sre-w01', 'org-technova-01', 'team-devops-sre', CURRENT_DATE - INTERVAL '28 days', 48.5, 8.5, 14.2, 4.8, 12.0, 48),
('wm-sre-w02', 'org-technova-01', 'team-devops-sre', CURRENT_DATE - INTERVAL '21 days', 51.2, 11.2, 16.0, 6.2, 10.5, 62),
('wm-sre-w03', 'org-technova-01', 'team-devops-sre', CURRENT_DATE - INTERVAL '14 days', 53.8, 13.8, 17.5, 7.5, 9.2, 79),
('wm-sre-w04', 'org-technova-01', 'team-devops-sre', CURRENT_DATE - INTERVAL '7 days', 55.4, 15.4, 19.0, 8.6, 8.0, 94),

-- Tier 2 Support (Elevated Load)
('wm-cs-w01', 'org-technova-01', 'team-tier2-support', CURRENT_DATE - INTERVAL '28 days', 44.0, 4.0, 11.0, 2.0, 15.0, 25),
('wm-cs-w02', 'org-technova-01', 'team-tier2-support', CURRENT_DATE - INTERVAL '21 days', 46.5, 6.5, 12.5, 3.2, 14.0, 36),
('wm-cs-w03', 'org-technova-01', 'team-tier2-support', CURRENT_DATE - INTERVAL '14 days', 48.0, 8.0, 13.5, 4.0, 12.5, 45),
('wm-cs-w04', 'org-technova-01', 'team-tier2-support', CURRENT_DATE - INTERVAL '7 days', 49.5, 9.5, 14.8, 4.5, 11.0, 52),

-- Core Backend (Balanced / Moderate)
('wm-be-w01', 'org-technova-01', 'team-core-backend', CURRENT_DATE - INTERVAL '28 days', 41.5, 1.5, 12.0, 0.8, 18.0, 12),
('wm-be-w02', 'org-technova-01', 'team-core-backend', CURRENT_DATE - INTERVAL '21 days', 42.0, 2.0, 12.5, 1.0, 17.5, 15),
('wm-be-w03', 'org-technova-01', 'team-core-backend', CURRENT_DATE - INTERVAL '14 days', 43.2, 3.2, 13.0, 1.4, 16.8, 18),
('wm-be-w04', 'org-technova-01', 'team-core-backend', CURRENT_DATE - INTERVAL '7 days', 42.8, 2.8, 12.2, 1.1, 17.0, 14),

-- Product Growth (Healthy / Sustainable)
('wm-pg-w01', 'org-technova-01', 'team-product-growth', CURRENT_DATE - INTERVAL '28 days', 39.8, 0.0, 10.5, 0.2, 21.0, 5),
('wm-pg-w02', 'org-technova-01', 'team-product-growth', CURRENT_DATE - INTERVAL '21 days', 40.2, 0.5, 11.0, 0.3, 20.5, 6),
('wm-pg-w03', 'org-technova-01', 'team-product-growth', CURRENT_DATE - INTERVAL '14 days', 39.5, 0.0, 10.2, 0.1, 21.2, 4),
('wm-pg-w04', 'org-technova-01', 'team-product-growth', CURRENT_DATE - INTERVAL '7 days', 40.0, 0.2, 10.8, 0.2, 20.8, 7);

-- 9. Burnout Risk Assessments (ML Output Scores)
INSERT INTO burnout_assessments (id, organization_id, team_id, assessment_date, burnout_risk_score, wellness_index, risk_category, score_delta, confidence_score, primary_risk_driver, contributing_factors, model_version) VALUES
('ba-sre-latest', 'org-technova-01', 'team-devops-sre', CURRENT_DATE, 78.4, 32.5, 'HIGH', +9.2, 0.94, 'Excessive weekend shifts and overtime spike (>15 hrs)', '{"overtime_hours": 36, "weekend_activity": 28, "meeting_density": 18, "pulse_exhaustion": 18}', 'v1.0.0-rf'),
('ba-cs-latest', 'org-technova-01', 'team-tier2-support', CURRENT_DATE, 62.1, 48.0, 'MODERATE', +5.8, 0.91, 'Escalation ticket backlog and after-hours messaging', '{"overtime_hours": 26, "after_hours_msgs": 29, "unplanned_pto": 22, "pulse_exhaustion": 23}', 'v1.0.0-rf'),
('ba-be-latest', 'org-technova-01', 'team-core-backend', CURRENT_DATE, 34.6, 74.2, 'LOW', -1.2, 0.92, 'Sustainable work rhythm with minor sprint release spikes', '{"overtime_hours": 12, "meeting_density": 15, "pulse_exhaustion": 10}', 'v1.0.0-rf'),
('ba-pg-latest', 'org-technova-01', 'team-product-growth', CURRENT_DATE, 18.2, 88.5, 'LOW', -2.4, 0.95, 'Optimal focus time and balanced recovery intervals', '{"overtime_hours": 2, "meeting_density": 8, "pulse_exhaustion": 5}', 'v1.0.0-rf'),
('ba-fe-latest', 'org-technova-01', 'team-frontend-web', CURRENT_DATE, 39.0, 71.0, 'LOW', +1.5, 0.90, 'Sprint wrap-up deadlines; manageable workload', '{"overtime_hours": 14, "meeting_density": 16}', 'v1.0.0-rf'),
('ba-ux-latest', 'org-technova-01', 'team-ui-ux', CURRENT_DATE, 24.5, 82.0, 'LOW', -0.5, 0.93, 'Adequate focus time; positive pulse engagement', '{"overtime_hours": 4, "meeting_density": 10}', 'v1.0.0-rf'),
('ba-cls-latest', 'org-technova-01', 'team-client-success', CURRENT_DATE, 48.5, 60.0, 'MODERATE', +3.1, 0.89, 'End of quarter account renewal meeting saturation', '{"meeting_density": 34, "overtime_hours": 18}', 'v1.0.0-rf'),
('ba-sna-latest', 'org-technova-01', 'team-sales-na', CURRENT_DATE, 58.0, 52.0, 'MODERATE', +4.4, 0.88, 'Quarter-end deal closing pressure and travel fatigue', '{"overtime_hours": 28, "weekend_activity": 22}', 'v1.0.0-rf');

-- 10. AI-Powered Organizational Recommendations
INSERT INTO recommendations (id, organization_id, team_id, category, title, description, rationale, action_type, estimated_impact, status) VALUES
('rec-01', 'org-technova-01', 'team-devops-sre', 'WORKLOAD_BALANCING', 'Implement Secondary On-Call Rotation & Incident Handoff', 'Distribute critical cloud incident alerts across two rotating engineers rather than a single primary responder.', 'DevOps/SRE team logged 8.6 weekend hours and 94 after-hours alerts last week, pushing burnout risk to 78.4 (HIGH).', 'ONCALL_ROTATION_REDESIGN', 'HIGH', 'OPEN'),
('rec-02', 'org-technova-01', 'team-tier2-support', 'SCHEDULE_OPTIMIZATION', 'Institute Meeting-Free Deep Focus Mornings', 'Block Tuesday and Thursday mornings (9 AM - 12 PM) from internal syncs so engineers can clear complex escalation queues without interruptions.', 'Context switching and meeting density are consuming 32% of available productive hours during critical support surges.', 'NO_MEETING_BLOCK', 'MEDIUM', 'IN_PROGRESS'),
('rec-03', 'org-technova-01', 'team-devops-sre', 'TIME_OFF_LEAVE', 'Trigger Mandatory Comp-Time Recovery Window', 'Mandate 1 compensatory rest day following any weekend major production incident for affected on-call staff.', 'Consecutive multi-week high overtime has resulted in sharp sentiment drops (-0.72 polarity) and physical exhaustion signals.', 'COMP_TIME_RECOVERY', 'HIGH', 'OPEN'),
('rec-04', 'org-technova-01', NULL, 'TEAM_WELLNESS_ACTION', 'Establish Organization-Wide Async Slack Quiet Hours', 'Automate reminder on internal chat to delay non-urgent messaging between 7:00 PM and 8:30 AM local team time.', 'Cross-department after-hours messages increased by 38% month-over-month across engineering and customer success.', 'ASYNC_COMM_POLICY', 'MEDIUM', 'IN_PROGRESS'),
('rec-05', 'org-technova-01', 'team-sales-na', 'WORKLOAD_BALANCING', 'Mid-Quarter Pipeline Capacity Rebalancing', 'Adjust target review frequency from daily syncs to twice-weekly asynchronous summary dashboards.', 'Sales NA team shows creeping moderate risk (58.0) driven by meeting overload and weekend deck preparation.', 'CADENCE_OPTIMIZATION', 'LOW', 'RESOLVED');

-- 11. Real-Time Alerts
INSERT INTO alerts (id, organization_id, team_id, severity, alert_type, title, message, is_acknowledged, triggered_at) VALUES
('alt-01', 'org-technova-01', 'team-devops-sre', 'CRITICAL', 'OVERTIME_SPIKE', 'Severe Overtime and Weekend Workload Spike', 'Cloud & SRE logged 15.4 average overtime hours and 8.6 weekend active hours, exceeding the critical organizational threshold (12h/wk).', false, CURRENT_TIMESTAMP - INTERVAL '1 day'),
('alt-02', 'org-technova-01', 'team-tier2-support', 'WARNING', 'WELLNESS_DROP', 'Noticeable Drop in Team Wellness Index (-12%)', 'Tier-2 Support experienced a 12% drop in aggregated wellness over 14 days following the recent cloud migration escalation surge.', false, CURRENT_TIMESTAMP - INTERVAL '2 days'),
('alt-03', 'org-technova-01', 'team-sales-na', 'INFO', 'MEETING_SATURATION', 'Meeting Hours Surpassed 18h/Week Benchmark', 'Sales NA team spent over 42% of standard working time in internal and external video conferences this week.', true, CURRENT_TIMESTAMP - INTERVAL '4 days');

-- 12. Audit Logs
INSERT INTO audit_logs (id, organization_id, user_id, action, resource_type, resource_id, ip_address, details) VALUES
('aud-01', 'org-technova-01', 'usr-hr-admin', 'LOGIN_SUCCESS', 'AUTH', 'usr-hr-admin', '192.168.1.100', '{"method": "JWT", "client": "EmotionSense Web Dashboard"}'),
('aud-02', 'org-technova-01', 'usr-hr-admin', 'VIEW_EXECUTIVE_DASHBOARD', 'ANALYTICS', 'org-technova-01', '192.168.1.100', '{"filter": "All Departments", "time_range": "30D"}'),
('aud-03', 'org-technova-01', 'usr-hr-admin', 'EXPORT_REPORT_PDF', 'REPORT', 'weekly-summary-2026-w38', '192.168.1.100', '{"format": "PDF", "cohort": "Organization-Wide"}');
