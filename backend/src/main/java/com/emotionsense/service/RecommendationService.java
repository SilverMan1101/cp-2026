package com.emotionsense.service;

import com.emotionsense.model.Recommendation;
import com.emotionsense.repository.RecommendationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final RecommendationRepository recommendationRepository;

    public List<Recommendation> getRecommendations(String orgId, String status) {
        if (status != null && !status.isBlank() && !"ALL".equalsIgnoreCase(status)) {
            return recommendationRepository.findByOrganizationIdAndStatusOrderByCreatedAtDesc(orgId, status.toUpperCase());
        }
        return recommendationRepository.findByOrganizationIdOrderByCreatedAtDesc(orgId);
    }

    public List<Recommendation> getTeamRecommendations(String teamId) {
        return recommendationRepository.findByTeamIdOrderByCreatedAtDesc(teamId);
    }

    public Optional<Recommendation> updateStatus(String recommendationId, String newStatus) {
        return recommendationRepository.findById(recommendationId).map(rec -> {
            rec.setStatus(newStatus.toUpperCase());
            rec.setUpdatedAt(Instant.now());
            return recommendationRepository.save(rec);
        });
    }

    public Recommendation createRecommendation(Recommendation recommendation) {
        return recommendationRepository.save(recommendation);
    }
}
