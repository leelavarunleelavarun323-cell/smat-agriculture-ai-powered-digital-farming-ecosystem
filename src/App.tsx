import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { NotificationProvider } from './context/NotificationContext.tsx';
import { Navbar } from './components/layout/Navbar.tsx';
import { Sidebar } from './components/layout/Sidebar.tsx';
import { BottomNav } from './components/layout/BottomNav.tsx';
import { LandingPage } from './components/landing/LandingPage.tsx';
import { AuthModal } from './components/auth/AuthModal.tsx';
import { ProfileModal } from './components/profile/ProfileModal.tsx';

// Feature Views
import { FarmerDashboard } from './components/farmer/FarmerDashboard.tsx';
import { CropRecommendationView } from './components/crop-recommendation/CropRecommendationView.tsx';
import { WeatherDashboard } from './components/weather/WeatherDashboard.tsx';
import { MarketIntelligenceView } from './components/market/MarketIntelligenceView.tsx';
import { SmartIrrigationView } from './components/irrigation/SmartIrrigationView.tsx';
import { LabourMarketplaceView } from './components/labour/LabourMarketplaceView.tsx';
import { MachineRentalView } from './components/machines/MachineRentalView.tsx';
import { TransportBookingView } from './components/transport/TransportBookingView.tsx';
import { StoreView } from './components/store/StoreView.tsx';
import { CropMarketplaceView } from './components/marketplace/CropMarketplaceView.tsx';
import { FinancialDashboard } from './components/finance/FinancialDashboard.tsx';
import { FarmerCommunityView } from './components/community/FarmerCommunityView.tsx';
import { AdminDashboard } from './components/admin/AdminDashboard.tsx';

function MainApp() {
  const { user, role } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [showLanding, setShowLanding] = useState(false);

  if (showLanding) {
    return (
      <>
        <LandingPage
          onEnterPlatform={() => setShowLanding(false)}
          onOpenAuth={() => setAuthModalOpen(true)}
        />
        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </>
    );
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <FarmerDashboard setActiveTab={setActiveTab} />;
      case 'crop-recommendation':
        return <CropRecommendationView setActiveTab={setActiveTab} />;
      case 'weather':
        return <WeatherDashboard setActiveTab={setActiveTab} />;
      case 'market':
        return <MarketIntelligenceView setActiveTab={setActiveTab} />;
      case 'irrigation':
        return <SmartIrrigationView />;
      case 'labour':
      case 'labour-bookings':
        return <LabourMarketplaceView />;
      case 'machines':
      case 'machines-bookings':
        return <MachineRentalView />;
      case 'transport':
      case 'transport-fleet':
      case 'transport-tracking':
        return <TransportBookingView />;
      case 'store':
      case 'store-orders':
      case 'store-inventory':
        return <StoreView />;
      case 'marketplace':
      case 'marketplace-orders':
        return <CropMarketplaceView setActiveTab={setActiveTab} />;
      case 'finance':
        return <FinancialDashboard />;
      case 'community':
        return <FarmerCommunityView />;
      case 'admin':
      case 'admin-users':
      case 'admin-analytics':
      case 'admin-audit':
        return <AdminDashboard />;
      default:
        return <FarmerDashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col text-stone-900 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenProfile={() => setProfileModalOpen(true)}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Role-Specific Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        {/* Dynamic Main Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 overflow-y-auto">
          {/* Quick back to Landing / Explore button */}
          <div className="mb-4 flex items-center justify-between text-xs text-stone-500">
            <div className="flex items-center gap-1.5 font-medium">
              <span className="text-stone-400">Ecosystem</span>
              <span>/</span>
              <span className="text-stone-800 font-bold capitalize">
                {activeTab.replace('-', ' ')}
              </span>
            </div>

            <button
              onClick={() => setShowLanding(true)}
              className="text-stone-500 hover:text-emerald-700 font-semibold transition-colors"
            >
              ← Public Landing Page
            </button>
          </div>

          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Modals */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <ProfileModal isOpen={profileModalOpen} onClose={() => setProfileModalOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <MainApp />
      </NotificationProvider>
    </AuthProvider>
  );
}
