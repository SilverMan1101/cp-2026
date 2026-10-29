package com.emotionsense.service;

import com.emotionsense.model.Alert;
import com.emotionsense.repository.AlertRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AlertService {

    private final AlertRepository alertRepository;

    public List<Alert> getAlerts(String orgId, boolean unacknowledgedOnly) {
        if (unacknowledgedOnly) {
            return alertRepository.findByOrganizationIdAndIsAcknowledgedFalseOrderByTriggeredAtDesc(orgId);
        }
        return alertRepository.findByOrganizationIdOrderByTriggeredAtDesc(orgId);
    }

    public Optional<Alert> acknowledgeAlert(String alertId, String userId) {
        return alertRepository.findById(alertId).map(alert -> {
            alert.setIsAcknowledged(true);
            alert.setAcknowledgedBy(userId);
            alert.setAcknowledgedAt(Instant.now());
            return alertRepository.save(alert);
        });
    }

    public Alert createAlert(Alert alert) {
        return alertRepository.save(alert);
    }
}
