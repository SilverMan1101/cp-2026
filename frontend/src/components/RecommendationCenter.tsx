import React, { useState } from 'react';
import { Recommendation } from '../types';
import { apiService } from '../services/api';
import { Sparkles, CheckCircle2, Clock, PlayCircle, Filter, ArrowRight, ShieldCheck } from 'lucide-react';

interface RecommendationCenterProps {
  recommendations: Recommendation[];
  onRefresh: () => void;
}

export const RecommendationCenter: React.FC<RecommendationCenterProps> = ({ recommendations, onRefresh }) => {
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const categories = [
    { id: 'ALL', label: 'All Interventions' },
    { id: 'WORKLOAD_BALANCING', label: 'Workload Balancing' },
    { id: 'SCHEDULE_OPTIMIZATION', label: 'Schedule & Meetings' },
    { id: 'TIME_OFF_LEAVE', label: 'Time-Off & Recovery' },
    { id: 'TEAM_WELLNESS_ACTION', label: 'Organization Norms' },
  ];

  const filtered = recommendations.filter(r =>
    filterCategory === 'ALL' ? true : r.category === filterCategory
  );

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    await apiService.updateRecommendationStatus(id, newStatus);
    onRefresh();
    setUpdatingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            AI-Powered Organizational Action Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Machine learning generated operational remedies aimed at team systems, meeting hygiene, and recovery
          </p>
        </div>

        {/* Ethical Non-Clinical Guarantee Badge */}
        <div className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50/70 px-3 py-1.5 text-xs font-semibold text-blue-800 dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-300">
          <ShieldCheck className="h-4 w-4" />
          <span>Organizational Interventions Only</span>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setFilterCategory(c.id)}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
              filterCategory === c.id
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((rec) => {
          const isHighImpact = rec.estimated_impact === 'HIGH';
          const isResolved = rec.status === 'RESOLVED';
          const isInProgress = rec.status === 'IN_PROGRESS';

          return (
            <div
              key={rec.id}
              className={`rounded-2xl border p-6 shadow-sm transition flex flex-col justify-between ${
                isResolved
                  ? 'border-slate-200 bg-slate-50/60 opacity-75 dark:border-slate-800 dark:bg-slate-900/40'
                  : isInProgress
                  ? 'border-blue-200 bg-white dark:border-blue-900/60 dark:bg-slate-900'
                  : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      isHighImpact
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                    }`}>
                      {rec.estimated_impact} Impact
                    </span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                      {rec.category.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    isResolved
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : isInProgress
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {rec.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white leading-snug">
                  {rec.title}
                </h3>
                <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {rec.description}
                </p>

                {/* Rationale Box */}
                <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-800/80 dark:bg-slate-950/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Data-Backed Rationale:</span>
                  <p className="mt-0.5 text-[11px] text-slate-600 dark:text-slate-400 italic">
                    "{rec.rationale}"
                  </p>
                </div>
              </div>

              {/* Action buttons at card bottom */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">Action: {rec.action_type}</span>

                <div className="flex items-center gap-2">
                  {!isResolved && !isInProgress && (
                    <button
                      onClick={() => handleStatusChange(rec.id, 'IN_PROGRESS')}
                      disabled={updatingId === rec.id}
                      className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition"
                    >
                      <PlayCircle className="h-3.5 w-3.5" />
                      <span>Start Action</span>
                    </button>
                  )}

                  {!isResolved && isInProgress && (
                    <button
                      onClick={() => handleStatusChange(rec.id, 'RESOLVED')}
                      disabled={updatingId === rec.id}
                      className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Mark Resolved</span>
                    </button>
                  )}

                  {isResolved && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Implemented</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
