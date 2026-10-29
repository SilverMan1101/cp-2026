package com.emotionsense.repository;

import com.emotionsense.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, String> {
    List<AuditLog> findByOrganizationIdOrderByCreatedAtDesc(String organizationId);
}
