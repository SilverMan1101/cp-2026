package com.emotionsense.service;

import com.emotionsense.model.WorkloadMetric;
import com.emotionsense.repository.WorkloadMetricRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WorkloadService {

    private final WorkloadMetricRepository workloadMetricRepository;

    public List<WorkloadMetric> getMetricsByTeam(String teamId) {
        return workloadMetricRepository.findByTeamIdOrderByWeekStartDateAsc(teamId);
    }

    public Optional<WorkloadMetric> getLatestMetricByTeam(String teamId) {
        return workloadMetricRepository.findFirstByTeamIdOrderByWeekStartDateDesc(teamId);
    }

    public WorkloadMetric saveOrUpdateMetric(WorkloadMetric metric) {
        if (metric.getId() == null) {
            metric.setId("wm-" + UUID.randomUUID().toString().substring(0, 8));
        }
        return workloadMetricRepository.save(metric);
    }
}
