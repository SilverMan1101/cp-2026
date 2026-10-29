package com.emotionsense.service;

import com.emotionsense.model.PseudonymousToken;
import com.emotionsense.repository.PseudonymousTokenRepository;
import com.emotionsense.repository.SurveyResponseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PrivacyService {

    @Value("${emotionsense.privacy.k-anonymity-threshold:5}")
    private int defaultKThreshold;

    private final SurveyResponseRepository surveyResponseRepository;
    private final PseudonymousTokenRepository pseudonymousTokenRepository;

    public boolean meetsKAnonymity(String teamId, String surveyId, int threshold) {
        long responseCount = surveyResponseRepository.countByTeamIdAndSurveyId(teamId, surveyId);
        int requiredK = threshold > 0 ? threshold : defaultKThreshold;
        return responseCount >= requiredK;
    }

    public boolean isSafeToDisplayTeamCohort(long cohortSize, int orgThreshold) {
        int threshold = orgThreshold > 0 ? orgThreshold : defaultKThreshold;
        return cohortSize >= threshold;
    }

    public PseudonymousToken generatePseudonymousToken(String orgId, String teamId, String userId, String cycleIdentifier) {
        try {
            // Cryptographic one-way HMAC/SHA-256 hash using a salt so the user cannot be linked back to responses
            String raw = orgId + ":" + teamId + ":" + userId + ":" + cycleIdentifier + ":" + UUID.randomUUID();
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(raw.getBytes(StandardCharsets.UTF_8));
            String tokenHash = Base64.getUrlEncoder().withoutPadding().encodeToString(hash);

            PseudonymousToken token = PseudonymousToken.builder()
                    .id("tok-" + UUID.randomUUID().toString().substring(0, 8))
                    .organizationId(orgId)
                    .teamId(teamId)
                    .tokenHash(tokenHash)
                    .cycleIdentifier(cycleIdentifier)
                    .build();

            return pseudonymousTokenRepository.save(token);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }
}
