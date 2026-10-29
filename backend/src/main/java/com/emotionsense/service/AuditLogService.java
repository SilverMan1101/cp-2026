package com.emotionsense.service;

import com.emotionsense.model.AuditLog;
import com.emotionsense.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public void log(String orgId, String userId, String action, String resourceType, String resourceId, String ipAddress, String details) {
        AuditLog log = AuditLog.builder()
                .id("aud-" + UUID.randomUUID().toString().substring(0, 8))
                .organizationId(orgId)
                .userId(userId)
                .action(action)
                .resourceType(resourceType)
                .resourceId(resourceId)
                .ipAddress(ipAddress)
                .details(details)
                .createdAt(Instant.now())
                .build();
        auditLogRepository.save(log);
    }

    public List<AuditLog> getLogs(String orgId) {
        return auditLogRepository.findByOrganizationIdOrderByCreatedAtDesc(orgId);
    }
}
