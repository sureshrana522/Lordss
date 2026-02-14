
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, CheckCircle2, X, Bell, Check, XCircle, Settings, Users, 
  DollarSign, ShieldAlert, Save, Activity, Search, Layers, Repeat, 
  Lock, Unlock, Power, User, Phone, Briefcase, KeyRound, BadgeCheck, 
  Target, CreditCard, Image as ImageIcon, Trash2, UserPlus, Database, Loader2, 
  Info, Landmark, Smartphone, FileText, History, Clock, QrCode, ExternalLink, 
  Calendar, Truck, Package, Filter, Zap, Link as LinkIcon, Send,
  BarChart3, RefreshCw, AlertTriangle, IndianRupee, Download, TrendingUp, Percent
} from 'lucide-react';
import { UserRole, SystemUser, AppConfig, StitchingRate } from '../types';

// Custom Toggle Component to match screenshots
const Toggle = ({ enabled, onChange }: { enabled: boolean, onChange: (val: boolean) => void }) => (
    <button 
        onClick={() => onChange(!enabled)}
        className={`w-12 h-6 rounded-full transition-all duration-300 relative ${enabled ? 'bg-emerald-500' : 'bg-zinc-700'}`}
    >
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${enabled ? 'left-7' : 'left-1'}`} />
    </button>
);

// Redesigned System Settings Modal
const SystemSettingsModal = ({ onClose, onAction }: { onClose: () => void, onAction: (msg: string, type: 'success' | 'error') => void }) => {
    const { config, updateConfig } = useApp();
    const [activeTab, setActiveTab] = useState<'MODULES' | 'FINANCE' | 'LEVELS' | 'SYSTEM'>('MODULES');
    const [loading, setLoading] = useState(false);
    const [localConfig, setLocalConfig] = useState<AppConfig>(config);

    const handleSave = async () => {
        setLoading(true);
        try {
            await updateConfig(localConfig);
            onAction("System Parameters Updated Successfully!", "success");
            onClose();
        } catch (e) {
            onAction("Failed to update settings", "error");
        } finally {
            setLoading(false);
        }
    };

    const totalDistribution = localConfig.levelDistributionRates.reduce((a, b) => a + b, 0);

    return (
        <div className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-md flex items-end md:items-center justify-center">
            <div className="w-full max-w-lg bg-[#121214] border-t border-zinc-800 md:border md:rounded-[2.5rem] flex flex-col h-[90vh] md:h-[80vh] shadow-2xl animate-in slide-in-from-bottom duration-300">
                
                <div className="p-6 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        <Settings className="text-zinc-500" size={24} />
                        <h2 className="text-xl font-serif-display text-white tracking-[0.2em] uppercase">System Settings</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full text-zinc-500 transition-colors"><X size={24} /></button>
                </div>

                <div className="px-4 flex gap-2 overflow-x-auto scrollbar-hide shrink-0 mb-4 border-b border-zinc-900 pb-4">
                    {['MODULES', 'FINANCE', 'LEVELS', 'SYSTEM'].map((tab) => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${activeTab === tab ? 'bg-amber-600 text-black border-amber-600' : 'bg-zinc-900 text-zinc-500 border-zinc-800'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="flex-1 overflow-y-auto px-6 pb-24 scrollbar-hide">
                    {activeTab === 'MODULES' && (
                        <div className="space-y-4 animate-in fade-in duration-300">
                            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-4 flex items-center gap-2">
                                <Layers size={14} className="text-blue-500" /> Feature Modules
                            </p>
                            {[
                                { id: 'isWithdrawalEnabled', label: 'Withdrawal System', desc: 'Enable/Disable Global Payouts', icon: CreditCard },
                                { id: 'isInvestmentEnabled', label: 'Investment Module', desc: 'Allow users to invest funds', icon: TrendingUp },
                                { id: 'isGalleryEnabled', label: 'Gallery Access', desc: 'Show design gallery to users', icon: ImageIcon }
                            ].map((mod) => (
                                <div key={mod.id} className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-3xl flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-black rounded-xl text-zinc-500 border border-zinc-800"><mod.icon size={20} /></div>
                                        <div>
                                            <p className="text-white font-bold text-sm">{mod.label}</p>
                                            <p className="text-[10px] text-zinc-500">{mod.desc}</p>
                                        </div>
                                    </div>
                                    <Toggle enabled={(localConfig as any)[mod.id]} onChange={(val) => setLocalConfig({...localConfig, [mod.id]: val})} />
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'FINANCE' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-2 flex items-center gap-2">
                                <DollarSign size={14} className="text-emerald-500" /> Deduction Rules
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[9px] text-zinc-500 uppercase font-black block mb-2 tracking-widest">Work Deduction (%)</label>
                                    <input type="number" className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-white font-mono text-xl focus:border-amber-500 outline-none" value={localConfig.deductions.workDeductionPercent} onChange={e => setLocalConfig({...localConfig, deductions: {...localConfig.deductions, workDeductionPercent: Number(e.target.value)}})} />
                                </div>
                                <div>
                                    <label className="text-[9px] text-zinc-500 uppercase font-black block mb-2 tracking-widest">Downline Support (%)</label>
                                    <input type="number" className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-white font-mono text-xl focus:border-amber-500 outline-none" value={localConfig.deductions.downlineSupportPercent} onChange={e => setLocalConfig({...localConfig, deductions: {...localConfig.deductions, downlineSupportPercent: Number(e.target.value)}})} />
                                </div>
                                <div className="col-span-1">
                                    <label className="text-[9px] text-zinc-500 uppercase font-black block mb-2 tracking-widest">Magic Fund (%)</label>
                                    <input type="number" className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-white font-mono text-xl focus:border-amber-500 outline-none" value={localConfig.deductions.magicFundPercent} onChange={e => setLocalConfig({...localConfig, deductions: {...localConfig.deductions, magicFundPercent: Number(e.target.value)}})} />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'LEVELS' && (
                        <div className="animate-in fade-in duration-300">
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                {localConfig.levelDistributionRates.map((rate, idx) => (
                                    <div key={idx} className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl flex items-center justify-between">
                                        <span className="text-[9px] text-zinc-500 uppercase font-black">Level {idx + 1}</span>
                                        <div className="flex items-center gap-2">
                                            <input 
                                                type="number" 
                                                className="bg-transparent text-right text-white font-bold w-12 outline-none focus:text-amber-500" 
                                                value={rate} 
                                                step="0.1"
                                                onChange={e => {
                                                    const newRates = [...localConfig.levelDistributionRates];
                                                    newRates[idx] = Number(e.target.value);
                                                    setLocalConfig({...localConfig, levelDistributionRates: newRates});
                                                }}
                                            />
                                            <span className="text-zinc-600 font-bold">%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-black/40 border-t border-zinc-800 pt-4 flex justify-between items-center">
                                <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Total Distribution:</span>
                                <span className={`text-lg font-mono font-bold ${totalDistribution > 100 ? 'text-red-500' : 'text-emerald-500'}`}>{totalDistribution.toFixed(2)}%</span>
                            </div>
                        </div>
                    )}

                    {activeTab === 'SYSTEM' && (
                        <div className="space-y-8 animate-in fade-in duration-300">
                            <div>
                                <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-4 flex items-center gap-2">
                                    <ShieldAlert size={14} className="text-red-500" /> Maintenance Mode
                                </p>
                                <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-3xl flex items-center justify-between">
                                    <div>
                                        <p className="text-white font-bold text-sm">System Maintenance</p>
                                        <p className="text-[10px] text-zinc-500">Block access for all users except Admin</p>
                                    </div>
                                    <Toggle enabled={localConfig.maintenance.isActive} onChange={(val) => setLocalConfig({...localConfig, maintenance: {...localConfig.maintenance, isActive: val}})} />
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-4 flex items-center gap-2">
                                    <Bell size={14} className="text-amber-500" /> Announcement Popup
                                </p>
                                <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl space-y-4">
                                    <div className="flex items-center justify-between">
                                        <p className="text-white font-bold text-sm">Show Announcement</p>
                                        <Toggle enabled={localConfig.announcement.isActive} onChange={(val) => setLocalConfig({...localConfig, announcement: {...localConfig.announcement, isActive: val}})} />
                                    </div>
                                    <input 
                                        type="text" 
                                        className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-zinc-400 text-xs font-mono outline-none focus:border-amber-500" 
                                        placeholder="Image URL"
                                        value={localConfig.announcement.imageUrl || ''}
                                        onChange={e => setLocalConfig({...localConfig, announcement: {...localConfig.announcement, imageUrl: e.target.value}})}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 shrink-0 border-t border-zinc-900 bg-[#121214] rounded-b-[2.5rem]">
                    <button 
                        disabled={loading} 
                        onClick={handleSave} 
                        className="w-full bg-amber-600 hover:bg-amber-500 text-black font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all uppercase tracking-[0.2em] shadow-xl shadow-amber-900/20 active:scale-[0.98]"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Save All Settings</>}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Rate Management Modal with 2 Tabs (Worker Payouts / Customer Prices)
const RateManagementModal = ({ onClose, onAction }: { onClose: () => void, onAction: (msg: string, type: 'success' | 'error') => void }) => {
    const { stitchingRates, updateStitchingRates } = useApp();
    const [activeTab, setActiveTab] = useState<'PAYOUTS' | 'PRICES'>('PAYOUTS');
    const [loading, setLoading] = useState(false);

    // Initial Default Data structure if none exists
    const defaultPayouts: StitchingRate[] = [
        { id: '1', type: 'Shirt Measurement', normal: 30, medium: 40, regular: 50, vip: 70, rateType: 'Fixed' },
        { id: '2', type: 'Shirt Cutting', normal: 50, medium: 60, regular: 80, vip: 100, rateType: 'Fixed' },
        { id: '3', type: 'Shirt Maker', normal: 200, medium: 250, regular: 300, vip: 450, rateType: 'Fixed' },
        { id: '4', type: 'Pant Measurement', normal: 30, medium: 40, regular: 50, vip: 70, rateType: 'Fixed' },
        { id: '5', type: 'Pant Cutting', normal: 50, medium: 60, regular: 80, vip: 100, rateType: 'Fixed' },
        { id: '6', type: 'Pant Maker', normal: 200, medium: 250, regular: 300, vip: 450, rateType: 'Fixed' },
        { id: '7', type: 'Kaaj Button', normal: 10, medium: 15, regular: 20, vip: 30, rateType: 'Fixed' },
        { id: '8', type: 'Press (Paresh)', normal: 15, medium: 20, regular: 25, vip: 40, rateType: 'Fixed' },
        { id: '9', type: 'Delivery Logistics', normal: 5, medium: 7, regular: 10, vip: 15, rateType: 'Percentage' } // Added Delivery
    ];

    const defaultPrices: StitchingRate[] = [
        { id: 'p1', type: 'Trendy Fit Edition', normal: 800, medium: 1000, regular: 1200, vip: 1800, rateType: 'Fixed' },
        { id: 'p2', type: 'Imperial Series', normal: 1200, medium: 1500, regular: 1800, vip: 2500, rateType: 'Fixed' },
        { id: 'p3', type: 'Signature Line', normal: 2000, medium: 2500, regular: 3500, vip: 5000, rateType: 'Fixed' },
        { id: 'p4', type: 'Lords Special Edition', normal: 5000, medium: 7500, regular: 10000, vip: 15000, rateType: 'Fixed' }
    ];

    const [localRates, setLocalRates] = useState<StitchingRate[]>(stitchingRates.length > 0 ? stitchingRates : [...defaultPayouts, ...defaultPrices]);

    const handleRateChange = (id: string, field: keyof StitchingRate, value: string) => {
        setLocalRates(prev => prev.map(r => r.id === id ? { ...r, [field]: parseFloat(value) || 0 } : r));
    };

    const toggleRateType = (id: string) => {
        setLocalRates(prev => prev.map(r => r.id === id ? { ...r, rateType: r.rateType === 'Percentage' ? 'Fixed' : 'Percentage' } : r));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await updateStitchingRates(localRates);
            onAction("Rates Updated Successfully!", "success");
            onClose();
        } catch (e) {
            onAction("Error updating rates", "error");
        } finally {
            setLoading(false);
        }
    };

    const filteredRates = localRates.filter(r => 
        activeTab === 'PAYOUTS' 
            ? !r.type.includes('Edition') && !r.type.includes('Series') && !r.type.includes('Line')
            : r.type.includes('Edition') || r.type.includes('Series') || r.type.includes('Line')
    );

    return (
        <div className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-xl flex items-end md:items-center justify-center">
            <div className="w-full max-w-lg bg-[#121214] border-t border-zinc-800 md:border md:rounded-[2.5rem] flex flex-col h-[90vh] md:h-[85vh] shadow-2xl animate-in slide-in-from-bottom duration-300">
                
                {/* Header */}
                <div className="p-6 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        <IndianRupee size={24} className="text-emerald-500" />
                        <h2 className="text-xl font-serif-display text-white tracking-widest uppercase">Rate Management</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full text-zinc-500 transition-colors"><X size={24} /></button>
                </div>

                {/* Tabs */}
                <div className="px-6 flex gap-2 mb-6 shrink-0">
                    <button onClick={() => setActiveTab('PAYOUTS')} className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${activeTab === 'PAYOUTS' ? 'bg-amber-600 text-black border-amber-600 shadow-lg shadow-amber-900/20' : 'bg-zinc-950 text-zinc-600 border-zinc-800 hover:border-zinc-700'}`}>Worker Payouts</button>
                    <button onClick={() => setActiveTab('PRICES')} className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${activeTab === 'PRICES' ? 'bg-amber-600 text-black border-amber-600 shadow-lg shadow-amber-900/20' : 'bg-zinc-950 text-zinc-600 border-zinc-800 hover:border-zinc-700'}`}>Customer Prices</button>
                </div>

                {/* List Area */}
                <div className="flex-1 overflow-y-auto px-6 pb-24 space-y-4 scrollbar-hide">
                    {filteredRates.map(rate => (
                        <div key={rate.id} className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-3xl space-y-5 group hover:border-zinc-700 transition-all">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="text-white font-black text-sm uppercase tracking-wider">{rate.type}</h4>
                                    <p className="text-[9px] text-zinc-600 uppercase font-black tracking-[0.2em] mt-1 flex items-center gap-1">
                                        {rate.rateType === 'Percentage' ? <Percent size={10} className="text-emerald-500" /> : <Database size={10} />}
                                        {rate.rateType === 'Percentage' ? 'Order Value %' : 'Fixed Unit Base'}
                                    </p>
                                </div>
                                <button 
                                    onClick={() => toggleRateType(rate.id)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[9px] font-black uppercase transition-all ${rate.rateType === 'Percentage' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' : 'bg-zinc-800 border-zinc-700 text-zinc-500'}`}
                                >
                                    {rate.rateType === 'Percentage' ? 'Set as Fixed' : 'Set as %'}
                                </button>
                            </div>

                            <div className="grid grid-cols-4 gap-2">
                                {[
                                    { label: 'Normal', key: 'normal', color: 'border-zinc-800 focus:border-zinc-500', text: 'text-zinc-500' },
                                    { label: 'Medium', key: 'medium', color: 'border-purple-900/40 focus:border-purple-500', text: 'text-purple-500' },
                                    { label: 'Regular', key: 'regular', color: 'border-blue-900/40 focus:border-blue-500', text: 'text-blue-500' },
                                    { label: 'VIP', key: 'vip', color: 'border-amber-900/40 focus:border-amber-500', text: 'text-amber-500' }
                                ].map(q => (
                                    <div key={q.key} className="space-y-1.5">
                                        <p className={`text-[8px] text-center uppercase font-black tracking-widest ${q.text}`}>{q.label}</p>
                                        <div className="relative">
                                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-zinc-700 font-bold">
                                                {rate.rateType === 'Percentage' ? '' : '₹'}
                                            </span>
                                            <input 
                                                type="number" 
                                                step="0.1"
                                                className={`w-full bg-black border ${q.color} rounded-xl py-3 px-2 pl-4 text-center text-white font-mono text-sm outline-none transition-all placeholder-zinc-800`}
                                                value={(rate as any)[q.key]}
                                                onChange={e => handleRateChange(rate.id, q.key as any, e.target.value)}
                                            />
                                            {rate.rateType === 'Percentage' && (
                                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-zinc-700 font-bold">%</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {filteredRates.length === 0 && (
                        <div className="text-center py-20 border-2 border-dashed border-zinc-800 rounded-3xl">
                             <AlertTriangle size={32} className="text-zinc-800 mx-auto mb-3" />
                             <p className="text-zinc-600 text-xs font-black uppercase tracking-widest">No rates defined</p>
                        </div>
                    )}
                </div>

                {/* Footer Action */}
                <div className="p-6 shrink-0 border-t border-zinc-900 bg-[#121214] rounded-b-[2.5rem]">
                    <button 
                        disabled={loading} 
                        onClick={handleSave} 
                        className="w-full bg-amber-600 hover:bg-amber-500 text-black font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all uppercase tracking-[0.2em] shadow-xl shadow-amber-900/20 active:scale-[0.98]"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Save New Rates</>}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Manual Fund Release (COD) Panel
const ManualReleasePanel = ({ onClose, onAction }: { onClose: () => void, onAction: (msg: string, type: 'success' | 'error') => void }) => {
    const { releaseFundsManually } = useApp();
    const [userId, setUserId] = useState('');
    const [amount, setAmount] = useState('');
    const [walletType, setWalletType] = useState('Booking');
    const [loading, setLoading] = useState(false);

    const handleRelease = async () => {
        if (!userId || !amount) return onAction("Please fill User ID and Amount", "error");
        setLoading(true);
        const success = await releaseFundsManually(userId.toUpperCase(), parseInt(amount), walletType, 'Admin Manual Adjustment (COD Style)');
        if (success) {
            onAction(`₹${amount} added to ${userId} Successfully!`, "success");
            onClose();
        } else {
            onAction("Invalid User ID or Error", "error");
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-serif-display text-white tracking-widest uppercase">Manual Fund Add</h2>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full text-zinc-500 transition-colors"><X size={24}/></button>
                </div>
                <div className="space-y-5">
                    <input type="text" placeholder="LBT-XXXX" className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-white focus:border-amber-500 outline-none font-mono uppercase" value={userId} onChange={e => setUserId(e.target.value)} />
                    <input type="number" placeholder="Amount ₹" className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-white focus:border-amber-500 outline-none font-mono" value={amount} onChange={e => setAmount(e.target.value)} />
                    <select className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-white outline-none" value={walletType} onChange={e => setWalletType(e.target.value)}>
                        <option value="Booking">Booking Wallet</option>
                        <option value="Daily">Daily Income</option>
                        <option value="Upline">Direct Bonus</option>
                        <option value="Magic">Magic Matrix</option>
                    </select>
                </div>
                <button disabled={loading} onClick={handleRelease} className="w-full mt-8 bg-[#0ea5e9] hover:bg-blue-400 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all uppercase tracking-widest shadow-xl shadow-blue-900/20 active:scale-95">
                    {loading ? <Loader2 className="animate-spin" /> : <><Send size={18} /> CREDIT FUNDS INSTANTLY</>}
                </button>
            </div>
        </div>
    );
};

// Approval Requests Panel - Updated for Robustness
const RequestsPanel = ({ onClose, onAction }: { onClose: () => void, onAction: (msg: string, type: 'success' | 'error') => void }) => {
    const { requests, approveRequest } = useApp();
    const [loading, setLoading] = useState<string | null>(null);

    const handleAction = async (e: React.MouseEvent, id: string, approved: boolean) => {
        e.stopPropagation(); // Stop bubbling
        if (loading) return; // Prevent double clicks
        
        setLoading(id);
        
        try {
            const success = await approveRequest(id, approved);
            if (success) {
                 onAction(`Request ${approved ? 'Approved' : 'Rejected'} successfully`, 'success');
            } else {
                 onAction('Operation Failed. Check Amount or Connection.', 'error');
            }
        } catch (err) {
            console.error("Approval Error:", err);
            onAction('System Error during Approval', 'error');
        } finally {
            setLoading(null);
        }
    };

    // Filter and sort requests
    const pendingRequests = requests.filter(r => r.status === 'PENDING').sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="fixed inset-0 z-[110] bg-black/95 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 shadow-2xl flex flex-col max-h-[85vh]">
                <div className="flex justify-between items-center mb-8 shrink-0">
                    <h2 className="text-2xl font-serif-display text-white tracking-widest uppercase">Requests Center</h2>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full text-zinc-500 transition-colors"><X size={24} /></button>
                </div>
                <div className="flex-1 overflow-y-auto space-y-4 scrollbar-hide p-1">
                    {pendingRequests.map(req => (
                        <div key={req.id} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 group hover:border-zinc-700 transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-white font-bold">{req.userName}</p>
                                    <p className="text-[10px] text-zinc-600 font-mono tracking-wider">{req.userId} • {req.type}</p>
                                    {req.utr && <p className="text-[10px] text-amber-500 font-bold mt-1">UTR: {req.utr}</p>}
                                    {req.paymentDetails && <p className="text-[10px] text-blue-500 font-bold mt-1">{req.paymentDetails}</p>}
                                </div>
                                <p className="text-lg font-mono font-bold text-amber-500">₹{req.amount}</p>
                            </div>
                            <div className="flex gap-3">
                                <button 
                                    disabled={!!loading} 
                                    onClick={(e) => handleAction(e, req.id, false)} 
                                    className={`flex-1 py-3 bg-zinc-900 text-zinc-500 border border-zinc-800 rounded-xl text-[10px] uppercase font-black tracking-widest hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all ${loading === req.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    Reject
                                </button>
                                <button 
                                    disabled={!!loading} 
                                    onClick={(e) => handleAction(e, req.id, true)} 
                                    className={`flex-1 py-3 bg-emerald-600 text-black rounded-xl text-[10px] uppercase font-black tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-900/10 ${loading === req.id ? 'opacity-70 cursor-wait' : ''}`}
                                >
                                    {loading === req.id ? <Loader2 className="animate-spin" size={14} /> : <><Check size={14} /> Approve</>}
                                </button>
                            </div>
                        </div>
                    ))}
                    {pendingRequests.length === 0 && (
                        <div className="text-center py-20 border-2 border-dashed border-zinc-800 rounded-3xl">
                             <Bell size={32} className="text-zinc-800 mx-auto mb-3" />
                             <p className="text-zinc-600 text-xs font-black uppercase tracking-widest">No pending requests</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const AdminConfigPage = () => {
    const navigate = useNavigate();
    const { requests, seedDatabase, resetDatabase } = useApp();
    const [showRequests, setShowRequests] = useState(false);
    const [showManualRelease, setShowManualRelease] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showRates, setShowRates] = useState(false);
    const [banner, setBanner] = useState<{ show: boolean; msg: string; type: 'success' | 'error' }>({ show: false, msg: '', type: 'success' });

    const triggerBanner = (msg: string, type: 'success' | 'error' = 'success') => {
        setBanner({ show: true, msg, type });
        setTimeout(() => setBanner(p => ({ ...p, show: false })), 3000);
    };

    const ConfigCard = ({ title, desc, icon: Icon, colorClass, bgClass, onClick, badge }: any) => (
        <div onClick={onClick} className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-6 flex flex-col group hover:border-zinc-500 transition-all cursor-pointer relative overflow-hidden shadow-lg active:scale-95 min-h-[160px]">
            {badge && <div className="absolute top-4 right-4 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-full animate-bounce shadow-lg">{badge}</div>}
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 border transition-transform group-hover:scale-110 ${bgClass} ${colorClass}`}>
                <Icon size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-wide leading-tight">{title}</h3>
            <p className="text-zinc-600 text-[10px] leading-relaxed uppercase tracking-wider font-bold opacity-60">{desc}</p>
        </div>
    );

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen pb-32">
            <div className={`fixed top-0 left-0 w-full z-[200] py-4 text-center font-bold text-black transition-transform duration-500 shadow-xl ${banner.show ? 'translate-y-0' : '-translate-y-full'} ${banner.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}>{banner.msg}</div>

            <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-6 border-b border-zinc-900 pb-10">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-3 bg-zinc-900 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors shadow-lg"><ArrowLeft size={24} /></button>
                    <div>
                        <h1 className="text-4xl font-serif-display text-white uppercase tracking-[0.2em] leading-none">Admin Panel</h1>
                        <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest mt-2">Control & Infrastructure Center</p>
                    </div>
                </div>
                <button onClick={() => setShowManualRelease(true)} className="bg-emerald-600 hover:bg-emerald-500 text-black px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-900/10 flex items-center transition-all active:scale-95"><DollarSign size={18} className="mr-2" /> Fund Add (COD)</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div onClick={() => navigate('/orders')} className="bg-amber-500 rounded-[2rem] p-6 flex flex-col group cursor-pointer hover:scale-[1.02] transition-all shadow-2xl shadow-amber-500/10 relative overflow-hidden h-[180px] justify-end">
                    <div className="absolute top-6 left-6 p-4 bg-black/10 rounded-2xl text-black"><Activity size={32} /></div>
                    <div className="text-black">
                        <h3 className="text-2xl font-black uppercase leading-tight">Live<br/>Monitor</h3>
                        <p className="text-black/60 text-[10px] font-black uppercase tracking-widest mt-1">Real-time Stage Control</p>
                    </div>
                </div>
                <ConfigCard title="System Settings" desc="Edit UPI, Deductions & Maintenance." icon={Settings} colorClass="text-zinc-400" bgClass="bg-zinc-950" onClick={() => setShowSettings(true)} />
                <ConfigCard title="Rate Management" desc="Change Payouts & Customer Rates." icon={IndianRupee} colorClass="text-emerald-500" bgClass="bg-emerald-950/20" onClick={() => setShowRates(true)} />
                <ConfigCard title="Staff Manager" desc="Add Members, Manage Profiles & Access." icon={Users} colorClass="text-blue-400" bgClass="bg-blue-950/20" onClick={() => navigate('/team')} />
                <ConfigCard title="Gallery Studio" desc="Upload New Patterns & Design Items." icon={ImageIcon} colorClass="text-purple-400" bgClass="bg-purple-950/20" onClick={() => navigate('/gallery')} />
                <ConfigCard title="Request Center" desc="Approve Withdrawals & Join Forms." icon={Bell} colorClass="text-red-400" bgClass="bg-red-950/20" badge={requests.filter(r => r.status === 'PENDING').length || null} onClick={() => setShowRequests(true)} />
                <ConfigCard title="Data Utility" desc="Initial Seed & Database Setup Tools." icon={Database} colorClass="text-emerald-400" bgClass="bg-emerald-950/20" onClick={async () => { const res = await seedDatabase(); triggerBanner(res.message, res.success ? 'success' : 'error'); }} />
                <div onClick={() => { if(window.confirm("FATAL ACTION: This will delete everything except Admin ID. Proceed?")) { resetDatabase(); triggerBanner("SYSTEM WIPED SUCCESSFULLY", "error"); } }} className="bg-red-950/10 border border-red-900/20 rounded-[2rem] p-6 flex flex-col items-center justify-center text-center cursor-pointer group hover:bg-red-900/20 hover:border-red-500/30 transition-all">
                    <RefreshCw size={24} className="text-red-500 mb-2 group-hover:rotate-180 transition-transform duration-700" />
                    <h3 className="text-lg font-black text-red-500 uppercase tracking-widest">Factory Reset</h3>
                </div>
            </div>

            {showRequests && <RequestsPanel onClose={() => setShowRequests(false)} onAction={triggerBanner} />}
            {showManualRelease && <ManualReleasePanel onClose={() => setShowManualRelease(false)} onAction={triggerBanner} />}
            {showSettings && <SystemSettingsModal onClose={() => setShowSettings(false)} onAction={triggerBanner} />}
            {showRates && <RateManagementModal onClose={() => setShowRates(false)} onAction={triggerBanner} />}
        </div>
    );
};

export default AdminConfigPage;
