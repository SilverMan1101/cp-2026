package com.emotionsense.repository;

import com.emotionsense.model.BurnoutAssessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BurnoutAssessmentRepository extends JpaRepository<BurnoutAssessment, String> {
    List<BurnoutAssessment> findByOrganizationIdOrderByAssessmentDateDesc(String organizationId);
    List<BurnoutAssessment> findByTeamIdOrderByAssessmentDateAsc(String teamId);
    Optional<BurnoutAssessment> findFirstByTeamIdOrderByAssessmentDateDesc(String teamId);

    @Query("SELECT AVG(b.burnoutRiskScore), AVG(b.wellnessIndex) FROM BurnoutAssessment b WHERE b.organizationId = :organizationId")
    List<Object[]> getOrgAverages(@Param("organizationId") String organizationId);
}
