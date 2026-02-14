
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Image, 
  Wallet, 
  Users, 
  TrendingUp, 
  Sparkles, 
  User, 
  Settings, 
  LogOut,
  X,
  Scissors,
  Shirt,
  Package,
  Truck,
  Box,
  PenTool,
  Zap,
  Briefcase,
  Share2,
  Database,
  Wifi,
  WifiOff,
  Layers,
  FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { role, config, isDemoMode } = useApp();

  if (!isOpen) return null;

  const handleLogout = () => {
    navigate('/');
    onClose();
  };

  const isActive = (path: string) => location.pathname === path;

  const hasAccess = (allowedRoles: UserRole[]) => {
    if (role === UserRole.ADMIN || role === UserRole.MANAGER) return true;
    return allowedRoles.includes(role);
  };

  const MenuItem = ({ to, icon: Icon, label, isDanger = false }: any) => (
    <Link 
      to={to} 
      onClick={onClose}
      className={`flex items-center gap-4 px-4 py-3 mb-1 rounded-lg transition-colors duration-150 group ${
        isActive(to) 
          ? 'text-amber-500 bg-zinc-900' 
          : isDanger ? 'text-red-400 hover:bg-red-500/10' : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
      }`}
    >
      <Icon size={20} strokeWidth={1.5} className={isActive(to) ? 'text-amber-500' : isDanger ? 'text-red-400' : 'text-zinc-500 group-hover:text-white'} />
      <span className="font-medium tracking-wide text-sm">{label}</span>
    </Link>
  );

  const showWorkFloor = 
    hasAccess([UserRole.MEASUREMENT]) || 
    hasAccess([UserRole.CUTTING]) || 
    hasAccess([UserRole.SHIRT_MAKER, UserRole.PANT_MAKER, UserRole.COAT_MAKER]) || 
    hasAccess([UserRole.FINISHING]) || 
    hasAccess([UserRole.PRESS]) ||
    hasAccess([UserRole.DELIVERY]);

  return (
    <>
      <div className="fixed inset-0 bg-black/90 z-40 animate-in fade-in duration-200" onClick={onClose} />

      <div className="w-72 h-screen fixed left-0 top-0 bg-[#09090b] border-r border-zinc-800 flex flex-col z-50 animate-in slide-in-from-left duration-200 shadow-2xl">
        
        <div className="p-6 flex justify-between items-start border-b border-zinc-900 bg-zinc-950">
          <div>
            <h2 className="text-amber-500 font-bold tracking-widest text-sm mb-1 uppercase">Operations</h2>
            <p className="text-zinc-600 text-[10px] font-bold uppercase">{role}</p>
          </div>
          <button onClick={onClose} className="text-zinc-600 hover:text-white transition-colors">
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 scrollbar-hide">
          <MenuItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
          <MenuItem to="/business-plan" icon={FileText} label="Marketing Plan" />
          <MenuItem to="/team" icon={Users} label="My Team & Network" />
          <MenuItem to="/magic-income" icon={Sparkles} label="Magic Matrix" />
          <MenuItem to="/wallets" icon={Wallet} label="Accounting & Wallets" />
          <MenuItem to="/new-order" icon={PlusCircle} label="New Booking" />
          <MenuItem to="/gallery" icon={Image} label="Design Studio" />
          
          {config.isInvestmentEnabled && <MenuItem to="/investment" icon={TrendingUp} label="Investment Vault" />}
          
          {showWorkFloor && (
            <>
              <div className="my-6 border-t border-zinc-900 mx-2"></div>
              <p className="px-4 text-[9px] text-zinc-700 uppercase tracking-[0.2em] font-black mb-3">Live Work Floor</p>
              
              {hasAccess([UserRole.MEASUREMENT]) && <MenuItem to="/orders" icon={PenTool} label="Measurements" />}
              {hasAccess([UserRole.CUTTING]) && <MenuItem to="/orders" icon={Scissors} label="Cutting Dept" />}
              {hasAccess([UserRole.SHIRT_MAKER]) && <MenuItem to="/orders" icon={Shirt} label="Shirt Dept" />}
              {hasAccess([UserRole.PANT_MAKER]) && <MenuItem to="/orders" icon={Briefcase} label="Pant Dept" />}
              {hasAccess([UserRole.COAT_MAKER]) && <MenuItem to="/orders" icon={Layers} label="Coat/Suit Dept" />}
              {hasAccess([UserRole.FINISHING]) && <MenuItem to="/orders" icon={Package} label="Kaaj-Button Dept" />}
              {hasAccess([UserRole.PRESS]) && <MenuItem to="/orders" icon={Zap} label="Press Station" />}
              {hasAccess([UserRole.DELIVERY]) && <MenuItem to="/orders" icon={Truck} label="Delivery Logistics" />}
            </>
          )}

           {/* MANAGER PANEL - SECURELY RESTRICTED TO ADMIN/MANAGER ONLY */}
           {(role === UserRole.ADMIN || role === UserRole.MANAGER) && (
             <>
               <div className="my-6 border-t border-zinc-900 mx-2"></div>
               <MenuItem to="/materials" icon={Box} label="Inventory Manager" />
             </>
           )}
          
          <div className="my-6 border-t border-zinc-900 mx-2"></div>
          <MenuItem to="/profile" icon={User} label="Digital ID & Profile" />
          {role === UserRole.ADMIN && <MenuItem to="/config" icon={Settings} label="System Config" />}
          
          <div className="pt-4">
            <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-red-500 hover:bg-red-500/5 transition-all duration-200">
              <LogOut size={20} strokeWidth={1.5} />
              <span className="font-medium text-sm">Sign Out</span>
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-zinc-900 bg-zinc-950">
            <div className={`flex items-center gap-3 px-3 py-2 rounded-lg border ${!isDemoMode ? 'border-emerald-900/30 bg-emerald-900/10' : 'border-orange-900/30 bg-orange-900/10'}`}>
                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${!isDemoMode ? 'bg-emerald-500' : 'bg-orange-500'}`}></div>
                <div>
                    <p className={`text-[9px] font-black uppercase tracking-widest ${!isDemoMode ? 'text-emerald-500' : 'text-orange-500'}`}>
                        {!isDemoMode ? 'Live Sync Active' : 'Local Sandbox'}
                    </p>
                </div>
            </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
