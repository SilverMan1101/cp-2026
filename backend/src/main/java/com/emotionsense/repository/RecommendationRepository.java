package com.emotionsense.repository;

import com.emotionsense.model.Recommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecommendationRepository extends JpaRepository<Recommendation, String> {
    List<Recommendation> findByOrganizationIdOrderByCreatedAtDesc(String organizationId);
    List<Recommendation> findByOrganizationIdAndStatusOrderByCreatedAtDesc(String organizationId, String status);
    List<Recommendation> findByTeamIdOrderByCreatedAtDesc(String teamId);
}
