// File: src/components/SystemSettingsModal.tsx
// -------------------------------------------
// Ye file Admin ke liye System Settings Modal banati hai
// Isme Modules, Finance, Levels, System tabs hain
// Toggle, input validation, aur save logic included hai

import React, { useState } from 'react';
import { Settings, X, DollarSign, Layers, ShieldAlert, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AppConfig } from '../types';

const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: (val: boolean) => void }) => (
  <button
    onClick={() => onChange(!enabled)}
    className={`w-12 h-6 rounded-full transition-all duration-300 relative ${enabled ? 'bg-emerald-500' : 'bg-zinc-700'}`}
  >
    <div
      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${
        enabled ? 'left-7' : 'left-1'
      }`}
    />
  </button>
);

const SystemSettingsModal = ({
  onClose,
  onAction
}: {
  onClose: () => void;
  onAction: (msg: string, type: 'success' | 'error') => void;
}) => {
  const { config, updateConfig } = useApp();
  const [activeTab, setActiveTab] = useState<'MODULES' | 'FINANCE' | 'LEVELS' | 'SYSTEM'>('MODULES');
  const [loading, setLoading] = useState(false);
  const [localConfig, setLocalConfig] = useState<AppConfig>(config);

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateConfig(localConfig);
      onAction('System Parameters Updated Successfully!', 'success');
      onClose();
    } catch (e) {
      onAction('Failed to update settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const totalDistribution = localConfig.levelDistributionRates.reduce((a, b) => a + b, 0);

  return (
    <div className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-md flex items-end md:items-center justify-center">
      <div className="w-full max-w-lg bg-[#121214] border-t border-zinc-800 md:border md:rounded-[2.5rem] flex flex-col h-[90vh] md:h-[80vh] shadow-2xl animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="p-6 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <Settings className="text-zinc-500" size={24} />
            <h2 className="text-xl font-serif-display text-white tracking-[0.2em] uppercase">System Settings</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full text-zinc-500 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-4 flex gap-2 overflow-x-auto scrollbar-hide shrink-0 mb-4 border-b border-zinc-900 pb-4">
          {['MODULES', 'FINANCE', 'LEVELS', 'SYSTEM'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                activeTab === tab
                  ? 'bg-amber-600 text-black border-amber-600'
                  : 'bg-zinc-900 text-zinc-500 border-zinc-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 pb-24 scrollbar-hide">
          {/* MODULES Tab */}
          {activeTab === 'MODULES' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-4 flex items-center gap-2">
                <Layers size={14} className="text-blue-500" /> Feature Modules
              </p>
              {[
                { id: 'isWithdrawalEnabled', label: 'Withdrawal System', desc: 'Enable/Disable Global Payouts', icon: DollarSign },
                { id: 'isInvestmentEnabled', label: 'Investment Module', desc: 'Allow users to invest funds', icon: DollarSign },
                { id: 'isGalleryEnabled', label: 'Gallery Access', desc: 'Show design gallery to users', icon: ImageIcon }
              ].map(mod => (
                <div key={mod.id} className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-3xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-black rounded-xl text-zinc-500 border border-zinc-800">
                      <mod.icon size={20} />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">{mod.label}</p>
                      <p className="text-[10px] text-zinc-500">{mod.desc}</p>
                    </div>
                  </div>
                  <Toggle
                    enabled={(localConfig as any)[mod.id]}
                    onChange={val => setLocalConfig({ ...localConfig, [mod.id]: val })}
                  />
                </div>
              ))}
            </div>
          )}

          {/* FINANCE Tab */}
          {activeTab === 'FINANCE' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-2 flex items-center gap-2">
                <DollarSign size={14} className="text-emerald-500" /> Deduction Rules
              </p>
              <div className="grid grid-cols-2 gap-4">
                {['workDeductionPercent','downlineSupportPercent','magicFundPercent'].map(key => (
                  <div key={key}>
                    <label className="text-[9px] text-zinc-500 uppercase font-black block mb-2 tracking-widest">
                      {key === 'workDeductionPercent' ? 'Work Deduction (%)' : key === 'downlineSupportPercent' ? 'Downline Support (%)' : 'Magic Fund (%)'}
                    </label>
                    <input
                      type="number"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-white font-mono text-xl focus:border-amber-500 outline-none"
                      value={(localConfig.deductions as any)[key]}
                      onChange={e =>
                        setLocalConfig({
                          ...localConfig,
                          deductions: {
                            ...localConfig.deductions,
                            [key]: clamp(Number(e.target.value), 0, 100)
                          }
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LEVELS Tab */}
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
                        step={0.1}
                        onChange={e => {
                          const newRates = [...localConfig.levelDistributionRates];
                          newRates[idx] = clamp(Number(e.target.value), 0, 100);
                          setLocalConfig({ ...localConfig, levelDistributionRates: newRates });
                        }}
                      />
                      <span className="text-zinc-600 font-bold">%</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-black/40 border-t border-zinc-800 pt-4 flex justify-between items-center">
                <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Total Distribution:</span>
                <span className={`text-lg font-mono font-bold ${totalDistribution > 100 ? 'text-red-500' : 'text-emerald-500'}`}>
                  {totalDistribution.toFixed(2)}%
                </span>
              </div>
            </div>
          )}

          {/* SYSTEM Tab */}
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
                  <Toggle
                    enabled={localConfig.maintenance.isActive}
                    onChange={val => setLocalConfig({ ...localConfig, maintenance: { ...localConfig.maintenance, isActive: val } })}
                  />
                </div>
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-4 flex items-center gap-2">
                  <DollarSign size={14} className="text-amber-500" /> Announcement Popup
                </p>
                <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-white font-bold text-sm">Show Announcement</p>
                    <Toggle
                      enabled={localConfig.announcement.isActive}
                      onChange={val => setLocalConfig({ ...localConfig, announcement: { ...localConfig.announcement, isActive: val } })}
                    />
                  </div>
                  <input
                    type="text"
                    className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-zinc-400 text-xs font-mono outline-none focus:border-amber-500"
                    placeholder="Image URL"
                    value={localConfig.announcement.imageUrl || ''}
                    onChange={e => setLocalConfig({ ...localConfig, announcement: { ...localConfig.announcement, imageUrl: e.target.value } })}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 shrink-0 border-t border-zinc-900 bg-[#121214] rounded-b-[2.5rem]">
          <button
            disabled={loading}
            onClick={handleSave}
            className="w-full bg-amber-600 hover:bg-amber-500 text-black font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all uppercase tracking-[0.2em] shadow-xl shadow-amber-900/20 active:scale-[0.98]"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <><Loader2 size={20} /> Save All Settings</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemSettingsModal;

/* 
Comment:
- File Name: SystemSettingsModal.tsx
- Use: Admin panel ke liye system settings modal
- Tabs: MODULES, FINANCE, LEVELS, SYSTEM
- Notes: Clamp numeric inputs 0-100, toggle booleans, loader animation
- Paste: src/components/SystemSettingsModal.tsx
*/
