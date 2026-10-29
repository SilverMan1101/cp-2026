import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar, NavTab } from './components/Sidebar';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';
import { TeamDeepDive } from './components/TeamDeepDive';
import { SurveyPortal } from './components/SurveyPortal';
import { RecommendationCenter } from './components/RecommendationCenter';
import { ReportsView } from './components/ReportsView';
import { AuditView } from './components/AuditView';
import { apiService } from './services/api';
import { DashboardData, Recommendation, Alert } from './types';

const MainApp: React.FC = () => {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string>('team-devops-sre');

  const refreshData = async () => {
    const [dash, recs, alts] = await Promise.all([
      apiService.getDashboard(),
      apiService.getRecommendations(),
      apiService.getAlerts()
    ]);
    setDashboardData(dash);
    setRecommendations(recs);
    setAlerts(alts);
  };

  useEffect(() => {
    refreshData();
  }, []);

  // When switching to Employee role, switch directly to Survey portal
  useEffect(() => {
    if (user?.role === 'EMPLOYEE' && currentTab !== 'survey') {
      setCurrentTab('survey');
    } else if (user?.role !== 'EMPLOYEE' && currentTab === 'survey') {
      // Keep or let user browse
    }
  }, [user?.role]);

  const handleSelectTeam = (teamId: string) => {
    setSelectedTeamId(teamId);
    setCurrentTab('teams');
  };

  const handleAcknowledgeAlert = async (id: string) => {
    await apiService.acknowledgeAlert(id);
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, is_acknowledged: true } : a));
  };

  const openRecsCount = recommendations.filter(r => r.status === 'OPEN').length;

  if (!dashboardData) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-xs font-semibold text-slate-600 dark:text-slate-400">Loading EmotionSense Workplace Telemetry...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 flex flex-col">
      <Navbar alerts={alerts} onAcknowledgeAlert={handleAcknowledgeAlert} />

      <div className="flex flex-1">
        <Sidebar
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          openRecommendationsCount={openRecsCount}
        />

        <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
          {currentTab === 'dashboard' && (
            <ExecutiveDashboard
              data={dashboardData}
              onSelectTeam={handleSelectTeam}
              onNavigateToTab={setCurrentTab}
            />
          )}

          {currentTab === 'teams' && (
            <TeamDeepDive
              data={dashboardData}
              initialTeamId={selectedTeamId}
              onNavigateToRecommendations={() => setCurrentTab('recommendations')}
            />
          )}

          {currentTab === 'survey' && <SurveyPortal />}

          {currentTab === 'recommendations' && (
            <RecommendationCenter
              recommendations={recommendations}
              onRefresh={refreshData}
            />
          )}

          {currentTab === 'reports' && <ReportsView data={dashboardData} />}

          {currentTab === 'audit' && <AuditView />}
        </main>
      </div>
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
