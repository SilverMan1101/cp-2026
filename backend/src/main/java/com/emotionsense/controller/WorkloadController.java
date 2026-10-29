package com.emotionsense.controller;

import com.emotionsense.model.WorkloadMetric;
import com.emotionsense.security.UserPrincipal;
import com.emotionsense.service.WorkloadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/workload")
@RequiredArgsConstructor
public class WorkloadController {

    private final WorkloadService workloadService;

    @GetMapping("/team/{teamId}")
    public ResponseEntity<List<WorkloadMetric>> getTeamWorkload(
            @PathVariable String teamId,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(workloadService.getMetricsByTeam(teamId));
    }

    @PostMapping("/ingest")
    public ResponseEntity<WorkloadMetric> ingestMetric(
            @RequestBody WorkloadMetric metric,
            @AuthenticationPrincipal UserPrincipal principal) {
        metric.setOrganizationId(principal.getOrganizationId());
        return ResponseEntity.ok(workloadService.saveOrUpdateMetric(metric));
    }
}
