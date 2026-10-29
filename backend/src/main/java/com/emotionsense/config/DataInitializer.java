package com.emotionsense.config;

import com.emotionsense.model.*;
import com.emotionsense.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final OrganizationRepository organizationRepository;
    private final DepartmentRepository departmentRepository;
    private final TeamRepository teamRepository;
    private final UserRepository userRepository;
    private final SurveyRepository surveyRepository;
    private final SurveyQuestionRepository surveyQuestionRepository;
    private final SurveyResponseRepository surveyResponseRepository;
    private final WorkloadMetricRepository workloadMetricRepository;
    private final BurnoutAssessmentRepository burnoutAssessmentRepository;
    private final RecommendationRepository recommendationRepository;
    private final AlertRepository alertRepository;
    private final AuditLogRepository auditLogRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (organizationRepository.count() > 0) {
            log.info("Database already populated. Skipping initialization.");
            return;
        }

        log.info("Seeding EmotionSense benchmark enterprise dataset...");

        // 1. Organization
        Organization org = Organization.builder()
                .id("org-technova-01")
                .name("TechNova Solutions Inc.")
                .domain("technova.com")
                .subscriptionTier("ENTERPRISE")
                .kAnonymityThreshold(5)
                .build();
        organizationRepository.save(org);

        // 2. Departments
        Department deptEng = Department.builder().id("dept-eng").organizationId(org.getId()).name("Software Engineering").code("ENG").build();
        Department deptProd = Department.builder().id("dept-prod").organizationId(org.getId()).name("Product & Design").code("PROD").build();
        Department deptCs = Department.builder().id("dept-cs").organizationId(org.getId()).name("Customer Success & Support").code("CS").build();
        Department deptSales = Department.builder().id("dept-sales").organizationId(org.getId()).name("Enterprise Sales").code("SALES").build();
        departmentRepository.saveAll(List.of(deptEng, deptProd, deptCs, deptSales));

        // 3. Teams
        Team teamBackend = Team.builder().id("team-core-backend").organizationId(org.getId()).departmentId(deptEng.getId()).name("Core Backend & Platform").build();
        Team teamFrontend = Team.builder().id("team-frontend-web").organizationId(org.getId()).departmentId(deptEng.getId()).name("Frontend Experience").build();
        Team teamSre = Team.builder().id("team-devops-sre").organizationId(org.getId()).departmentId(deptEng.getId()).name("Cloud & Site Reliability (SRE)").build();
        Team teamGrowth = Team.builder().id("team-product-growth").organizationId(org.getId()).departmentId(deptProd.getId()).name("Growth & Analytics").build();
        Team teamUx = Team.builder().id("team-ui-ux").organizationId(org.getId()).departmentId(deptProd.getId()).name("Product Design & UX").build();
        Team teamSupport = Team.builder().id("team-tier2-support").organizationId(org.getId()).departmentId(deptCs.getId()).name("Tier-2 Technical Escalations").build();
        Team teamCare = Team.builder().id("team-client-success").organizationId(org.getId()).departmentId(deptCs.getId()).name("Global Accounts Care").build();
        Team teamSales = Team.builder().id("team-sales-na").organizationId(org.getId()).departmentId(deptSales.getId()).name("North America Sales").build();
        teamRepository.saveAll(List.of(teamBackend, teamFrontend, teamSre, teamGrowth, teamUx, teamSupport, teamCare, teamSales));

        // 4. Users (Password: password123)
        String passHash = passwordEncoder.encode("password123");
        User hrUser = User.builder().id("usr-hr-admin").organizationId(org.getId()).email("hr@technova.com").passwordHash(passHash).fullName("Sarah Jenkins").role(Role.HR_ADMIN).departmentId(deptEng.getId()).teamId(teamBackend.getId()).build();
        User mgrEng = User.builder().id("usr-mgr-eng").organizationId(org.getId()).email("david.eng@technova.com").passwordHash(passHash).fullName("David Zhang").role(Role.MANAGER).departmentId(deptEng.getId()).teamId(teamBackend.getId()).build();
        User mgrSre = User.builder().id("usr-mgr-sre").organizationId(org.getId()).email("elena.sre@technova.com").passwordHash(passHash).fullName("Elena Rostova").role(Role.MANAGER).departmentId(deptEng.getId()).teamId(teamSre.getId()).build();
        User empDev = User.builder().id("usr-emp-01").organizationId(org.getId()).email("alex.chen@technova.com").passwordHash(passHash).fullName("Alex Chen").role(Role.EMPLOYEE).departmentId(deptEng.getId()).teamId(teamBackend.getId()).build();
        User empSre = User.builder().id("usr-emp-02").organizationId(org.getId()).email("priya.patel@technova.com").passwordHash(passHash).fullName("Priya Patel").role(Role.EMPLOYEE).departmentId(deptEng.getId()).teamId(teamSre.getId()).build();
        User empCs = User.builder().id("usr-emp-03").organizationId(org.getId()).email("jordan.taylor@technova.com").passwordHash(passHash).fullName("Jordan Taylor").role(Role.EMPLOYEE).departmentId(deptCs.getId()).teamId(teamSupport.getId()).build();
        userRepository.saveAll(List.of(hrUser, mgrEng, mgrSre, empDev, empSre, empCs));

        // 5. Active Survey & Questions
        Survey survey = Survey.builder()
                .id("srv-cycle-current")
                .organizationId(org.getId())
                .title("Weekly Workplace Health & Work-Life Pulse")
                .description("Continuous pseudonymous pulse signal collection on workload, recovery, and psychological safety.")
                .cycleType("WEEKLY")
                .isActive(true)
                .startDate(LocalDate.now().minusDays(6))
                .endDate(LocalDate.now().plusDays(2))
                .build();
        surveyRepository.save(survey);

        SurveyQuestion q1 = SurveyQuestion.builder().id("sq-01").survey(survey).dimension("EXHAUSTION").promptText("How mentally drained or depleted did you feel at the end of this work week?").scaleMin(1).scaleMax(5).sortOrder(1).build();
        SurveyQuestion q2 = SurveyQuestion.builder().id("sq-02").survey(survey).dimension("WORKLOAD").promptText("How manageable was the volume and urgency of your assigned tasks?").scaleMin(1).scaleMax(5).sortOrder(2).build();
        SurveyQuestion q3 = SurveyQuestion.builder().id("sq-03").survey(survey).dimension("SUPPORT").promptText("Did you feel adequately supported by teammates and manager when blockers arose?").scaleMin(1).scaleMax(5).sortOrder(3).build();
        SurveyQuestion q4 = SurveyQuestion.builder().id("sq-04").survey(survey).dimension("AUTONOMY").promptText("Did you have sufficient focus time without excessive meeting disruptions?").scaleMin(1).scaleMax(5).sortOrder(4).build();
        SurveyQuestion q5 = SurveyQuestion.builder().id("sq-05").survey(survey).dimension("ENGAGEMENT").promptText("How enthusiastic and connected do you feel toward our upcoming milestones?").scaleMin(1).scaleMax(5).sortOrder(5).build();
        surveyQuestionRepository.saveAll(List.of(q1, q2, q3, q4, q5));

        // 6. Pseudonymous Survey Responses (K-anonymity >= 5)
        SurveyResponse r1 = SurveyResponse.builder().id("resp-01").surveyId(survey.getId()).organizationId(org.getId()).teamId(teamSre.getId()).exhaustionScore(4.5).engagementScore(2.1).workloadScore(4.8).supportScore(3.0).feedbackText("Late night incident alerts have ruined sleep for two straight weeks.").sentimentPolarity(-0.72).sentimentLabel("NEGATIVE").build();
        SurveyResponse r2 = SurveyResponse.builder().id("resp-02").surveyId(survey.getId()).organizationId(org.getId()).teamId(teamSre.getId()).exhaustionScore(4.2).engagementScore(2.5).workloadScore(4.4).supportScore(3.2).feedbackText("Too many context switches and urgent pipeline hotfixes during the weekend.").sentimentPolarity(-0.55).sentimentLabel("NEGATIVE").build();
        SurveyResponse r3 = SurveyResponse.builder().id("resp-03").surveyId(survey.getId()).organizationId(org.getId()).teamId(teamSre.getId()).exhaustionScore(4.0).engagementScore(2.8).workloadScore(4.2).supportScore(3.5).feedbackText("Meeting load is fine, but constant production firefighting is draining team morale.").sentimentPolarity(-0.48).sentimentLabel("NEGATIVE").build();
        SurveyResponse r4 = SurveyResponse.builder().id("resp-04").surveyId(survey.getId()).organizationId(org.getId()).teamId(teamSre.getId()).exhaustionScore(4.6).engagementScore(2.0).workloadScore(4.9).supportScore(2.8).feedbackText("Exhausted from back-to-back night shifts. Need urgent workload redistribution.").sentimentPolarity(-0.81).sentimentLabel("NEGATIVE").build();
        SurveyResponse r5 = SurveyResponse.builder().id("resp-05").surveyId(survey.getId()).organizationId(org.getId()).teamId(teamSre.getId()).exhaustionScore(3.9).engagementScore(3.0).workloadScore(4.1).supportScore(3.8).feedbackText("Supportive teammates, but total hours this sprint are unsustainable.").sentimentPolarity(-0.35).sentimentLabel("NEGATIVE").build();

        SurveyResponse r6 = SurveyResponse.builder().id("resp-06").surveyId(survey.getId()).organizationId(org.getId()).teamId(teamBackend.getId()).exhaustionScore(3.2).engagementScore(3.8).workloadScore(3.4).supportScore(4.0).feedbackText("Good sprint progress, though Wednesday release was tight.").sentimentPolarity(0.25).sentimentLabel("POSITIVE").build();
        SurveyResponse r7 = SurveyResponse.builder().id("resp-07").surveyId(survey.getId()).organizationId(org.getId()).teamId(teamBackend.getId()).exhaustionScore(2.8).engagementScore(4.1).workloadScore(3.0).supportScore(4.2).feedbackText("Clear specs and great code reviews. Workload feels balanced.").sentimentPolarity(0.60).sentimentLabel("POSITIVE").build();
        SurveyResponse r8 = SurveyResponse.builder().id("resp-08").surveyId(survey.getId()).organizationId(org.getId()).teamId(teamBackend.getId()).exhaustionScore(3.5).engagementScore(3.5).workloadScore(3.6).supportScore(3.9).feedbackText("Occasional late Slack messages, but generally manageable workload.").sentimentPolarity(0.10).sentimentLabel("NEUTRAL").build();
        SurveyResponse r9 = SurveyResponse.builder().id("resp-09").surveyId(survey.getId()).organizationId(org.getId()).teamId(teamBackend.getId()).exhaustionScore(2.9).engagementScore(4.0).workloadScore(3.1).supportScore(4.1).feedbackText("Feeling motivated. The new feature architecture is coming together cleanly.").sentimentPolarity(0.55).sentimentLabel("POSITIVE").build();
        SurveyResponse r10 = SurveyResponse.builder().id("resp-10").surveyId(survey.getId()).organizationId(org.getId()).teamId(teamBackend.getId()).exhaustionScore(3.1).engagementScore(3.7).workloadScore(3.3).supportScore(3.8).feedbackText("Sprint was reasonable, appreciate manager respecting after-hours quiet hours.").sentimentPolarity(0.40).sentimentLabel("POSITIVE").build();
        surveyResponseRepository.saveAll(List.of(r1, r2, r3, r4, r5, r6, r7, r8, r9, r10));

        // 7. Workload Metrics
        WorkloadMetric wmSre = WorkloadMetric.builder().id("wm-sre").organizationId(org.getId()).teamId(teamSre.getId()).weekStartDate(LocalDate.now().minusDays(7)).avgWeeklyHours(55.4).avgOvertimeHours(15.4).avgMeetingHours(19.0).weekendActiveHours(8.6).focusTimeHours(8.0).afterHoursMessagesCount(94).build();
        WorkloadMetric wmCs = WorkloadMetric.builder().id("wm-cs").organizationId(org.getId()).teamId(teamSupport.getId()).weekStartDate(LocalDate.now().minusDays(7)).avgWeeklyHours(49.5).avgOvertimeHours(9.5).avgMeetingHours(14.8).weekendActiveHours(4.5).focusTimeHours(11.0).afterHoursMessagesCount(52).build();
        WorkloadMetric wmBe = WorkloadMetric.builder().id("wm-be").organizationId(org.getId()).teamId(teamBackend.getId()).weekStartDate(LocalDate.now().minusDays(7)).avgWeeklyHours(42.8).avgOvertimeHours(2.8).avgMeetingHours(12.2).weekendActiveHours(1.1).focusTimeHours(17.0).afterHoursMessagesCount(14).build();
        WorkloadMetric wmPg = WorkloadMetric.builder().id("wm-pg").organizationId(org.getId()).teamId(teamGrowth.getId()).weekStartDate(LocalDate.now().minusDays(7)).avgWeeklyHours(40.0).avgOvertimeHours(0.2).avgMeetingHours(10.8).weekendActiveHours(0.2).focusTimeHours(20.8).afterHoursMessagesCount(7).build();
        workloadMetricRepository.saveAll(List.of(wmSre, wmCs, wmBe, wmPg));

        // 8. Burnout Assessments
        BurnoutAssessment baSre = BurnoutAssessment.builder().id("ba-sre").organizationId(org.getId()).teamId(teamSre.getId()).assessmentDate(LocalDate.now()).burnoutRiskScore(78.4).wellnessIndex(32.5).riskCategory("HIGH").scoreDelta(9.2).confidenceScore(0.94).primaryRiskDriver("Excessive weekend shifts and overtime spike (>15 hrs)").contributingFactors("{\"overtime_workload\": 36.0, \"weekend_interruption\": 28.0, \"meeting_saturation\": 18.0}").build();
        BurnoutAssessment baCs = BurnoutAssessment.builder().id("ba-cs").organizationId(org.getId()).teamId(teamSupport.getId()).assessmentDate(LocalDate.now()).burnoutRiskScore(62.1).wellnessIndex(48.0).riskCategory("MODERATE").scoreDelta(5.8).confidenceScore(0.91).primaryRiskDriver("Escalation ticket backlog and after-hours messaging").contributingFactors("{\"overtime_workload\": 26.0, \"after_hours_messaging\": 29.0}").build();
        BurnoutAssessment baBe = BurnoutAssessment.builder().id("ba-be").organizationId(org.getId()).teamId(teamBackend.getId()).assessmentDate(LocalDate.now()).burnoutRiskScore(34.6).wellnessIndex(74.2).riskCategory("LOW").scoreDelta(-1.2).confidenceScore(0.92).primaryRiskDriver("Sustainable work rhythm with minor sprint release spikes").contributingFactors("{\"overtime_workload\": 12.0, \"meeting_saturation\": 15.0}").build();
        BurnoutAssessment baPg = BurnoutAssessment.builder().id("ba-pg").organizationId(org.getId()).teamId(teamGrowth.getId()).assessmentDate(LocalDate.now()).burnoutRiskScore(18.2).wellnessIndex(88.5).riskCategory("LOW").scoreDelta(-2.4).confidenceScore(0.95).primaryRiskDriver("Optimal focus time and balanced recovery intervals").contributingFactors("{\"meeting_saturation\": 8.0}").build();
        burnoutAssessmentRepository.saveAll(List.of(baSre, baCs, baBe, baPg));

        // 9. AI Recommendations
        Recommendation rec1 = Recommendation.builder().id("rec-01").organizationId(org.getId()).teamId(teamSre.getId()).category("WORKLOAD_BALANCING").actionType("ONCALL_ROTATION_REDESIGN").title("Implement Secondary On-Call Rotation & Incident Handoff").description("Distribute critical cloud incident alerts across two rotating engineers rather than a single primary responder.").rationale("DevOps/SRE team logged 8.6 weekend hours and 94 after-hours alerts last week, pushing burnout risk to 78.4 (HIGH).").estimatedImpact("HIGH").status("OPEN").build();
        Recommendation rec2 = Recommendation.builder().id("rec-02").organizationId(org.getId()).teamId(teamSupport.getId()).category("SCHEDULE_OPTIMIZATION").actionType("NO_MEETING_BLOCK").title("Institute Meeting-Free Deep Focus Mornings").description("Block Tuesday and Thursday mornings (9 AM - 12 PM) from internal syncs so engineers can clear complex escalation queues without interruptions.").rationale("Context switching and meeting density are consuming 32% of available productive hours during critical support surges.").estimatedImpact("MEDIUM").status("IN_PROGRESS").build();
        Recommendation rec3 = Recommendation.builder().id("rec-03").organizationId(org.getId()).teamId(teamSre.getId()).category("TIME_OFF_LEAVE").actionType("COMP_TIME_RECOVERY").title("Trigger Mandatory Comp-Time Recovery Window").description("Mandate 1 compensatory rest day following any weekend major production incident for affected on-call staff.").rationale("Consecutive multi-week high overtime has resulted in sharp sentiment drops (-0.72 polarity) and physical exhaustion signals.").estimatedImpact("HIGH").status("OPEN").build();
        recommendationRepository.saveAll(List.of(rec1, rec2, rec3));

        // 10. Real-Time Alerts
        Alert alt1 = Alert.builder().id("alt-01").organizationId(org.getId()).teamId(teamSre.getId()).severity("CRITICAL").alertType("OVERTIME_SPIKE").title("Severe Overtime and Weekend Workload Spike").message("Cloud & SRE logged 15.4 average overtime hours and 8.6 weekend active hours, exceeding the critical organizational threshold (12h/wk).").isAcknowledged(false).triggeredAt(Instant.now().minus(1, ChronoUnit.DAYS)).build();
        Alert alt2 = Alert.builder().id("alt-02").organizationId(org.getId()).teamId(teamSupport.getId()).severity("WARNING").alertType("WELLNESS_DROP").title("Noticeable Drop in Team Wellness Index (-12%)").message("Tier-2 Support experienced a 12% drop in aggregated wellness over 14 days following the recent cloud migration escalation surge.").isAcknowledged(false).triggeredAt(Instant.now().minus(2, ChronoUnit.DAYS)).build();
        alertRepository.saveAll(List.of(alt1, alt2));

        // 11. Initial Audit Log
        AuditLog audit1 = AuditLog.builder().id("aud-01").organizationId(org.getId()).userId(hrUser.getId()).action("INITIAL_BENCHMARK_SEED").resourceType("SYSTEM").resourceId("org-technova-01").ipAddress("127.0.0.1").details("System initialized with benchmark enterprise dataset").createdAt(Instant.now()).build();
        auditLogRepository.save(audit1);

        log.info("EmotionSense benchmark enterprise dataset successfully seeded.");
    }
}
