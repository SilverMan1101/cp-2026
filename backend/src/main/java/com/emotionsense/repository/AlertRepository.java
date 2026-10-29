package com.emotionsense.repository;

import com.emotionsense.model.Alert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<Alert, String> {
    List<Alert> findByOrganizationIdOrderByTriggeredAtDesc(String organizationId);
    List<Alert> findByOrganizationIdAndIsAcknowledgedFalseOrderByTriggeredAtDesc(String organizationId);
    long countByOrganizationIdAndIsAcknowledgedFalse(String organizationId);
}
