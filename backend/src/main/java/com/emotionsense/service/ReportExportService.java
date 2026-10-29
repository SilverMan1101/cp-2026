package com.emotionsense.service;

import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReportExportService {

    private final DashboardService dashboardService;
    private final RecommendationService recommendationService;

    public byte[] generateExecutivePdfReport(String orgId) throws DocumentException {
        Map<String, Object> data = dashboardService.getExecutiveDashboard(orgId);
        List<Map<String, Object>> departments = (List<Map<String, Object>>) data.get("departments");
        List<Map<String, Object>> teams = (List<Map<String, Object>>) data.get("teams");

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4, 36, 36, 54, 36);
        PdfWriter.getInstance(document, out);
        document.open();

        // Title and Header
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20, new Color(30, 41, 59));
        Paragraph title = new Paragraph("EmotionSense™ Workplace Wellness Report", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);

        Font subFont = FontFactory.getFont(FontFactory.HELVETICA, 11, new Color(100, 116, 139));
        Paragraph subtitle = new Paragraph("Executive Risk Analysis & Organizational Recommendations | Date: " + LocalDate.now(), subFont);
        subtitle.setAlignment(Element.ALIGN_CENTER);
        subtitle.setSpacingAfter(20);
        document.add(subtitle);

        // Ethical Notice Banner
        Font bannerFont = FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 9, new Color(71, 85, 105));
        Paragraph banner = new Paragraph(
            "Note: This report identifies organizational ergonomics and workload strain indicators to guide operational adjustments. " +
            "It does not present psychological or clinical medical diagnoses.",
            bannerFont
        );
        banner.setSpacingAfter(15);
        document.add(banner);

        // KPI Summary Table
        PdfPTable kpiTable = new PdfPTable(3);
        kpiTable.setWidthPercentage(100);
        kpiTable.setSpacingAfter(20);

        addKpiCell(kpiTable, "Organization Wellness Index", String.valueOf(data.get("wellness_index")) + "/100", new Color(16, 185, 129));
        addKpiCell(kpiTable, "Aggregate Burnout Risk", String.valueOf(data.get("burnout_risk_score")) + "/100", new Color(245, 158, 11));
        addKpiCell(kpiTable, "Open AI Interventions", String.valueOf(data.get("open_recommendations_count")), new Color(59, 130, 246));
        document.add(kpiTable);

        // Department Breakdown Section
        Font sectionFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, new Color(15, 23, 42));
        Paragraph deptTitle = new Paragraph("Departmental Wellness & Workload Distribution", sectionFont);
        deptTitle.setSpacingAfter(10);
        document.add(deptTitle);

        PdfPTable deptTable = new PdfPTable(4);
        deptTable.setWidthPercentage(100);
        deptTable.setWidths(new float[]{40, 20, 20, 20});
        deptTable.setSpacingAfter(20);

        addTableHeader(deptTable, "Department");
        addTableHeader(deptTable, "Wellness Index");
        addTableHeader(deptTable, "Risk Score");
        addTableHeader(deptTable, "Risk Tier");

        for (Map<String, Object> dept : departments) {
            deptTable.addCell(createCell(String.valueOf(dept.get("department_name")), Element.ALIGN_LEFT));
            deptTable.addCell(createCell(String.valueOf(dept.get("wellness_index")), Element.ALIGN_CENTER));
            deptTable.addCell(createCell(String.valueOf(dept.get("burnout_risk_score")), Element.ALIGN_CENTER));
            deptTable.addCell(createCell(String.valueOf(dept.get("risk_category")), Element.ALIGN_CENTER));
        }
        document.add(deptTable);

        // High Priority Teams Section
        Paragraph teamTitle = new Paragraph("Team Ergonomics Breakdown", sectionFont);
        teamTitle.setSpacingAfter(10);
        document.add(teamTitle);

        PdfPTable teamTable = new PdfPTable(4);
        teamTable.setWidthPercentage(100);
        teamTable.setWidths(new float[]{35, 20, 25, 20});
        teamTable.setSpacingAfter(20);

        addTableHeader(teamTable, "Team Name");
        addTableHeader(teamTable, "Risk Tier");
        addTableHeader(teamTable, "Primary Driver");
        addTableHeader(teamTable, "Avg Overtime");

        for (Map<String, Object> t : teams) {
            teamTable.addCell(createCell(String.valueOf(t.get("team_name")), Element.ALIGN_LEFT));
            teamTable.addCell(createCell(String.valueOf(t.get("risk_category")), Element.ALIGN_CENTER));
            teamTable.addCell(createCell(String.valueOf(t.get("primary_risk_driver")), Element.ALIGN_LEFT));
            teamTable.addCell(createCell(String.valueOf(t.get("avg_overtime_hours")) + " hrs/wk", Element.ALIGN_CENTER));
        }
        document.add(teamTable);

        document.close();
        return out.toByteArray();
    }

    public byte[] generateExcelReport(String orgId) throws IOException {
        Map<String, Object> data = dashboardService.getExecutiveDashboard(orgId);
        List<Map<String, Object>> departments = (List<Map<String, Object>>) data.get("departments");
        List<Map<String, Object>> teams = (List<Map<String, Object>>) data.get("teams");

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            org.apache.poi.ss.usermodel.Sheet sheet = workbook.createSheet("Executive Overview");

            // Header Style
            org.apache.poi.ss.usermodel.Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());

            CellStyle headerCellStyle = workbook.createCellStyle();
            headerCellStyle.setFont(headerFont);
            headerCellStyle.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
            headerCellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            // Row 0: Title
            Row titleRow = sheet.createRow(0);
            titleRow.createCell(0).setCellValue("EmotionSense Workplace Wellness & Burnout Analytics Report");

            // Row 2: KPIs
            Row kpiHeader = sheet.createRow(2);
            kpiHeader.createCell(0).setCellValue("Metric");
            kpiHeader.createCell(1).setCellValue("Value");
            kpiHeader.getCell(0).setCellStyle(headerCellStyle);
            kpiHeader.getCell(1).setCellStyle(headerCellStyle);

            Row r3 = sheet.createRow(3);
            r3.createCell(0).setCellValue("Organization Wellness Index");
            r3.createCell(1).setCellValue(Double.parseDouble(String.valueOf(data.get("wellness_index"))));

            Row r4 = sheet.createRow(4);
            r4.createCell(0).setCellValue("Aggregate Burnout Risk Score");
            r4.createCell(1).setCellValue(Double.parseDouble(String.valueOf(data.get("burnout_risk_score"))));

            // Row 6: Teams Table
            Row teamHeader = sheet.createRow(6);
            String[] cols = {"Team Name", "Wellness Index", "Burnout Risk Score", "Risk Tier", "Primary Risk Driver", "Avg Overtime (h)", "Avg Meetings (h)"};
            for (int i = 0; i < cols.length; i++) {
                Cell cell = teamHeader.createCell(i);
                cell.setCellValue(cols[i]);
                cell.setCellStyle(headerCellStyle);
            }

            int rowIdx = 7;
            for (Map<String, Object> t : teams) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(String.valueOf(t.get("team_name")));
                row.createCell(1).setCellValue(Double.parseDouble(String.valueOf(t.get("wellness_index"))));
                row.createCell(2).setCellValue(Double.parseDouble(String.valueOf(t.get("burnout_risk_score"))));
                row.createCell(3).setCellValue(String.valueOf(t.get("risk_category")));
                row.createCell(4).setCellValue(String.valueOf(t.get("primary_risk_driver")));
                row.createCell(5).setCellValue(Double.parseDouble(String.valueOf(t.get("avg_overtime_hours"))));
                row.createCell(6).setCellValue(Double.parseDouble(String.valueOf(t.get("avg_meeting_hours"))));
            }

            for (int i = 0; i < cols.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();
        }
    }

    private void addKpiCell(PdfPTable table, String label, String value, Color color) {
        PdfPCell cell = new PdfPCell();
        cell.setPadding(10);
        cell.setBackgroundColor(new Color(248, 250, 252));
        cell.setBorderColor(new Color(226, 232, 240));

        Font valFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, color);
        Paragraph valP = new Paragraph(value, valFont);
        valP.setAlignment(Element.ALIGN_CENTER);
        cell.addElement(valP);

        Font lblFont = FontFactory.getFont(FontFactory.HELVETICA, 10, new Color(100, 116, 139));
        Paragraph lblP = new Paragraph(label, lblFont);
        lblP.setAlignment(Element.ALIGN_CENTER);
        cell.addElement(lblP);

        table.addCell(cell);
    }

    private void addTableHeader(PdfPTable table, String headerTitle) {
        PdfPCell header = new PdfPCell();
        header.setBackgroundColor(new Color(241, 245, 249));
        header.setBorderColor(new Color(203, 213, 225));
        header.setPadding(6);
        Font font = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, new Color(51, 65, 85));
        Paragraph p = new Paragraph(headerTitle, font);
        p.setAlignment(Element.ALIGN_CENTER);
        header.addElement(p);
        table.addCell(header);
    }

    private PdfPCell createCell(String text, int align) {
        PdfPCell cell = new PdfPCell();
        cell.setPadding(6);
        cell.setBorderColor(new Color(226, 232, 240));
        Font font = FontFactory.getFont(FontFactory.HELVETICA, 9, new Color(51, 65, 85));
        Paragraph p = new Paragraph(text, font);
        p.setAlignment(align);
        cell.addElement(p);
        return cell;
    }
}
