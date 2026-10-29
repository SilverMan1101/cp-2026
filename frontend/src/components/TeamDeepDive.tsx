import React, { useState } from 'react';
import { DashboardData, TeamCard } from '../types';
import {
  Clock,
  Calendar,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  BrainCircuit,
  MessageSquare,
  Sparkles,
  Users
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

interface TeamDeepDiveProps {
  data: DashboardData;
  initialTeamId?: string;
  onNavigateToRecommendations: () => void;
}

export const TeamDeepDive: React.FC<TeamDeepDiveProps> = ({ data, initialTeamId, onNavigateToRecommendations }) => {
  const [selectedTeamId, setSelectedTeamId] = useState<string>(initialTeamId || data.teams[0]?.team_id || '');

  const team = data.teams.find(t => t.team_id === selectedTeamId) || data.teams[0];
  const dept = data.departments.find(d => d.department_id === team?.department_id);

  // Radar data for multidimensional ergonomics
  const radarData = [
    { subject: 'Overtime Strain', value: Math.min(100, Math.round((team.avg_overtime_hours / 15) * 100)) },
    { subject: 'Meeting Load', value: Math.min(100, Math.round((team.avg_meeting_hours / 25) * 100)) },
    { subject: 'Weekend Fatigue', value: Math.min(100, Math.round((team.weekend_hours / 10) * 100)) },
    { subject: 'Burnout Risk', value: Math.round(team.burnout_risk_score) },
    { subject: 'Focus Deficit', value: Math.max(0, Math.round(100 - team.wellness_index)) }
  ];

  // Workload telemetry breakdown
  const workloadData = [
    { name: 'Overtime Hours', hours: team.avg_overtime_hours, benchmark: 2.0 },
    { name: 'Meeting Hours', hours: team.avg_meeting_hours, benchmark: 10.0 },
    { name: 'Weekend Hours', hours: team.weekend_hours, benchmark: 0.5 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header & Team Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Team Workload & Ergonomics Deep Dive
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Analyzing telemetry indicators, ML risk factors, and focus time health
          </p>
        </div>

        {/* Team Selector Dropdown */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Select Team:</label>
          <select
            value={selectedTeamId}
            onChange={(e) => setSelectedTeamId(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            {data.teams.map((t) => (
              <option key={t.team_id} value={t.team_id}>
                {t.team_name} ({t.risk_category} Risk)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Team Header Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{team.team_name}</h2>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
              team.risk_category === 'HIGH' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
              team.risk_category === 'MODERATE' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
              'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
            }`}>
              {team.risk_category} Risk Profile
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Department: <span className="font-semibold text-slate-700 dark:text-slate-300">{dept?.department_name}</span> • Primary Driver: <span className="font-semibold text-rose-600">{team.primary_risk_driver}</span>
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Burnout Risk</span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{team.burnout_risk_score} <span className="text-xs font-normal text-slate-400">/ 100</span></div>
          </div>
          <div className="h-10 w-px bg-slate-200 dark:bg-slate-800"></div>
          <div className="text-right">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Wellness Index</span>
            <div className="text-2xl font-extrabold text-emerald-600">{team.wellness_index} <span className="text-xs font-normal text-slate-400">/ 100</span></div>
          </div>
        </div>
      </div>

      {/* Grid: Multidimensional Radar vs Telemetry Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart: Multidimensional Strain Matrix */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Multidimensional Ergonomics Radar</h3>
              <p className="text-xs text-slate-500">Normal operating envelope vs current strain signals</p>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>k ≥ 5 Aggregated</span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={11} />
                <PolarRadiusAxis domain={[0, 100]} stroke="#cbd5e1" fontSize={10} />
                <Radar name="Team Metrics" dataKey="value" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.4} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Workload Telemetry vs Benchmark */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Workload Telemetry vs Healthy Benchmarks</h3>
              <p className="text-xs text-slate-500">Hours spent per week in non-standard or fragmented work</p>
            </div>
            <Clock className="h-4 w-4 text-slate-400" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workloadData} layout="vertical" barSize={18}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} unit="h" />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} width={100} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="hours" name="Current Team Load" fill="#ef4444" radius={[0, 4, 4, 0]} />
                <Bar dataKey="benchmark" name="Healthy Benchmark" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Actionable Prompt Box */}
      <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 shadow-sm dark:border-blue-900/50 dark:from-slate-900 dark:to-blue-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold text-sm">
            <Sparkles className="h-4 w-4" />
            <span>AI Organizational Intervention Available</span>
          </div>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
            The prediction engine generated targeted operational recommendations for <span className="font-semibold text-slate-900 dark:text-white">{team.team_name}</span> to mitigate workload saturation.
          </p>
        </div>
        <button
          onClick={onNavigateToRecommendations}
          className="whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow hover:bg-blue-700 transition"
        >
          View Recommendations &rarr;
        </button>
      </div>
    </div>
  );
};
