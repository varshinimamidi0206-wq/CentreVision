import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './i18n/LanguageContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { DemoWalkthroughModal } from './components/DemoWalkthroughModal';
import { CentreDetailsModal } from './pages/CentreDetailsModal';
import { DashboardPage } from './pages/DashboardPage';
import { CentresPage } from './pages/CentresPage';
import { AttendancePage } from './pages/AttendancePage';
import { InfrastructurePage } from './pages/InfrastructurePage';
import { VideoAnalysisPage } from './pages/VideoAnalysisPage';
import { AlertsPage } from './pages/AlertsPage';
import { ReportsPage } from './pages/ReportsPage';
import { AccuracyPage } from './pages/AccuracyPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { LowBandwidthPage } from './pages/LowBandwidthPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';
import { api } from './services/api';
import { TrainingCentre } from './types';

const MainApp: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // Default true for instant hackathon demo
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState<boolean>(false);
  const [selectedCentre, setSelectedCentre] = useState<TrainingCentre | null>(null);
  const [isCentreModalOpen, setIsCentreModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeAlertCount, setActiveAlertCount] = useState<number>(12);

  useEffect(() => {
    // Initial fetch of active alerts count
    api.getAlerts()
      .then((alerts) => {
        const count = alerts.filter((a) => a.status !== 'Resolved').length;
        setActiveAlertCount(count);
      })
      .catch(() => {});
  }, [currentTab]);

  const handleSelectCentre = (centre: TrainingCentre) => {
    setSelectedCentre(centre);
    setIsCentreModalOpen(true);
  };

  const handleSelectCentreById = async (centreId: string) => {
    try {
      const centre = await api.getCentreDetails(centreId);
      setSelectedCentre(centre);
      setIsCentreModalOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLaunchAuditFromCentre = (centre: TrainingCentre) => {
    setIsCentreModalOpen(false);
    setCurrentTab('video_analysis');
  };

  const handleGenerateReportFromCentre = (centre: TrainingCentre) => {
    setIsCentreModalOpen(false);
    setCurrentTab('reports');
  };

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  const renderActivePage = () => {
    switch (currentTab) {
      case 'dashboard':
        return (
          <DashboardPage
            onSelectCentre={handleSelectCentre}
            onNavigateTab={setCurrentTab}
            searchFilter={searchQuery}
          />
        );
      case 'centres':
        return (
          <CentresPage
            onSelectCentre={handleSelectCentre}
            searchFilter={searchQuery}
          />
        );
      case 'attendance':
        return <AttendancePage />;
      case 'infrastructure':
        return <InfrastructurePage />;
      case 'video_analysis':
        return <VideoAnalysisPage />;
      case 'alerts':
        return <AlertsPage onSelectCentreById={handleSelectCentreById} />;
      case 'reports':
        return <ReportsPage />;
      case 'accuracy':
        return <AccuracyPage />;
      case 'privacy':
        return <PrivacyPage />;
      case 'low_bandwidth':
        return <LowBandwidthPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return (
          <DashboardPage
            onSelectCentre={handleSelectCentre}
            onNavigateTab={setCurrentTab}
            searchFilter={searchQuery}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row antialiased">
      {/* Sidebar Component */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeAlertCount={activeAlertCount}
        onStartDemo={() => setIsDemoModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Navbar */}
        <Navbar
          currentTab={currentTab}
          onMenuToggle={() => setIsSidebarOpen(true)}
          activeAlertCount={activeAlertCount}
          onAlertsClick={() => setCurrentTab('alerts')}
          onStartDemo={() => setIsDemoModalOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Dynamic Page Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActivePage()}
        </main>
      </div>

      {/* Centre Details Modal */}
      <CentreDetailsModal
        centre={selectedCentre}
        isOpen={isCentreModalOpen}
        onClose={() => setIsCentreModalOpen(false)}
        onLaunchAudit={handleLaunchAuditFromCentre}
        onGenerateReport={handleGenerateReportFromCentre}
      />

      {/* Interactive 10-Step Demo Walkthrough Modal */}
      <DemoWalkthroughModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onNavigateTab={(tab) => {
          setCurrentTab(tab);
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <MainApp />
    </LanguageProvider>
  );
}
