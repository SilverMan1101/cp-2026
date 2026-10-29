package com.emotionsense.controller;

import com.emotionsense.model.AuditLog;
import com.emotionsense.security.UserPrincipal;
import com.emotionsense.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/audit")
@RequiredArgsConstructor
public class AuditController {

    private final AuditLogService auditLogService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'HR_ADMIN')")
    public ResponseEntity<List<AuditLog>> getAuditLogs(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(auditLogService.getLogs(principal.getOrganizationId()));
    }
}
