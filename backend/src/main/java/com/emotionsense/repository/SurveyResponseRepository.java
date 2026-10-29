package com.emotionsense.repository;

import com.emotionsense.model.SurveyResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SurveyResponseRepository extends JpaRepository<SurveyResponse, String> {
    List<SurveyResponse> findByOrganizationId(String organizationId);
    List<SurveyResponse> findBySurveyId(String surveyId);
    List<SurveyResponse> findByTeamId(String teamId);
    long countByTeamIdAndSurveyId(String teamId, String surveyId);
    long countByOrganizationIdAndSurveyId(String organizationId, String surveyId);

    @Query("SELECT AVG(r.exhaustionScore), AVG(r.engagementScore), AVG(r.workloadScore), AVG(r.supportScore), AVG(r.sentimentPolarity) " +
           "FROM SurveyResponse r WHERE r.teamId = :teamId")
    List<Object[]> getAveragesByTeamId(@Param("teamId") String teamId);

    @Query("SELECT AVG(r.exhaustionScore), AVG(r.engagementScore), AVG(r.workloadScore), AVG(r.supportScore), AVG(r.sentimentPolarity) " +
           "FROM SurveyResponse r WHERE r.organizationId = :organizationId")
    List<Object[]> getAveragesByOrganizationId(@Param("organizationId") String organizationId);
}
