package com.emotionsense.controller;

import com.emotionsense.model.Recommendation;
import com.emotionsense.security.UserPrincipal;
import com.emotionsense.service.AuditLogService;
import com.emotionsense.service.RecommendationService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;
    private final AuditLogService auditLogService;

    @Data
    public static class StatusUpdateRequest {
        private String status; // OPEN, IN_PROGRESS, RESOLVED, DISMISSED
    }

    @GetMapping
    public ResponseEntity<List<Recommendation>> getRecommendations(
            @RequestParam(required = false) String status,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(recommendationService.getRecommendations(principal.getOrganizationId(), status));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable String id,
            @RequestBody StatusUpdateRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {

        return recommendationService.updateStatus(id, request.getStatus())
                .map(updated -> {
                    auditLogService.log(
                            principal.getOrganizationId(),
                            principal.getId(),
                            "UPDATE_RECOMMENDATION_STATUS",
                            "RECOMMENDATION",
                            id,
                            "127.0.0.1",
                            "Updated recommendation status to: " + request.getStatus()
                    );
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
