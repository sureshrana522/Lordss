
import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, FileText, Plus, ArrowUpRight, ArrowDownRight, Calendar, Trophy, Scissors, Sparkles, Wallet, ArrowRight, X, History, User, Hash, Layers, Clock, ShieldCheck, Map, ArrowRightCircle, CheckCircle2, Download, Smartphone
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

const HistoryModal = ({ title, isOpen, onClose, data }: any) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200">
                <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950">
                    <div className="flex items-center gap-2">
                        <History size={20} className="text-amber-500" />
                        <h3 className="font-bold text-white text-lg">{title} History</h3>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full text-zinc-500 hover:text-white">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="p-4 overflow-y-auto flex-1 space-y-3">
                    <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest mb-2">Detailed Statement</p>
                    {data.length > 0 ? (
                        data.map((tx: any) => (
                            <div key={tx.id} className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 relative group hover:border-zinc-700 transition-all">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex-1">
                                        <p className="text-white font-bold text-sm leading-tight">{tx.description}</p>
                                        <p className="text-[10px] text-zinc-500 mt-1">{tx.date}</p>
                                    </div>
                                    <div className={`font-mono font-bold text-sm ${tx.type === 'Credit' ? 'text-emerald-500' : 'text-red-500'}`}>
                                        {tx.type === 'Credit' ? '+' : '-'}
                                        {typeof tx.amount === 'number' ? `₹${tx.amount.toFixed(5)}` : tx.amount}
                                    </div>
                                </div>
                                
                                <div className="flex gap-2 border-t border-zinc-900 pt-2 mt-2">
                                    {tx.relatedOrderId && (
                                        <span className="text-[9px] bg-zinc-900 text-zinc-400 px-2 py-1 rounded flex items-center gap-1 border border-zinc-800">
                                            <Hash size={10} /> Bill: {tx.relatedOrderId}
                                        </span>
                                    )}
                                    {tx.relatedUser && (
                                        <span className="text-[9px] bg-zinc-900 text-zinc-400 px-2 py-1 rounded flex items-center gap-1 border border-zinc-800">
                                            <User size={10} /> {tx.relatedUser}
                                        </span>
                                    )}
                                    {tx.level && (
                                        <span className="text-[9px] bg-zinc-900 text-amber-500 px-2 py-1 rounded flex items-center gap-1 border border-zinc-800 font-bold">
                                            <Layers size={10} /> {tx.level}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 border border-dashed border-zinc-800 rounded-xl">
                            <History size={32} className="mx-auto text-zinc-700 mb-2" />
                            <p className="text-zinc-500 text-sm">No records found.</p>
                        </div>
                    )}
                </div>
                
                <div className="p-4 bg-zinc-950 border-t border-zinc-800 text-center">
                    <button onClick={onClose} className="text-xs font-bold text-zinc-400 hover:text-white uppercase tracking-widest">Close Panel</button>
                </div>
            </div>
        </div>
    );
};

const WalletCard = ({ title, amount, icon: Icon, bonusLabel, colorClass, bgClass, borderColor, arrowType, onViewHistory }: any) => {
  return (
    <div className={`relative bg-zinc-900 border ${borderColor} rounded-xl p-3 overflow-hidden group hover:border-opacity-50 transition-colors`}>
      <div className={`absolute top-0 right-0 w-20 h-20 ${bgClass} rounded-full -mr-10 -mt-10 opacity-10`}></div>
      <div className="flex justify-between items-start mb-2">
        <div className={`p-2 rounded-lg ${bgClass} bg-opacity-10 border border-white/5`}>
          <Icon className={`${colorClass}`} size={18} />
        </div>
        {bonusLabel && (
          <div className={`flex items-center gap-1 text-[10px] font-medium ${colorClass}`}>
             {arrowType === 'up' && <ArrowUpRight size={12} />}
             {arrowType === 'down' && <ArrowDownRight size={12} />}
             <span>{bonusLabel}</span>
          </div>
        )}
      </div>
      <div className="relative z-10">
        <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-semibold mb-1">{title}</p>
        <h3 className="text-xl font-bold text-white font-serif-display">
            {typeof amount === 'number' ? `₹${amount.toFixed(5)}` : amount}
        </h3>
      </div>
      <div className="mt-3 pt-3 border-t border-zinc-800 flex items-center justify-between group-hover:px-1 transition-all cursor-pointer" onClick={onViewHistory}>
        <span className={`text-[10px] ${colorClass} font-medium hover:underline`}>View History</span>
        <ArrowRight size={12} className={`text-zinc-600 group-hover:${colorClass} transition-colors`} />
      </div>
    </div>
  );
};

const DashboardStats = () => {
  const { getDashboardStats, role, currentUser, getWalletHistory } = useApp();
  const stats = getDashboardStats();
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [historyTitle, setHistoryTitle] = useState('');
  const [historyData, setHistoryData] = useState<any[]>([]);
  
  // PWA Install Logic
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    });

    window.addEventListener('appinstalled', () => {
      setDeferredPrompt(null);
      setShowInstallBanner(false);
    });
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowInstallBanner(false);
      }
    }
  };

  const handleOpenHistory = (walletName: string) => {
      const data = getWalletHistory(walletName);
      setHistoryTitle(walletName);
      setHistoryData(data);
      setHistoryModalOpen(true);
  };

  const currentRoleName = currentUser?.role || role || 'Guest';

  // Workflow Map Data
  const workflowSteps = [
    { label: 'Booking', role: 'Showroom', icon: CheckCircle2, color: 'text-blue-500' },
    { label: 'Measure', role: 'Master', icon: ArrowRightCircle, color: 'text-cyan-500' },
    { label: 'Cutting', role: 'Master', icon: ArrowRightCircle, color: 'text-orange-500' },
    { label: 'Sewing', role: 'Maker', icon: ArrowRightCircle, color: 'text-purple-500' },
    { label: 'Ready', role: 'Delivery', icon: ArrowRightCircle, color: 'text-emerald-500' },
    { label: 'Final', role: 'Admin', icon: Trophy, color: 'text-amber-500' }
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      
      {/* PWA INSTALL BANNER */}
      {showInstallBanner && (
        <div className="mb-6 bg-gradient-to-r from-amber-600 to-amber-500 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 animate-in slide-in-from-top duration-500 shadow-lg shadow-amber-900/20">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-black/20 rounded-xl text-black">
                 <Smartphone size={24} />
              </div>
              <div>
                 <h3 className="text-black font-black uppercase text-sm leading-tight">Install Lord's Bespoke App</h3>
                 <p className="text-black/70 text-[10px] font-bold uppercase tracking-wider">Fast access to your system from Home Screen</p>
              </div>
           </div>
           <div className="flex gap-2 w-full md:w-auto">
              <button onClick={() => setShowInstallBanner(false)} className="flex-1 md:flex-none px-4 py-2 bg-black/10 hover:bg-black/20 text-black text-xs font-bold rounded-lg uppercase tracking-widest transition-colors">Later</button>
              <button onClick={handleInstall} className="flex-1 md:flex-none px-6 py-2 bg-black text-white text-xs font-bold rounded-lg uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 transition-transform active:scale-95"><Download size={14} /> Install Now</button>
           </div>
        </div>
      )}

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-4xl font-serif-display text-white">Dashboard</h1>
          <span className={`px-3 py-1 ${role === UserRole.ADMIN ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-zinc-800 text-zinc-400 border-zinc-700'} border rounded text-xs uppercase tracking-wider font-bold`}>
             {role === UserRole.ADMIN ? 'Admin Panel' : `${currentRoleName} Panel`}
          </span>
        </div>
        <p className="text-zinc-400">Welcome {currentUser?.name || 'User'}, track your earnings and system workflow.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Link to="/orders" className="flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-200 py-4 px-6 rounded-lg transition-all font-medium"><FileText size={20} className="text-blue-400" /><span>Orders</span></Link>
        <Link to="/wallets" className="flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 text-black py-4 px-6 rounded-lg transition-all font-bold shadow-lg shadow-amber-900/20"><Plus size={20} /><span>Add Funds</span></Link>
        <Link to="/new-order" className="col-span-2 md:col-span-2 flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-200 py-4 px-6 rounded-lg transition-all font-medium"><FileText size={20} className="text-green-400" /><span>New Bill</span></Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-10">
        <WalletCard title="Upline Wallet" amount={stats.uplineWallet} icon={ArrowUpRight} bonusLabel="Direct" arrowType="up" colorClass="text-blue-400" bgClass="bg-blue-500" borderColor="border-blue-900/30" onViewHistory={() => handleOpenHistory('Upline')} />
        <WalletCard title="Downline Wallet" amount={stats.downlineWallet} icon={ArrowDownRight} bonusLabel="Team" arrowType="down" colorClass="text-purple-400" bgClass="bg-purple-500" borderColor="border-purple-900/30" onViewHistory={() => handleOpenHistory('Downline')} />
        <WalletCard title="Today's Wallet" amount={stats.todaysWallet} icon={Calendar} bonusLabel="Daily" arrowType="down" colorClass="text-amber-400" bgClass="bg-amber-500" borderColor="border-amber-900/30" onViewHistory={() => handleOpenHistory('Daily')} />
        <WalletCard title="Performance Wallet" amount={stats.performanceWallet} icon={Trophy} bonusLabel="Grade A" arrowType="up" colorClass="text-cyan-400" bgClass="bg-cyan-500" borderColor="border-cyan-900/30" onViewHistory={() => handleOpenHistory('Performance')} />
        <WalletCard title="Booking Wallet" amount={stats.bookingWallet} icon={Scissors} bonusLabel="Work" arrowType="up" colorClass="text-emerald-400" bgClass="bg-emerald-500" borderColor="border-emerald-900/30" onViewHistory={() => handleOpenHistory('Booking')} />
        <WalletCard title="Magic Income" amount={stats.magicIncome} icon={Sparkles} bonusLabel="Auto Pool" arrowType="up" colorClass="text-pink-400" bgClass="bg-pink-500" borderColor="border-pink-900/30" onViewHistory={() => handleOpenHistory('Magic')} />
        <div className="col-span-2 md:col-span-1">
           <WalletCard title="Total Income" amount={stats.totalIncome} icon={Wallet} bonusLabel="Lifetime" arrowType="up" colorClass="text-yellow-400" bgClass="bg-yellow-600" borderColor="border-yellow-900/30" onViewHistory={() => handleOpenHistory('Total')} />
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl"></div>
          <div className="flex items-center gap-2 mb-6">
              <Map size={20} className="text-amber-500" />
              <h2 className="text-lg font-bold text-white uppercase tracking-widest">System Workflow Path</h2>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative">
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-zinc-800 hidden md:block -z-0"></div>
              
              {workflowSteps.map((step, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2 z-10 bg-zinc-900 px-4 group">
                      <div className={`p-3 rounded-full bg-black border border-zinc-800 ${step.color} group-hover:scale-110 transition-transform shadow-lg`}>
                          <step.icon size={24} />
                      </div>
                      <div className="text-center">
                          <p className="text-[10px] font-bold text-white uppercase tracking-wider">{step.label}</p>
                          <p className="text-[8px] text-zinc-500 uppercase">{step.role}</p>
                      </div>
                  </div>
              ))}
          </div>
          
          <div className="mt-8 p-4 bg-black/40 rounded-xl border border-zinc-800/50 flex items-start gap-3">
              <ShieldCheck className="text-emerald-500 shrink-0 mt-0.5" size={16} />
              <p className="text-[10px] text-zinc-500 leading-relaxed uppercase tracking-wide">
                  <span className="text-amber-500 font-bold">Secure Protocol:</span> Handover verifies worker IDs. 
                  <span className="text-emerald-500 font-bold ml-1">Payment:</span> Auto-released to workers after 
                  <span className="text-white font-bold ml-1">Delivery OTP Verification</span> by Bill Creator.
              </p>
          </div>
      </div>

      <HistoryModal title={historyTitle} isOpen={historyModalOpen} onClose={() => setHistoryModalOpen(false)} data={historyData} />
    </div>
  );
};

export default DashboardStats;
