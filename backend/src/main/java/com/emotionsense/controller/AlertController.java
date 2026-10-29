package com.emotionsense.controller;

import com.emotionsense.model.Alert;
import com.emotionsense.security.UserPrincipal;
import com.emotionsense.service.AlertService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/alerts")
@RequiredArgsConstructor
public class AlertController {

    private final AlertService alertService;

    @GetMapping
    public ResponseEntity<List<Alert>> getAlerts(
            @RequestParam(required = false, defaultValue = "false") boolean unacknowledgedOnly,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(alertService.getAlerts(principal.getOrganizationId(), unacknowledgedOnly));
    }

    @PatchMapping("/{id}/ack")
    public ResponseEntity<?> acknowledgeAlert(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal principal) {
        return alertService.acknowledgeAlert(id, principal.getId())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
