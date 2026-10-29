import React from 'react';
import { DashboardData, TeamCard } from '../types';
import {
  TrendingUp,
  AlertTriangle,
  HeartHandshake,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Clock,
  Layers,
  CheckCircle2
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';

interface ExecutiveDashboardProps {
  data: DashboardData;
  onSelectTeam: (teamId: string) => void;
  onNavigateToTab: (tab: any) => void;
}

const RISK_COLORS = {
  LOW: '#10b981',      // Emerald 500
  MODERATE: '#f59e0b', // Amber 500
  HIGH: '#ef4444'      // Red 500
};

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({ data, onSelectTeam, onNavigateToTab }) => {
  const pieData = [
    { name: 'Low Risk', value: data.risk_distribution.low.count, color: RISK_COLORS.LOW },
    { name: 'Moderate Risk', value: data.risk_distribution.moderate.count, color: RISK_COLORS.MODERATE },
    { name: 'High Risk', value: data.risk_distribution.high.count, color: RISK_COLORS.HIGH },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title & Context Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Organizational Wellness & Risk Intelligence
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time aggregate ergonomic signals across {data.risk_distribution.total_teams} teams in {data.organization_name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateToTab('reports')}
            className="rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow hover:bg-emerald-700 transition"
          >
            Export Executive Brief
          </button>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Organization Wellness Index */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Wellness Index</span>
            <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
              <HeartHandshake className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{data.wellness_index}</span>
            <span className="text-xs text-slate-500">/ 100</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            <span>Optimal ergonomic range</span>
          </div>
        </div>

        {/* KPI 2: Aggregate Burnout Risk */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Burnout Risk Index</span>
            <div className="rounded-lg bg-amber-100 p-2 text-amber-700 dark:bg-amber-950 dark:text-amber-400">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{data.burnout_risk_score}</span>
            <span className="text-xs text-slate-500">/ 100</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Baseline Target: &lt; 35.0</span>
          </div>
        </div>

        {/* KPI 3: High Risk Cohort Alerts */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">High Risk Teams</span>
            <div className="rounded-lg bg-rose-100 p-2 text-rose-700 dark:bg-rose-950 dark:text-rose-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-600">{data.risk_distribution.high.count}</span>
            <span className="text-xs text-slate-500">of {data.risk_distribution.total_teams} teams</span>
          </div>
          <div className="mt-3 text-xs text-rose-600 font-medium">
            Requires active managerial intervention
          </div>
        </div>

        {/* KPI 4: Actionable Recommendations */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">AI Recommendations</span>
            <div className="rounded-lg bg-blue-100 p-2 text-blue-700 dark:bg-blue-950 dark:text-blue-400">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-blue-600">{data.open_recommendations_count}</span>
            <span className="text-xs text-slate-500">active proposals</span>
          </div>
          <button
            onClick={() => onNavigateToTab('recommendations')}
            className="mt-3 flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
          >
            <span>Review action center</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Main Charts Row: 12-Week Risk Timeline & Risk Distribution Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Line Chart (2 Cols) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Multi-Period Burnout Risk Trend vs Overtime</h2>
              <p className="text-xs text-slate-500">Historical trajectory mapped against organizational workload spikes</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 font-medium text-amber-600">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span> Risk Score
              </span>
              <span className="flex items-center gap-1 font-medium text-emerald-600">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span> Wellness Index
              </span>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.trend_timeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="period" stroke="#94a3b8" fontSize={11} />
                <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="burnout_risk" name="Burnout Risk" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="wellness_index" name="Wellness Index" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution Donut & Breakdown (1 Col) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Team Risk Distribution</h2>
          <p className="text-xs text-slate-500">Cohort categorizations based on ML model ensemble</p>

          <div className="h-44 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 mt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span> Low Risk (&lt; 40)
              </span>
              <span className="font-bold text-slate-900 dark:text-white">
                {data.risk_distribution.low.count} teams ({data.risk_distribution.low.percentage}%)
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span> Moderate (40-68)
              </span>
              <span className="font-bold text-slate-900 dark:text-white">
                {data.risk_distribution.moderate.count} teams ({data.risk_distribution.moderate.percentage}%)
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500"></span> High Risk (&ge; 68)
              </span>
              <span className="font-bold text-slate-900 dark:text-white">
                {data.risk_distribution.high.count} teams ({data.risk_distribution.high.percentage}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Department Breakdown Comparison Bar Chart */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">Department Wellness & Burnout Comparison</h2>
        <p className="text-xs text-slate-500 mb-4">Cross-department benchmarks highlighting teams requiring load balancing</p>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.departments} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="department_name" stroke="#94a3b8" fontSize={11} />
              <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '12px' }}
              />
              <Bar dataKey="wellness_index" name="Wellness Index" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="burnout_risk_score" name="Burnout Risk" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Team Ergonomics Status Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Active Team Cohort Health Breakdown</h2>
            <p className="text-xs text-slate-500">Granular view of workload drivers, overtime hours, and privacy status</p>
          </div>
          <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full dark:bg-emerald-950/40">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>K-Anonymity Verified (k ≥ {data.k_anonymity_threshold})</span>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50/50 text-[11px] uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/50">
              <tr>
                <th className="py-3 px-4">Team Name</th>
                <th className="py-3 px-4">Wellness Index</th>
                <th className="py-3 px-4">Burnout Risk</th>
                <th className="py-3 px-4">Risk Category</th>
                <th className="py-3 px-4">Primary Risk Driver</th>
                <th className="py-3 px-4">Overtime</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {data.teams.map((team) => (
                <tr key={team.team_id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">{team.team_name}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{team.wellness_index}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`font-bold ${
                      team.risk_category === 'HIGH' ? 'text-rose-600' :
                      team.risk_category === 'MODERATE' ? 'text-amber-600' : 'text-emerald-600'
                    }`}>
                      {team.burnout_risk_score}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      team.risk_category === 'HIGH' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                      team.risk_category === 'MODERATE' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                      'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}>
                      {team.risk_category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 max-w-xs truncate">{team.primary_risk_driver}</td>
                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">{team.avg_overtime_hours} hrs/wk</td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => onSelectTeam(team.team_id)}
                      className="font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 transition"
                    >
                      Deep Dive &rarr;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
