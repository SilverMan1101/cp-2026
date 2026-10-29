package com.emotionsense.repository;

import com.emotionsense.model.Survey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SurveyRepository extends JpaRepository<Survey, String> {
    List<Survey> findByOrganizationIdOrderByCreatedAtDesc(String organizationId);
    Optional<Survey> findFirstByOrganizationIdAndIsActiveTrueOrderByCreatedAtDesc(String organizationId);
}
