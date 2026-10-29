import React, { useState } from 'react';
import { DashboardData } from '../types';
import { FileText, Download, FileSpreadsheet, CheckCircle2, ShieldCheck, Printer } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface ReportsViewProps {
  data: DashboardData;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ data }) => {
  const [reportType, setReportType] = useState<'weekly' | 'monthly'>('weekly');
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingExcel, setIsExportingExcel] = useState(false);

  // Client-side PDF generation using jsPDF
  const handleExportPdf = () => {
    setIsExportingPdf(true);
    try {
      const doc = new jsPDF();

      // Title
      doc.setFontSize(18);
      doc.setTextColor(30, 41, 59);
      doc.text("EmotionSense Workplace Wellness Report", 14, 20);

      // Subtitle
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text(`Organization: ${data.organization_name} | Type: ${reportType.toUpperCase()} | Date: ${new Date().toLocaleDateString()}`, 14, 28);

      // Ethical statement
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text("Ethical Notice: Identifies aggregate workload ergonomics. Does not present medical/psychological diagnoses.", 14, 34);

      // Summary KPIs table
      autoTable(doc, {
        startY: 40,
        head: [['Key Performance Indicator', 'Cohort Value', 'Status']],
        body: [
          ['Organization Wellness Index', `${data.wellness_index} / 100`, 'Healthy Operating Range'],
          ['Burnout Risk Score', `${data.burnout_risk_score} / 100`, 'Target < 35.0'],
          ['High Risk Teams Identified', `${data.risk_distribution.high.count} of ${data.risk_distribution.total_teams}`, 'Actionable Interventions Open'],
          ['K-Anonymity Aggregation Threshold', `k >= ${data.k_anonymity_threshold}`, 'Confidentiality Guaranteed']
        ],
        theme: 'striped',
        headStyles: { fillColor: [16, 185, 129] }
      });

      // Team Breakdown table
      const teamRows = data.teams.map(t => [
        t.team_name,
        `${t.wellness_index}`,
        `${t.burnout_risk_score}`,
        t.risk_category,
        t.primary_risk_driver,
        `${t.avg_overtime_hours} h/wk`
      ]);

      autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 12,
        head: [['Team Name', 'Wellness', 'Risk', 'Tier', 'Primary Driver', 'Overtime']],
        body: teamRows,
        theme: 'grid',
        headStyles: { fillColor: [51, 65, 85] }
      });

      doc.save(`EmotionSense-${reportType}-report-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Client-side Excel export using SheetJS
  const handleExportExcel = () => {
    setIsExportingExcel(true);
    try {
      const summarySheetData = [
        ["EmotionSense Workplace Wellness & Burnout Analytics"],
        ["Organization", data.organization_name],
        ["Generated", new Date().toLocaleString()],
        ["Report Type", reportType.toUpperCase()],
        [],
        ["Metric", "Value"],
        ["Wellness Index", data.wellness_index],
        ["Burnout Risk Score", data.burnout_risk_score],
        ["High Risk Teams", data.risk_distribution.high.count],
        ["Moderate Risk Teams", data.risk_distribution.moderate.count],
        ["Low Risk Teams", data.risk_distribution.low.count]
      ];

      const teamSheetData = [
        ["Team Name", "Wellness Index", "Burnout Risk Score", "Risk Tier", "Primary Driver", "Avg Overtime (hrs)", "Avg Meetings (hrs)", "Weekend Hours"],
        ...data.teams.map(t => [
          t.team_name,
          t.wellness_index,
          t.burnout_risk_score,
          t.risk_category,
          t.primary_risk_driver,
          t.avg_overtime_hours,
          t.avg_meeting_hours,
          t.weekend_hours
        ])
      ];

      const wb = XLSX.utils.book_new();
      const wsSummary = XLSX.utils.aoa_to_sheet(summarySheetData);
      const wsTeams = XLSX.utils.aoa_to_sheet(teamSheetData);

      XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");
      XLSX.utils.book_append_sheet(wb, wsTeams, "Team Breakdown");

      XLSX.writeFile(wb, `EmotionSense-${reportType}-analytics-${new Date().toISOString().slice(0, 10)}.xlsx`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExportingExcel(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Automated HR Wellness & Burnout Reports
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate executive briefings and detailed spreadsheets for leadership review
          </p>
        </div>

        {/* Action Export Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportPdf}
            disabled={isExportingPdf}
            className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-rose-700 transition disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            <span>{isExportingPdf ? 'Exporting...' : 'Download PDF Brief'}</span>
          </button>

          <button
            onClick={handleExportExcel}
            disabled={isExportingExcel}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-emerald-700 transition disabled:opacity-50"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>{isExportingExcel ? 'Exporting...' : 'Export Excel (.xlsx)'}</span>
          </button>
        </div>
      </div>

      {/* Cycle Selector */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold text-slate-500">Cadence:</span>
        <div className="flex rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
          <button
            onClick={() => setReportType('weekly')}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
              reportType === 'weekly' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Weekly Pulse Brief
          </button>
          <button
            onClick={() => setReportType('monthly')}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
              reportType === 'monthly' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Monthly Executive Review
          </button>
        </div>
      </div>

      {/* Live Document Preview Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 max-w-4xl mx-auto">
        {/* Document Header */}
        <div className="border-b border-slate-200 pb-5 dark:border-slate-800 flex justify-between items-start">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              EmotionSense Executive Briefing
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
              Workplace Wellness & Ergonomic Strain Analysis
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Reporting Entity: {data.organization_name} • Period: {reportType === 'weekly' ? 'Week 38 (Current)' : 'September 2026'}
            </p>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>k ≥ {data.k_anonymity_threshold} Anonymized</span>
            </span>
          </div>
        </div>

        {/* Executive Summary Metrics */}
        <div className="grid grid-cols-3 gap-4 my-6">
          <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50 text-center">
            <span className="text-[11px] font-semibold uppercase text-slate-500">Wellness Index</span>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">{data.wellness_index}</div>
            <span className="text-[10px] text-slate-400">Normal operating range</span>
          </div>
          <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50 text-center">
            <span className="text-[11px] font-semibold uppercase text-slate-500">Burnout Risk Score</span>
            <div className="text-2xl font-extrabold text-amber-500 mt-1">{data.burnout_risk_score}</div>
            <span className="text-[10px] text-slate-400">Target &lt; 35.0</span>
          </div>
          <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50 text-center">
            <span className="text-[11px] font-semibold uppercase text-slate-500">Attention Required</span>
            <div className="text-2xl font-extrabold text-rose-500 mt-1">{data.risk_distribution.high.count} Team</div>
            <span className="text-[10px] text-slate-400">Overtime &gt; 12h/wk</span>
          </div>
        </div>

        {/* Narrative Section */}
        <div className="space-y-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300 border-t border-slate-100 pt-5 dark:border-slate-800">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Executive Key Findings</h3>
          <p>
            Across {data.risk_distribution.total_teams} operational teams, overall company health remains robust at <strong>{data.wellness_index}/100</strong>.
            However, telemetry indicators detect targeted stress concentration in <strong>Cloud & SRE</strong> (Risk: 78.4) driven primarily by consecutive weekend alert interventions and off-hours messaging.
          </p>
          <p>
            In accordance with EmotionSense non-clinical guidelines, recommendations focus on structural ergonomics: implementing a secondary shadow on-call rotation and establishing asynchronous quiet hours between 7 PM and 8:30 AM.
          </p>
        </div>

        {/* Table snippet */}
        <div className="mt-6 border-t border-slate-100 pt-5 dark:border-slate-800">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3">Team Health Roster</h3>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 dark:border-slate-800">
                <th className="pb-2">Team</th>
                <th className="pb-2">Wellness</th>
                <th className="pb-2">Risk</th>
                <th className="pb-2">Category</th>
                <th className="pb-2">Primary Driver</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {data.teams.slice(0, 4).map(t => (
                <tr key={t.team_id} className="py-2">
                  <td className="py-2 font-medium text-slate-900 dark:text-white">{t.team_name}</td>
                  <td className="py-2 text-emerald-600 font-bold">{t.wellness_index}</td>
                  <td className="py-2 font-bold">{t.burnout_risk_score}</td>
                  <td className="py-2">{t.risk_category}</td>
                  <td className="py-2 text-slate-500">{t.primary_risk_driver}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
