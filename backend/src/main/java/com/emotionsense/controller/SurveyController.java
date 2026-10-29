package com.emotionsense.controller;

import com.emotionsense.model.Survey;
import com.emotionsense.model.SurveyResponse;
import com.emotionsense.security.UserPrincipal;
import com.emotionsense.service.AuditLogService;
import com.emotionsense.service.SurveyService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/surveys")
@RequiredArgsConstructor
public class SurveyController {

    private final SurveyService surveyService;
    private final AuditLogService auditLogService;

    @Data
    public static class SurveySubmissionRequest {
        private String surveyId;
        private double exhaustionScore;
        private double engagementScore;
        private double workloadScore;
        private double supportScore;
        private String feedbackText;
    }

    @GetMapping("/active")
    public ResponseEntity<?> getActiveSurvey(@AuthenticationPrincipal UserPrincipal principal) {
        return surveyService.getActiveSurvey(principal.getOrganizationId())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    @GetMapping
    public ResponseEntity<List<Survey>> getAllSurveys(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(surveyService.getAllSurveys(principal.getOrganizationId()));
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitSurvey(
            @RequestBody SurveySubmissionRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {

        SurveyResponse response = surveyService.submitPseudonymousResponse(
                principal.getOrganizationId(),
                principal.getTeamId(),
                request.getSurveyId(),
                principal.getId(),
                request.getExhaustionScore(),
                request.getEngagementScore(),
                request.getWorkloadScore(),
                request.getSupportScore(),
                request.getFeedbackText()
        );

        auditLogService.log(
                principal.getOrganizationId(),
                null, // anonymized user_id in audit record
                "SUBMIT_PSEUDONYMOUS_PULSE_SURVEY",
                "SURVEY",
                request.getSurveyId(),
                "127.0.0.1",
                "Pseudonymous pulse response successfully ingested"
        );

        return ResponseEntity.ok(Map.of(
                "status", "SUCCESS",
                "message", "Thank you. Your pulse survey response was pseudonymized and safely recorded.",
                "response_id", response.getId(),
                "k_anonymity_protected", true
        ));
    }
}
