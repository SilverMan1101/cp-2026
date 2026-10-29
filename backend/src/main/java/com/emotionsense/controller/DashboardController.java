package com.emotionsense.controller;

import com.emotionsense.model.BurnoutAssessment;
import com.emotionsense.model.WorkloadMetric;
import com.emotionsense.repository.BurnoutAssessmentRepository;
import com.emotionsense.repository.TeamRepository;
import com.emotionsense.repository.WorkloadMetricRepository;
import com.emotionsense.security.UserPrincipal;
import com.emotionsense.service.AuditLogService;
import com.emotionsense.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;
    private final TeamRepository teamRepository;
    private final BurnoutAssessmentRepository burnoutAssessmentRepository;
    private final WorkloadMetricRepository workloadMetricRepository;
    private final AuditLogService auditLogService;

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard(@AuthenticationPrincipal UserPrincipal principal) {
        String orgId = principal.getOrganizationId();
        Map<String, Object> data = dashboardService.getExecutiveDashboard(orgId);

        auditLogService.log(
                orgId,
                principal.getId(),
                "VIEW_EXECUTIVE_DASHBOARD",
                "ANALYTICS",
                orgId,
                "127.0.0.1",
                "Viewed organization wellness and burnout dashboard"
        );

        return ResponseEntity.ok(data);
    }

    @GetMapping("/team/{teamId}")
    public ResponseEntity<?> getTeamDetails(
            @PathVariable String teamId,
            @AuthenticationPrincipal UserPrincipal principal) {

        BurnoutAssessment assessment = burnoutAssessmentRepository
                .findFirstByTeamIdOrderByAssessmentDateDesc(teamId)
                .orElse(null);

        List<WorkloadMetric> workloadHistory = workloadMetricRepository
                .findByTeamIdOrderByWeekStartDateAsc(teamId);

        return ResponseEntity.ok(Map.of(
                "team_id", teamId,
                "latest_assessment", assessment != null ? assessment : Map.of(),
                "workload_history", workloadHistory
        ));
    }
}
