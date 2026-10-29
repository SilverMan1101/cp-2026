package com.emotionsense.repository;

import com.emotionsense.model.WorkloadMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface WorkloadMetricRepository extends JpaRepository<WorkloadMetric, String> {
    List<WorkloadMetric> findByOrganizationId(String organizationId);
    List<WorkloadMetric> findByTeamIdOrderByWeekStartDateAsc(String teamId);
    Optional<WorkloadMetric> findFirstByTeamIdOrderByWeekStartDateDesc(String teamId);
    Optional<WorkloadMetric> findByTeamIdAndWeekStartDate(String teamId, LocalDate weekStartDate);
}
