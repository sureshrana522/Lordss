
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Users, Search, UserPlus, Edit2, X, Save, Loader2, User, Phone, ShieldCheck, 
  ChevronRight, Network, Sparkles, Trophy, ArrowUpRight, ArrowDownRight,
  Layers, Wallet, Info, Power, KeyRound, Briefcase, Landmark, Smartphone, Hash,
  Eye, Calendar, ChevronDown, List, CheckCircle2, Lock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { SystemUser, UserRole } from '../types';

// Modal to show members of a specific level
const LevelMembersModal = ({ isOpen, onClose, level, members, title }: any) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-300">
                <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-950">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 font-black">
                            L{level}
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-lg">{title} Members</h3>
                            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Level {level} Breakdown</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full text-zinc-500 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>
                
                <div className="p-4 overflow-y-auto flex-1 space-y-3 scrollbar-hide">
                    {members.length > 0 ? (
                        members.map((m: SystemUser) => (
                            <div key={m.id} className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 group hover:border-zinc-600 transition-all">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-600 font-black border border-zinc-800">
                                            {m.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-white font-bold text-sm uppercase tracking-wide">{m.name}</p>
                                            <p className="text-[10px] text-zinc-500 font-mono tracking-widest">{m.id}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-zinc-400 font-bold flex items-center gap-1 justify-end">
                                            <Phone size={10} className="text-amber-500" /> {m.mobile}
                                        </p>
                                        <p className="text-[9px] text-zinc-600 mt-1 uppercase font-black">Joined: {m.joinDate}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-3xl opacity-30">
                            <Users size={48} className="mx-auto mb-4 text-zinc-700" />
                            <p className="text-zinc-500 font-black uppercase tracking-widest">No members in this level</p>
                        </div>
                    )}
                </div>
                
                <div className="p-6 bg-zinc-950 border-t border-zinc-800 text-center">
                    <button onClick={onClose} className="text-[10px] font-black text-zinc-500 hover:text-white uppercase tracking-[0.2em] transition-colors">Close View History</button>
                </div>
            </div>
        </div>
    );
};

// Edit Staff Modal
const EditStaffModal = ({ isOpen, onClose, user }: { isOpen: boolean, onClose: () => void, user: SystemUser | null }) => {
    const { updateSystemUser } = useApp();
    const [formData, setFormData] = useState<Partial<SystemUser>>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                mobile: user.mobile,
                role: user.role,
                status: user.status,
                loginPassword: user.loginPassword || '',
                tPassword: user.tPassword || ''
            });
        }
    }, [user]);

    if (!isOpen || !user) return null;

    const handleSave = async () => {
        setLoading(true);
        try {
            await updateSystemUser(user.id, formData);
            setLoading(false);
            onClose();
        } catch (e) {
            console.error("Update failed", e);
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-[2.5rem] shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
                <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold text-white">Edit Staff Profile</h3>
                        <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">ID: {user.id}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full text-zinc-500 hover:text-white"><X size={24} /></button>
                </div>
                
                <div className="p-6 space-y-4">
                    <div>
                        <label className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1 block">Full Name</label>
                        <input type="text" className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-white focus:border-amber-500 outline-none" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1 block">Mobile Number</label>
                        <input type="tel" className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-white focus:border-amber-500 outline-none" value={formData.mobile || ''} onChange={e => setFormData({...formData, mobile: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1 block">Department Role</label>
                            <select className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-white outline-none" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as UserRole})}>
                                {Object.values(UserRole).map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                        <div>
                             <label className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1 block">Account Status</label>
                             <select className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-white outline-none" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})}>
                                <option value="Active">Active</option>
                                <option value="Blocked">Blocked</option>
                            </select>
                        </div>
                    </div>
                     <div>
                        <label className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1 block">Login Password</label>
                        <input type="text" className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-white focus:border-red-500 outline-none font-mono" value={formData.loginPassword || ''} onChange={e => setFormData({...formData, loginPassword: e.target.value})} />
                    </div>
                </div>

                <div className="p-6 pt-0">
                    <button disabled={loading} onClick={handleSave} className="w-full bg-amber-600 hover:bg-amber-500 text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 uppercase tracking-widest shadow-xl shadow-amber-900/20 active:scale-95 transition-all">
                        {loading ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Update Profile</>}
                    </button>
                </div>
            </div>
        </div>
    );
};

const LevelCard = ({ level, members, commission, colorClass, onClick, maxExpected }: any) => (
    <div 
        onClick={() => onClick(level, members)}
        className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-3xl flex items-center justify-between group hover:border-zinc-600 hover:bg-zinc-800/50 transition-all cursor-pointer active:scale-[0.98]"
    >
        <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm border ${colorClass} bg-opacity-10 shadow-lg group-hover:scale-110 transition-transform`}>
                L{level}
            </div>
            <div>
                <p className="text-white font-bold text-base">Level {level}</p>
                <div className="flex items-center gap-2">
                    <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">
                        {members.length}{maxExpected ? ` / ${maxExpected}` : ''} Members
                    </p>
                    <div className="w-1 h-1 bg-zinc-800 rounded-full"></div>
                    <p className="text-[10px] text-amber-500/80 uppercase font-black tracking-widest flex items-center gap-1">
                        <Eye size={10} /> View Details
                    </p>
                </div>
            </div>
        </div>
        <div className="text-right">
            <p className="text-[10px] text-zinc-600 uppercase font-black mb-1">Commission Earned</p>
            <p className="text-lg font-mono font-bold text-emerald-500">₹{commission.toFixed(5)}</p>
        </div>
    </div>
);

const MyTeamPage = () => {
  const { currentUser, systemUsers, role, transactions } = useApp();
  const [activeTab, setActiveTab] = useState<'NETWORK' | 'MAGIC' | 'STAFF'>('NETWORK');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Member View State
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [selectedLevelData, setSelectedLevelData] = useState<{level: number, members: any[], title: string}>({ level: 0, members: [], title: '' });

  // Edit Staff State
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);

  // 1. Calculate Network Tree (10 Levels)
  const getNetworkTree = (uplineId: string, level: number = 1, maxLevel: number = 10): any[] => {
    if (level > maxLevel) return [];
    const directDownlines = systemUsers.filter(u => u.uplineId === uplineId);
    let tree: any[] = [];
    directDownlines.forEach(user => {
        const userWithLevel = { ...user, networkLevel: level };
        tree.push(userWithLevel);
        const deeper = getNetworkTree(user.id, level + 1, maxLevel);
        tree = [...tree, ...deeper];
    });
    return tree;
  };

  const myNetwork = useMemo(() => currentUser ? getNetworkTree(currentUser.id) : [], [currentUser, systemUsers]);

  // 2. Calculate Magic Matrix Tree (Binary structure logic)
  const getMagicTree = (magicUplineId: string, level: number = 1, maxLevel: number = 10): any[] => {
    if (level > maxLevel) return [];
    const directMagic = systemUsers.filter(u => u.magicUplineId === magicUplineId);
    let tree: any[] = [];
    directMagic.forEach(user => {
        const userWithLevel = { ...user, magicLevel: level };
        tree.push(userWithLevel);
        const deeper = getMagicTree(user.id, level + 1, maxLevel);
        tree = [...tree, ...deeper];
    });
    return tree;
  };

  const myMagicTree = useMemo(() => currentUser ? getMagicTree(currentUser.id) : [], [currentUser, systemUsers]);

  const getLevelStats = (network: any[], walletType: string, levelKey: 'networkLevel' | 'magicLevel') => {
    const stats = Array.from({ length: 10 }, (_, i) => ({
        level: i + 1,
        members: [] as any[],
        commission: 0,
        binaryCap: levelKey === 'magicLevel' ? Math.pow(2, i + 1) : 0
    }));

    network.forEach(user => {
        const lvl = user[levelKey];
        if (lvl >= 1 && lvl <= 10) {
            stats[lvl - 1].members.push(user);
        }
    });

    transactions.forEach(tx => {
        if (tx.userId === currentUser?.id && tx.walletType === walletType && tx.level) {
            const levelNum = parseInt(tx.level.replace('L', ''));
            if (levelNum >= 1 && levelNum <= 10) {
                stats[levelNum - 1].commission += tx.amount;
            }
        }
    });

    return stats;
  };

  const networkStats = useMemo(() => getLevelStats(myNetwork, 'Downline', 'networkLevel'), [myNetwork, transactions, currentUser]);
  const magicStats = useMemo(() => getLevelStats(myMagicTree, 'Magic', 'magicLevel'), [myMagicTree, transactions, currentUser]);

  const totalNetworkEarn = networkStats.reduce((acc, curr) => acc + curr.commission, 0);
  const totalMagicEarn = magicStats.reduce((acc, curr) => acc + curr.commission, 0);

  const openMemberHistory = (level: number, members: any[], title: string) => {
      setSelectedLevelData({ level, members, title });
      setShowMemberModal(true);
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto min-h-screen pb-32">
        <div className="mb-10 flex justify-between items-end">
            <div>
                <h1 className="text-3xl md:text-4xl font-serif-display text-white tracking-widest uppercase mb-2">My Network</h1>
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Global Hierarchy Real-Time Tracker</p>
            </div>
            <div className="hidden md:block text-right">
                <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mb-1">Active Sync</p>
                <div className="flex items-center gap-2 justify-end">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-white font-mono text-xs font-bold uppercase">SECURED</span>
                </div>
            </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-zinc-900/50 p-1.5 rounded-[1.5rem] border border-zinc-800 mb-8 overflow-hidden">
            <button 
                onClick={() => setActiveTab('NETWORK')}
                className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'NETWORK' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
                <Network size={16} /> My Team
            </button>
            <button 
                onClick={() => setActiveTab('MAGIC')}
                className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'MAGIC' ? 'bg-amber-600 text-black shadow-lg shadow-amber-900/20' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
                <Sparkles size={16} /> Magic Matrix
            </button>
            {(role === UserRole.ADMIN || role === UserRole.MANAGER) && (
                <button 
                    onClick={() => setActiveTab('STAFF')}
                    className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'STAFF' ? 'bg-zinc-100 text-black shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                    <Users size={16} /> Staff List
                </button>
            )}
        </div>

        {activeTab === 'NETWORK' && (
            <div className="space-y-6 animate-in fade-in duration-500">
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden mb-8 border border-white/10">
                    <div className="absolute top-0 right-0 p-8 opacity-10"><Network size={120} /></div>
                    <p className="text-[10px] text-white/60 uppercase font-black tracking-[0.4em] mb-2">Network Payout (10L)</p>
                    <h2 className="text-5xl font-serif-display font-black text-white">₹{totalNetworkEarn.toFixed(5)}</h2>
                    <div className="mt-8 flex items-center gap-6">
                        <div className="bg-black/20 px-5 py-2.5 rounded-full border border-white/10 flex items-center gap-3">
                            <Users size={16} className="text-white" />
                            <span className="text-[11px] font-black text-white uppercase tracking-widest">{myNetwork.length} TOTAL TEAM MEMBERS</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {networkStats.map(stat => (
                        <LevelCard 
                            key={stat.level} 
                            level={stat.level} 
                            members={stat.members} 
                            commission={stat.commission}
                            colorClass="text-blue-500 border-blue-500/30"
                            onClick={(lvl: any, m: any) => openMemberHistory(lvl, m, 'Team')}
                        />
                    ))}
                </div>
            </div>
        )}

        {activeTab === 'MAGIC' && (
            <div className="space-y-6 animate-in fade-in duration-500">
                <div className="bg-gradient-to-br from-amber-500 to-amber-700 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden mb-8 border border-black/10">
                    <div className="absolute top-0 right-0 p-8 opacity-10"><Sparkles size={120} /></div>
                    <p className="text-[10px] text-black/60 uppercase font-black tracking-[0.4em] mb-2">Magic Matrix Binary Pool (2^n)</p>
                    <h2 className="text-5xl font-serif-display font-black text-black">₹{totalMagicEarn.toFixed(5)}</h2>
                    <div className="mt-8 flex items-center gap-6">
                        <div className="bg-black/10 px-5 py-2.5 rounded-full border border-black/10 flex items-center gap-3">
                            <Trophy size={16} className="text-black" />
                            <span className="text-[11px] font-black text-black uppercase tracking-widest">{myMagicTree.length} ACTIVE POSITIONS</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {magicStats.map(stat => (
                        <LevelCard 
                            key={stat.level} 
                            level={stat.level} 
                            members={stat.members} 
                            commission={stat.commission}
                            colorClass="text-amber-500 border-amber-500/30"
                            onClick={(lvl: any, m: any) => openMemberHistory(lvl, m, 'Magic')}
                            maxExpected={stat.binaryCap}
                        />
                    ))}
                </div>
            </div>
        )}

        {activeTab === 'STAFF' && (
            <div className="space-y-4 animate-in fade-in duration-500">
                <div className="relative mb-8">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600" size={24} />
                    <input 
                        type="text" 
                        placeholder="Search Staff Members..." 
                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-3xl py-6 pl-16 pr-8 text-white outline-none focus:border-zinc-500 shadow-xl"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>

                {systemUsers.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.id.toLowerCase().includes(searchQuery.toLowerCase())).map(user => (
                    <div key={user.id} className="bg-zinc-900/30 border border-zinc-800/50 rounded-[2rem] p-6 flex items-center justify-between group hover:bg-zinc-800/50 transition-all">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center font-serif-display text-2xl text-zinc-600 group-hover:text-amber-500 transition-colors">
                                {user.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white uppercase tracking-wide">{user.name}</h3>
                                <p className="text-[11px] text-zinc-500 uppercase font-black tracking-widest mt-1">{user.role} • <span className="text-amber-500/70 font-mono">{user.id}</span></p>
                                <div className="mt-3 flex gap-2">
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${user.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                                        {user.status}
                                    </span>
                                    <span className="px-3 py-1 bg-zinc-800/50 text-zinc-500 rounded-full text-[9px] font-black uppercase border border-zinc-700/50">
                                        M: {user.mobile}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {/* Updated Edit Button with logic */}
                            <button onClick={() => setEditingUser(user)} className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl text-zinc-500 hover:text-white transition-all active:scale-95 shadow-lg">
                                <Edit2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}

        <div className="mt-16 p-8 bg-zinc-900/20 border border-dashed border-zinc-800 rounded-[3rem] flex items-start gap-6">
            <div className="p-3 bg-zinc-800 rounded-2xl text-zinc-500"><Info size={24} /></div>
            <div>
                <h4 className="text-zinc-400 font-bold text-base uppercase tracking-widest mb-2">Hierarchy Guidelines</h4>
                <div className="space-y-2">
                    <p className="text-[10px] text-zinc-600 leading-relaxed uppercase tracking-[0.15em] font-black">
                        1. <span className="text-zinc-400">MAGIC MATRIX:</span> Works on a 2^n binary structure. Income is distributed based on level occupancy.
                    </p>
                    <p className="text-[10px] text-zinc-600 leading-relaxed uppercase tracking-[0.15em] font-black">
                        2. <span className="text-zinc-400">PAYOUT:</span> Income is released to the PREVIOUS worker once the CURRENT worker accepts the order stage.
                    </p>
                    <p className="text-[10px] text-zinc-600 leading-relaxed uppercase tracking-[0.15em] font-black">
                        3. <span className="text-zinc-400">SYNC:</span> All commission wallets update instantly across all uplines.
                    </p>
                </div>
            </div>
        </div>

        {/* Detail Modal */}
        <LevelMembersModal 
            isOpen={showMemberModal} 
            onClose={() => setShowMemberModal(false)}
            level={selectedLevelData.level}
            members={selectedLevelData.members}
            title={selectedLevelData.title}
        />
        
        {/* Edit Staff Modal */}
        <EditStaffModal 
            isOpen={!!editingUser}
            onClose={() => setEditingUser(null)}
            user={editingUser}
        />
    </div>
  );
};

export default MyTeamPage;
