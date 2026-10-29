package com.emotionsense.controller;

import com.emotionsense.security.UserPrincipal;
import com.emotionsense.service.AuditLogService;
import com.emotionsense.service.ReportExportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportExportService reportExportService;
    private final AuditLogService auditLogService;

    @GetMapping("/export/pdf")
    public ResponseEntity<byte[]> exportPdfReport(@AuthenticationPrincipal UserPrincipal principal) {
        try {
            byte[] pdfBytes = reportExportService.generateExecutivePdfReport(principal.getOrganizationId());

            auditLogService.log(
                    principal.getOrganizationId(),
                    principal.getId(),
                    "EXPORT_REPORT_PDF",
                    "REPORT",
                    "org-executive-summary",
                    "127.0.0.1",
                    "Downloaded executive wellness PDF report"
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "EmotionSense-Executive-Report-" + LocalDate.now() + ".pdf");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfBytes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/export/excel")
    public ResponseEntity<byte[]> exportExcelReport(@AuthenticationPrincipal UserPrincipal principal) {
        try {
            byte[] excelBytes = reportExportService.generateExcelReport(principal.getOrganizationId());

            auditLogService.log(
                    principal.getOrganizationId(),
                    principal.getId(),
                    "EXPORT_REPORT_EXCEL",
                    "REPORT",
                    "org-team-analytics",
                    "127.0.0.1",
                    "Downloaded team analytics Excel report"
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
            headers.setContentDispositionFormData("attachment", "EmotionSense-Team-Analytics-" + LocalDate.now() + ".xlsx");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(excelBytes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
