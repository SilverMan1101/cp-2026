package com.emotionsense.service;

import com.emotionsense.model.*;
import com.emotionsense.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;

@Service
@RequiredArgsConstructor
public class SurveyService {

    private final SurveyRepository surveyRepository;
    private final SurveyQuestionRepository surveyQuestionRepository;
    private final SurveyResponseRepository surveyResponseRepository;
    private final PrivacyService privacyService;
    private final MlClientService mlClientService;

    public Optional<Survey> getActiveSurvey(String orgId) {
        return surveyRepository.findFirstByOrganizationIdAndIsActiveTrueOrderByCreatedAtDesc(orgId);
    }

    public List<Survey> getAllSurveys(String orgId) {
        return surveyRepository.findByOrganizationIdOrderByCreatedAtDesc(orgId);
    }

    @Transactional
    public SurveyResponse submitPseudonymousResponse(
            String orgId,
            String teamId,
            String surveyId,
            String userId,
            double exhaustion,
            double engagement,
            double workload,
            double support,
            String feedbackText) {

        // 1. Generate one-way pseudonymous token to decouple user from response
        PseudonymousToken token = privacyService.generatePseudonymousToken(
                orgId, teamId, userId, "SURVEY-" + surveyId
        );

        // 2. Perform NLP sentiment analysis on optional qualitative feedback
        Double polarity = 0.0;
        String sentimentLabel = "NEUTRAL";
        if (feedbackText != null && !feedbackText.isBlank()) {
            Map<String, Object> nlpResult = mlClientService.analyzeSentiment(feedbackText);
            polarity = ((Number) nlpResult.getOrDefault("polarity", 0.0)).doubleValue();
            sentimentLabel = (String) nlpResult.getOrDefault("label", "NEUTRAL");
        }

        // 3. Persist pseudonymous response record
        SurveyResponse response = SurveyResponse.builder()
                .id("resp-" + UUID.randomUUID().toString().substring(0, 8))
                .surveyId(surveyId)
                .organizationId(orgId)
                .teamId(teamId)
                .pseudonymousTokenId(token.getId())
                .exhaustionScore(exhaustion)
                .engagementScore(engagement)
                .workloadScore(workload)
                .supportScore(support)
                .feedbackText(feedbackText)
                .sentimentPolarity(polarity)
                .sentimentLabel(sentimentLabel)
                .submittedAt(Instant.now())
                .build();

        return surveyResponseRepository.save(response);
    }

    public List<SurveyResponse> getTeamResponsesWithPrivacyCheck(String teamId, String surveyId, int kThreshold) {
        long responseCount = surveyResponseRepository.countByTeamIdAndSurveyId(teamId, surveyId);
        if (responseCount < kThreshold) {
            // Below K-anonymity threshold: return empty list to protect individual respondent identities
            return Collections.emptyList();
        }
        return surveyResponseRepository.findByTeamId(teamId);
    }
}
