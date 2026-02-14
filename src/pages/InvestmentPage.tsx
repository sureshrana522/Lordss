
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Crown, 
  ShieldCheck, 
  Target, 
  Wallet,
  PieChart,
  Gem,
  CheckCircle2,
  Globe,
  X,
  Briefcase,
  Download,
  ArrowLeft,
  Calendar,
  Layers,
  Banknote
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const InvestmentPage = () => {
  const navigate = useNavigate();
  const { stats, investment, investFunds, withdrawReturns, config } = useApp();
  
  // Modals State
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  
  // Banner State
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState('');

  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  // Calculations
  const availableBalance = investment.totalEarnings - investment.totalWithdrawn;
  const todaysRoi = Math.floor(investment.invested * 0.012); // Simulated 1.2% Daily ROI

  // Royalty Pools (Dynamic Calculation based on config.investmentOrderPercent)
  // Base logic assumes 5% total distribution. If user changes %, we scale the pool shares.
  const basePercent = 5;
  const scale = config.investmentOrderPercent / basePercent;

  const royaltyPools = [
    { id: 1, name: 'Tier 1 Pool', label: 'Silver', percent: (1.75 * scale).toFixed(2), color: 'text-zinc-400', bg: 'bg-zinc-500', min: '10k' },
    { id: 2, name: 'Tier 2 Pool', label: 'Gold', percent: (1.25 * scale).toFixed(2), color: 'text-yellow-400', bg: 'bg-yellow-500', min: '30k' },
    { id: 3, name: 'Tier 3 Pool', label: 'Platinum', percent: (0.90 * scale).toFixed(2), color: 'text-cyan-400', bg: 'bg-cyan-500', min: '80k' },
    { id: 4, name: 'Tier 4 Pool', label: 'Diamond', percent: (0.60 * scale).toFixed(2), color: 'text-blue-400', bg: 'bg-blue-500', min: '1.5L' },
    { id: 5, name: 'Tier 5 Pool', label: 'Crown', percent: (0.50 * scale).toFixed(2), color: 'text-amber-500', bg: 'bg-amber-500', min: '2.5L' },
  ];

  const plans = [
    {
      id: 1,
      name: 'Silver Starter',
      minAmount: 10000,
      icon: ShieldCheck,
      color: 'text-zinc-400',
      bg: 'bg-zinc-500',
      desc: 'Entry level compounding.'
    },
    {
      id: 2,
      name: 'Gold Growth',
      minAmount: 30000,
      icon: TrendingUp,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500',
      desc: 'Standard portfolio builder.'
    },
    {
      id: 3,
      name: 'Platinum Premium',
      minAmount: 80000,
      icon: Gem,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500',
      desc: 'High priority returns.'
    },
    {
      id: 4,
      name: 'Diamond Elite',
      minAmount: 150000,
      icon: Target,
      color: 'text-blue-400',
      bg: 'bg-blue-500',
      desc: 'Exclusive club access.'
    },
    {
      id: 5,
      name: 'Royal Crown',
      minAmount: 250000,
      icon: Crown,
      color: 'text-amber-500',
      bg: 'bg-amber-500',
      desc: 'Maximum leverage 2.5x.'
    }
  ];

  const globalBusiness = stats.revenue * 10; 

  const handleInvestClick = (plan: any) => {
    setSelectedPlan(plan);
    setInvestmentAmount(plan.minAmount.toString());
    setShowInvestModal(true);
  };

  const confirmInvestment = () => {
     const amt = parseInt(investmentAmount);
     if (isNaN(amt) || amt < (selectedPlan?.minAmount || 0)) {
         alert("Invalid Amount");
         return;
     }
     const success = investFunds(amt, selectedPlan.name);
     if (success) {
         setShowInvestModal(false);
         triggerBanner("INVESTMENT SUCCESSFUL! PLAN ACTIVATED.");
     } else {
         alert("Insufficient Funds in Booking Wallet!");
     }
  };

  const openWithdrawModal = () => {
    if (!withdrawAmount || parseInt(withdrawAmount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    if (parseInt(withdrawAmount) > availableBalance) {
      alert("Insufficient ROI Balance");
      return;
    }
    setShowWithdrawModal(true);
  }

  const confirmWithdraw = () => {
      const amt = parseInt(withdrawAmount);
      const success = withdrawReturns(amt);
      
      if(success) {
         setWithdrawAmount('');
         setShowWithdrawModal(false);
         triggerBanner(`WITHDRAWAL OF ₹${amt} SUCCESSFUL!`);
      }
  };

  const triggerBanner = (msg: string) => {
    setBannerMessage(msg);
    setShowSuccessBanner(true);
    setTimeout(() => setShowSuccessBanner(false), 3000);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen pb-32 relative">
      
      {/* Green Success Line Banner */}
      <div className={`fixed top-0 left-0 w-full bg-emerald-500 text-black font-bold text-center py-3 z-[100] transition-transform duration-500 shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 ${showSuccessBanner ? 'translate-y-0' : '-translate-y-full'}`}>
          <CheckCircle2 size={20} />
          {bannerMessage}
       </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
            <button 
                onClick={() => navigate(-1)} 
                className="p-2 bg-zinc-800 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
            >
                <ArrowLeft size={24} />
            </button>
            <h1 className="text-3xl md:text-4xl font-serif-display text-white">Investment Portfolio</h1>
        </div>
        <p className="text-zinc-400 ml-14">Secure your future with Lord's Bespoke compounding plans. <span className="text-amber-500 font-bold">Guaranteed 2.5x Returns.</span></p>
      </div>

      {/* ROYALTY DISTRIBUTION SECTION */}
      <div className="mb-12 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
         <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
               <Globe className="text-amber-500" size={24} />
            </div>
            <div>
               <h2 className="text-xl font-bold text-white font-serif-display">{config.investmentOrderPercent}% Global Order Distribution</h2>
               <p className="text-xs text-zinc-500">Every order contributes {config.investmentOrderPercent}% value to these 5 Royalty Pools.</p>
            </div>
         </div>

         <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {royaltyPools.map((pool) => {
               // Calculate based on dynamic percent
               const poolValue = globalBusiness * (Number(pool.percent) / 100);
               return (
                  <div key={pool.id} className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl flex flex-col items-center text-center group hover:border-zinc-700 transition-colors">
                     <div className={`text-[10px] uppercase font-bold tracking-widest mb-2 ${pool.color}`}>{pool.name}</div>
                     <div className="w-12 h-12 rounded-full border-4 border-zinc-900 flex items-center justify-center text-sm font-bold bg-zinc-900 mb-2 relative">
                        <span className={pool.color}>{pool.percent}%</span>
                     </div>
                     <div className={`font-mono font-bold text-lg ${pool.color}`}>₹{Math.floor(poolValue).toLocaleString()}</div>
                     <div className="text-[9px] text-zinc-600 mt-2 bg-zinc-900 px-2 py-1 rounded">Min: ₹{pool.min}</div>
                  </div>
               );
            })}
         </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-12">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 relative overflow-hidden group hover:border-amber-500/50 transition-all hover:-translate-y-1">
             <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${plan.bg} bg-opacity-10`}>
                   <plan.icon size={24} className={plan.color} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-zinc-950 px-2 py-1 rounded text-zinc-500">2.5x ROI</span>
             </div>

             <h3 className="text-lg font-bold text-white mb-1 font-serif-display">{plan.name}</h3>
             <p className="text-xs text-zinc-500 mb-4 h-8">{plan.desc}</p>
             <p className={`text-xl font-mono font-bold ${plan.color} mb-4`}>₹{plan.minAmount.toLocaleString()}+</p>

             <button 
                onClick={() => handleInvestClick(plan)}
                className={`w-full py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${plan.id === 5 ? 'bg-gradient-to-r from-amber-600 to-amber-400 text-black' : 'bg-zinc-800 hover:bg-zinc-700 text-white'}`}
             >
                Invest Now
             </button>
          </div>
        ))}
      </div>

      {/* Floating Portfolio Button */}
      <button 
        onClick={() => setShowPortfolio(true)}
        className="fixed bottom-6 right-6 z-40 bg-amber-500 text-black px-6 py-4 rounded-full font-bold shadow-2xl shadow-amber-500/30 flex items-center gap-2 hover:scale-105 transition-transform animate-in slide-in-from-bottom"
      >
         <PieChart size={24} />
         My Portfolio
      </button>

      {/* PORTFOLIO POPUP MODAL */}
      {showPortfolio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
           <div className="bg-zinc-900 border border-zinc-800 w-full max-w-4xl rounded-3xl shadow-2xl relative flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
              
              {/* FIXED HEADER */}
              <div className="flex justify-between items-center p-6 border-b border-zinc-800 shrink-0">
                  <div className="flex items-center gap-3">
                     <button 
                        onClick={() => setShowPortfolio(false)} 
                        className="p-2 bg-zinc-800 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                     >
                        <ArrowLeft size={24} />
                     </button>
                     <div className="flex items-center gap-2">
                         <Briefcase size={24} className="text-amber-500 hidden md:block" />
                         <h2 className="text-xl md:text-2xl font-bold text-white font-serif-display">My Portfolio</h2>
                     </div>
                  </div>
                  <button onClick={() => setShowPortfolio(false)} className="text-zinc-500 hover:text-white">
                     <X size={24} />
                  </button>
              </div>

              {/* SCROLLABLE CONTENT */}
              <div className="p-6 md:p-8 overflow-y-auto">
                
                {/* 4 WALLET CARDS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                   {/* 1. Total Invested */}
                   <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                         <Wallet size={48} className="text-zinc-400"/>
                      </div>
                      <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest mb-2">Total Invested</p>
                      <p className="text-2xl font-bold text-white font-mono">₹{investment.invested.toLocaleString()}</p>
                      <div className="h-1 w-full bg-zinc-900 mt-4 rounded-full overflow-hidden">
                         <div className="h-full bg-zinc-500 w-3/4"></div>
                      </div>
                   </div>

                   {/* 2. Total Withdrawn */}
                   <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                         <Download size={48} className="text-red-500"/>
                      </div>
                      <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest mb-2">Total Withdrawn</p>
                      <p className="text-2xl font-bold text-red-400 font-mono">₹{investment.totalWithdrawn.toLocaleString()}</p>
                      <div className="h-1 w-full bg-zinc-900 mt-4 rounded-full overflow-hidden">
                         <div className="h-full bg-red-500 w-1/2"></div>
                      </div>
                   </div>

                   {/* 3. Total ROI Received */}
                   <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                         <TrendingUp size={48} className="text-emerald-500"/>
                      </div>
                      <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest mb-2">Total ROI Generated</p>
                      <p className="text-2xl font-bold text-emerald-400 font-mono">₹{investment.totalEarnings.toLocaleString()}</p>
                      <div className="h-1 w-full bg-zinc-900 mt-4 rounded-full overflow-hidden">
                         <div className="h-full bg-emerald-500 w-full"></div>
                      </div>
                   </div>

                   {/* 4. Today's ROI */}
                   <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                         <Calendar size={48} className="text-amber-500"/>
                      </div>
                      <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest mb-2">Today's ROI</p>
                      <p className="text-2xl font-bold text-amber-500 font-mono">+₹{todaysRoi.toLocaleString()}</p>
                      <div className="h-1 w-full bg-zinc-900 mt-4 rounded-full overflow-hidden">
                         <div className="h-full bg-amber-500 w-1/4 animate-pulse"></div>
                      </div>
                   </div>
                </div>

                {/* ACTIVE PLANS LIST */}
                <div className="mb-8">
                   <div className="flex items-center gap-2 mb-4">
                      <Layers className="text-amber-500" size={20} />
                      <h3 className="text-white font-bold">Active Plans</h3>
                   </div>
                   <div className="space-y-3">
                      {investment.activePlans.length > 0 ? (
                        investment.activePlans.map((plan, idx) => (
                           <div key={idx} className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-amber-500 border border-zinc-800">
                                    <Crown size={18} />
                                 </div>
                                 <div>
                                    <p className="text-white font-bold text-sm">{plan.name}</p>
                                    <p className="text-xs text-zinc-500">Activated: {plan.date}</p>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <p className="text-emerald-400 font-mono font-bold">₹{plan.amount.toLocaleString()}</p>
                                 <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">{plan.roi} Returns</p>
                              </div>
                           </div>
                        ))
                      ) : (
                         <div className="p-4 text-center text-zinc-500 text-sm border border-dashed border-zinc-800 rounded-xl">
                            No active investment plans found.
                         </div>
                      )}
                   </div>
                </div>

                {/* Withdrawal Section */}
                <div className="bg-zinc-800/30 rounded-2xl p-6 border border-zinc-800">
                   <div className="flex justify-between items-center mb-4">
                     <h3 className="text-white font-bold flex items-center gap-2">
                        <Banknote size={20} className="text-blue-500" /> Withdraw ROI
                     </h3>
                     <span className="text-xs text-zinc-400">Available: <span className="text-white font-bold">₹{availableBalance.toLocaleString()}</span></span>
                   </div>
                   <div className="flex flex-col md:flex-row gap-4">
                      <input 
                         type="number" 
                         placeholder="Enter Amount" 
                         className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white outline-none focus:border-blue-500"
                         value={withdrawAmount}
                         onChange={(e) => setWithdrawAmount(e.target.value)}
                      />
                      <button 
                         onClick={openWithdrawModal}
                         className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-blue-900/20"
                      >
                         Withdraw to Main Wallet
                      </button>
                   </div>
                   <p className="text-[10px] text-zinc-500 mt-2">* Funds will be instantly credited to your Main Wallet.</p>
                </div>
              </div>
           </div>
        </div>
      )}

      {/* CONFIRM INVESTMENT MODAL */}
      {showInvestModal && selectedPlan && (
         <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-2xl shadow-2xl relative flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
               
               {/* FIXED HEADER */}
               <div className="flex justify-between items-center p-6 border-b border-zinc-800 shrink-0">
                   <div className="flex items-center gap-3">
                       <button onClick={() => setShowInvestModal(false)} className="p-2 bg-zinc-800 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors">
                          <ArrowLeft size={20} />
                       </button>
                       <h3 className="text-xl font-bold text-white font-serif-display">Confirm Investment</h3>
                   </div>
                   <button onClick={() => setShowInvestModal(false)} className="text-zinc-500 hover:text-white">
                      <X size={20} />
                   </button>
               </div>

               {/* SCROLLABLE CONTENT */}
               <div className="p-6 overflow-y-auto">
                  <p className="text-sm text-zinc-400 mb-6">Plan: <span className="text-amber-500">{selectedPlan.name}</span></p>

                  <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 mb-6">
                     <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Source: Booking Wallet</p>
                     <p className="text-xl font-mono text-emerald-400">₹{stats.bookingWallet.toLocaleString()}</p>
                  </div>

                  <div className="mb-6">
                     <label className="text-xs text-zinc-500 uppercase font-bold block mb-2">Investment Amount</label>
                     <input 
                        type="number" 
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:border-amber-500 outline-none"
                        value={investmentAmount}
                        onChange={(e) => setInvestmentAmount(e.target.value)}
                     />
                     <p className="text-[10px] text-zinc-500 mt-1">Min required: ₹{selectedPlan.minAmount.toLocaleString()}</p>
                  </div>

                  <button 
                     onClick={confirmInvestment}
                     className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-black font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-amber-900/20 transition-all"
                  >
                     Confirm & Pay
                  </button>
               </div>
            </div>
         </div>
      )}

      {/* CONFIRM WITHDRAWAL MODAL */}
      {showWithdrawModal && (
         <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-zinc-900 border border-zinc-800 w-full max-w-sm rounded-2xl shadow-2xl relative animate-in zoom-in-95 duration-200">
               <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-white">Confirm Withdrawal</h3>
                  <button onClick={() => setShowWithdrawModal(false)}><X size={20} className="text-zinc-500"/></button>
               </div>
               <div className="p-6">
                  <div className="text-center mb-6">
                     <p className="text-zinc-500 text-sm mb-2">You are withdrawing</p>
                     <p className="text-3xl font-mono font-bold text-white">₹{parseInt(withdrawAmount).toLocaleString()}</p>
                     <p className="text-emerald-500 text-xs mt-1">From ROI Balance</p>
                  </div>
                  <button 
                     onClick={confirmWithdraw}
                     className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-900/20"
                  >
                     Confirm Withdrawal
                  </button>
               </div>
            </div>
         </div>
      )}

    </div>
  );
};

export default InvestmentPage;
