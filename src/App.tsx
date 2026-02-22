
import React, { useState, Suspense, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { UserRole } from './types';
import { Menu, Ban, AlertTriangle } from 'lucide-react';

// --- CORE COMPONENTS ---
import Sidebar from './components/Sidebar';
import DashboardStats from './components/DashboardStats';
import OrderManagement from './pages/OrderManagement';
import LoginPage from './pages/LoginPage';

// --- LAZY LOADED PAGES ---
const MyTeamPage = React.lazy(() => import('./pages/MyTeamPage'));
const WalletsPage = React.lazy(() => import('./pages/WalletsPage'));
const NewOrderPage = React.lazy(() => import('./pages/NewOrderPage'));
const ShowroomEntry = React.lazy(() => import('./pages/ShowroomEntry'));
const CustomerTrack = React.lazy(() => import('./pages/CustomerTrack'));
const Materials = React.lazy(() => import('./pages/Materials'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const InvestmentPage = React.lazy(() => import('./pages/InvestmentPage'));
const AdminConfigPage = React.lazy(() => import('./pages/AdminConfigPage'));
const GalleryPage = React.lazy(() => import('./pages/GalleryPage'));
const BusinessPlan = React.lazy(() => import('./pages/BusinessPlan'));

const PageLoader = () => (
  <div className="w-full h-screen flex flex-col items-center justify-center bg-black">
    <div className="w-8 h-8 border-2 border-zinc-800 border-t-amber-500 rounded-full animate-spin"></div>
  </div>
);

const BlockedScreen = () => (
    <div className="fixed inset-0 z-[9999] bg-zinc-950 flex flex-col items-center justify-center p-8 text-center">
       <div className="w-20 h-20 bg-red-600/10 rounded-full flex items-center justify-center mb-6 border border-red-600/30">
          <Ban size={40} className="text-red-500" />
       </div>
       <h1 className="text-2xl font-serif-display font-bold text-red-500 mb-2">ACCESS DENIED</h1>
       <p className="text-zinc-500 text-xs uppercase tracking-widest">Account Blocked by Administrator</p>
    </div>
);

const AppContent = () => {
  const { currentUser, config, role } = useApp();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Hide app shell when the main component is ready
  useEffect(() => {
    const hide = (window as any).hideAppShell;
    if (typeof hide === 'function') {
      hide();
    }
  }, []);

  const publicRoutes = ['/', '/login', '/track'];
  const isPublic = publicRoutes.includes(location.pathname);

  if (!currentUser && !isPublic) {
      return <Navigate to="/login" replace />;
  }

  if (config?.maintenance?.isActive && role !== UserRole.ADMIN) {
      return (
        <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center p-4 text-center">
            <AlertTriangle size={64} className="text-amber-500 mb-8 animate-pulse" />
            <h1 className="text-3xl font-serif-display text-gold mb-4">MAINTENANCE</h1>
            <p className="text-zinc-500 text-xs uppercase tracking-widest">System Upgrading... Back Soon</p>
        </div>
      );
  }

  if (currentUser?.status === 'Blocked') return <BlockedScreen />;

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans overflow-y-auto">
      {!isPublic && (
        <>
           <div className="fixed top-4 left-4 z-40">
              <button onClick={() => setSidebarOpen(true)} className="p-3 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-full text-zinc-400 hover:text-white shadow-lg transition-all active:scale-90">
                 <Menu size={24} />
              </button>
           </div>
           <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </>
      )}

      <div className="relative z-0">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={<DashboardStats />} />
              <Route path="/business-plan" element={<BusinessPlan />} />
              <Route path="/orders" element={<OrderManagement />} />
              <Route path="/showroom" element={<ShowroomEntry />} />
              <Route path="/new-order" element={<NewOrderPage />} />
              <Route path="/team" element={<MyTeamPage />} />
              <Route path="/magic-income" element={<MyTeamPage />} />
              <Route path="/wallets" element={<WalletsPage />} />
              <Route path="/track" element={<CustomerTrack />} />
              <Route path="/materials" element={<Materials />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/investment" element={<InvestmentPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/config" element={<AdminConfigPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
      </div>
    </div>
  );
};

const App = () => (
  <Router>
    <AppProvider>
       <AppContent />
    </AppProvider>
  </Router>
);

export default App;
