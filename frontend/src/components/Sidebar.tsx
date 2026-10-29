import React from 'react';
import { LayoutDashboard, Users, MessageSquareHeart, Sparkles, FileSpreadsheet, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export type NavTab = 'dashboard' | 'teams' | 'survey' | 'recommendations' | 'reports' | 'audit';

interface SidebarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  openRecommendationsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onTabChange, openRecommendationsCount }) => {
  const { user } = useAuth();
  const isEmployee = user?.role === 'EMPLOYEE';

  const navItems = [
    { id: 'dashboard' as NavTab, label: 'Executive Overview', icon: LayoutDashboard, hidden: isEmployee },
    { id: 'teams' as NavTab, label: 'Team Analytics & Trends', icon: Users, hidden: isEmployee },
    { id: 'survey' as NavTab, label: 'Pseudonymous Pulse', icon: MessageSquareHeart },
    { id: 'recommendations' as NavTab, label: 'AI Action Center', icon: Sparkles, badge: openRecommendationsCount, hidden: isEmployee },
    { id: 'reports' as NavTab, label: 'Automated Reports', icon: FileSpreadsheet, hidden: isEmployee },
    { id: 'audit' as NavTab, label: 'Privacy & Audit Log', icon: ShieldAlert, hidden: user?.role !== 'HR_ADMIN' && user?.role !== 'ADMIN' },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between py-5 px-3 min-h-[calc(100vh-4rem)]">
      <div className="space-y-1">
        <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Analytics & Insights
        </p>

        {navItems.filter(item => !item.hidden).map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  isActive ? 'bg-emerald-800 text-white' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Privacy Notice Box at Bottom of Sidebar */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
          <ShieldAlert className="h-4 w-4" />
          <span className="text-xs font-bold">Privacy-By-Design</span>
        </div>
        <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
          All burnout predictions reflect aggregated team workload ergonomics. Individual diagnosis is prohibited by design.
        </p>
      </div>
    </aside>
  );
};
