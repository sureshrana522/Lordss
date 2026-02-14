
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Copy, 
  CheckCircle2, 
  ArrowLeft, 
  Share2, 
  Layout, 
  ShieldCheck, 
  Zap, 
  TrendingUp, 
  Sparkles, 
  Scissors,
  Layers,
  Percent,
  ArrowUpRight
} from 'lucide-react';

const BusinessPlan = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const planText = `
LORD’S BESPOKE TAILOR SYSTEM 2025 - BUSINESS MODEL

1. INCOME TYPES:
- Direct Work Payout: 85% of base rate released daily.
- Upline Income (L1): 25% of deduction pool from direct referrals.
- Network Income (L2-L10): Cumulative passive income from team orders.
- Magic Matrix: Global binary pool (2^n) auto-income.
- Performance Bonus: Extra rewards for Grade A quality/speed.

2. DEDUCTION POOL LOGIC:
- Every order has a 15% System Deduction.
- Example: If a Tailor earns ₹300, ₹45 (15%) goes to the Networking Pool.
- The Worker receives ₹255 (85%) instantly.

3. NETWORK DISTRIBUTION (Level 1 - 10):
- Level 1: 25% (Direct Upline)
- Level 2: 15%
- Level 3 to 6: 10% each
- Level 7 to 10: 5% each

4. WORKFLOW STAGES:
Showroom -> Measurement -> Cutting -> Sewing -> Finishing -> Press -> Delivery.
Paisa tab release hota hai jab agla worker order accept karta hai.
Final payment Customer OTP verification ke baad validate hoti hai.
  `;

  const handleCopy = () => {
    navigator.clipboard.writeText(planText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto min-h-screen pb-32 relative">
      {/* Success Notification */}
      <div className={`fixed top-0 left-0 w-full bg-emerald-500 text-black font-bold text-center py-3 z-[100] transition-transform duration-500 shadow-xl ${copied ? 'translate-y-0' : '-translate-y-full'}`}>
          <CheckCircle2 size={20} className="inline mr-2" /> COPIED TO CLIPBOARD
      </div>

      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-3 bg-zinc-900 rounded-full text-zinc-400 hover:text-white transition-all shadow-lg border border-zinc-800"><ArrowLeft size={24} /></button>
            <div>
                <h1 className="text-3xl font-serif-display text-white uppercase tracking-widest">Marketing Plan</h1>
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Income & Distribution Strategy</p>
            </div>
        </div>
        <button 
          onClick={handleCopy}
          className="bg-amber-600 hover:bg-amber-500 text-black font-black px-6 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-amber-900/20 uppercase tracking-widest text-xs"
        >
          {copied ? <CheckCircle2 size={20} /> : <Copy size={20} />} 
          {copied ? 'Copied All' : 'Copy All Text'}
        </button>
      </div>

      <div className="space-y-8">
        {/* SECTION 1: INCOME TYPES */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-5 text-amber-500"><TrendingUp size={120}/></div>
           <h2 className="text-xl font-serif-display text-amber-500 mb-6 flex items-center gap-3 uppercase tracking-widest">
              <Zap size={20} /> 5 Types of Income
           </h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'Direct Work', desc: '85% Daily Payout', icon: Scissors, color: 'text-blue-500' },
                { title: 'Upline Bonus', desc: '25% from Direct Team', icon: ArrowUpRight, color: 'text-emerald-500' },
                { title: 'Downline Passive', desc: 'L2 to L10 Network Share', icon: Layers, color: 'text-purple-500' },
                { title: 'Magic Matrix', desc: 'Global Auto-Pool (2^n)', icon: Sparkles, color: 'text-pink-500' },
                { title: 'Performance', desc: 'Grade A Quality Bonus', icon: ShieldCheck, color: 'text-cyan-500' }
              ].map((item, idx) => (
                <div key={idx} className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 flex items-center gap-4">
                   <div className={`p-3 rounded-xl bg-black border border-zinc-800 ${item.color}`}><item.icon size={20} /></div>
                   <div>
                      <p className="text-white font-bold text-sm uppercase">{item.title}</p>
                      <p className="text-[10px] text-zinc-500 font-bold">{item.desc}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* SECTION 2: DISTRIBUTION TABLE */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden">
           <h2 className="text-xl font-serif-display text-amber-500 mb-6 flex items-center gap-3 uppercase tracking-widest">
              <Percent size={20} /> Network Distribution
           </h2>
           <div className="bg-black rounded-3xl border border-zinc-800 overflow-hidden">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-zinc-950 text-[10px] text-zinc-500 font-black uppercase tracking-widest border-b border-zinc-800">
                       <th className="px-6 py-4">Level</th>
                       <th className="px-6 py-4">Share (%)</th>
                       <th className="px-6 py-4">Income Type</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-zinc-900">
                    {[
                      { l: 'Level 1', p: '25%', t: 'Direct Upline' },
                      { l: 'Level 2', p: '15%', t: 'Downline Team' },
                      { l: 'Level 3', p: '10%', t: 'Downline Team' },
                      { l: 'Level 4', p: '10%', t: 'Downline Team' },
                      { l: 'Level 5', p: '10%', t: 'Downline Team' },
                      { l: 'Level 6', p: '10%', t: 'Downline Team' },
                      { l: 'Level 7', p: '5%', t: 'Downline Team' },
                      { l: 'Level 8', p: '5%', t: 'Downline Team' },
                      { l: 'Level 9', p: '5%', t: 'Downline Team' },
                      { l: 'Level 10', p: '5%', t: 'Downline Team' },
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-white/5 transition-colors">
                         <td className="px-6 py-4 text-white font-mono text-xs">{row.l}</td>
                         <td className="px-6 py-4 text-emerald-500 font-bold text-sm">{row.p}</td>
                         <td className="px-6 py-4 text-zinc-400 text-[10px] font-bold uppercase">{row.t}</td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>

        {/* SECTION 3: SYSTEM LOGIC */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-6">
              <h3 className="text-white font-bold mb-4 uppercase tracking-widest text-sm border-b border-zinc-800 pb-2">Deduction Math</h3>
              <div className="space-y-4">
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500">Base Work Rate</span>
                    <span className="text-white font-mono font-bold">100%</span>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-red-500">Service Deduction</span>
                    <span className="text-red-500 font-mono font-bold">15%</span>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-emerald-500">Net Worker Payout</span>
                    <span className="text-emerald-500 font-mono font-bold">85%</span>
                 </div>
                 <p className="text-[9px] text-zinc-600 mt-4 leading-relaxed uppercase font-black italic">
                   "Deduction Pool is divided into 10 Levels for Upline and Magic Income."
                 </p>
              </div>
           </div>
           
           <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-6">
              <h3 className="text-white font-bold mb-4 uppercase tracking-widest text-sm border-b border-zinc-800 pb-2">Magic Matrix</h3>
              <div className="space-y-4">
                 <p className="text-xs text-zinc-400 leading-relaxed">
                   Global 2x2 Binary Structure. All global orders contribute 5% to the Matrix Fund. Positions fill automatically from left to right.
                 </p>
                 <div className="flex items-center gap-2 bg-black p-3 rounded-xl border border-zinc-800">
                    <Layout className="text-amber-500" size={16} />
                    <span className="text-[10px] text-white font-black uppercase tracking-widest">Growth: 2 > 4 > 8 > 16 > 32</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
      
      <div className="mt-12 text-center">
         <p className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.5em]">LORD'S BESPOKE INFRASTRUCTURE V2.0</p>
      </div>
    </div>
  );
};

export default BusinessPlan;
