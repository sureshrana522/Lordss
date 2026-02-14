
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  AlertTriangle, 
  Package, 
  Box, 
  Layers, 
  Search, 
  ArrowUpRight, 
  ArrowDownRight,
  FileText,
  Plus,
  Wallet,
  Trophy,
  ArrowRight,
  X,
  History,
  Hash,
  User,
  Save
} from 'lucide-react';
import { Material } from '../types';

// History Modal Component
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
                                    <div className={`font-mono font-bold text-sm ${tx.type === 'Credit' ? 'text-emerald-500' : tx.type === 'Debit' ? 'text-red-500' : 'text-white'}`}>
                                        {tx.type === 'Credit' ? '+' : tx.type === 'Debit' ? '-' : ''}
                                        {typeof tx.amount === 'number' ? `₹${tx.amount}` : tx.amount}
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

// Add Item Modal
const AddItemModal = ({ onClose, onSave }: any) => {
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState('Pcs');
    const [minLevel, setMinLevel] = useState('');

    const handleSubmit = () => {
        if (!name || !quantity) return alert("Please fill Name and Quantity");
        
        const newItem: Material = {
            id: `MAT-${Date.now()}`,
            name,
            quantity: parseInt(quantity),
            unit,
            minLevel: parseInt(minLevel) || 5
        };
        onSave(newItem);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-zinc-900 border border-zinc-800 w-full max-w-sm rounded-2xl shadow-2xl p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white"><X size={20}/></button>
                <h3 className="text-xl font-serif-display text-white mb-6">Add New Inventory</h3>
                
                <div className="space-y-4">
                    <div>
                        <label className="text-xs text-zinc-500 uppercase font-bold block mb-1">Item Name</label>
                        <input type="text" className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:border-yellow-500 outline-none" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Buttons, Thread" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-zinc-500 uppercase font-bold block mb-1">Quantity</label>
                            <input type="number" className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:border-yellow-500 outline-none" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="0" />
                        </div>
                        <div>
                            <label className="text-xs text-zinc-500 uppercase font-bold block mb-1">Unit</label>
                            <select className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:border-yellow-500 outline-none" value={unit} onChange={e => setUnit(e.target.value)}>
                                <option value="Pcs">Pcs</option>
                                <option value="Meters">Meters</option>
                                <option value="Box">Box</option>
                                <option value="Kg">Kg</option>
                                <option value="Roll">Roll</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="text-xs text-zinc-500 uppercase font-bold block mb-1">Min Alert Level</label>
                        <input type="number" className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:border-yellow-500 outline-none" value={minLevel} onChange={e => setMinLevel(e.target.value)} placeholder="5" />
                        <p className="text-[10px] text-zinc-600 mt-1">System will alert when stock falls below this.</p>
                    </div>
                </div>

                <div className="mt-6 flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 bg-zinc-800 rounded-lg text-zinc-400 font-bold hover:bg-zinc-700">Cancel</button>
                    <button onClick={handleSubmit} className="flex-1 py-3 bg-yellow-600 hover:bg-yellow-500 text-black font-bold rounded-lg shadow-lg flex items-center justify-center gap-2">
                        <Save size={18} /> Save Item
                    </button>
                </div>
            </div>
        </div>
    );
};

// Reusing WalletCard with Click Handler
const WalletCard = ({ 
  title, 
  amount, 
  icon: Icon, 
  bonusLabel, 
  colorClass, 
  bgClass, 
  borderColor, 
  arrowType,
  onViewHistory
}: any) => {
  return (
    <div className={`relative bg-zinc-900 border ${borderColor} rounded-xl p-3 overflow-hidden group`}>
      <div className={`absolute top-0 right-0 w-24 h-24 ${bgClass} rounded-full blur-3xl -mr-12 -mt-12 opacity-20`}></div>
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
          {typeof amount === 'number' ? `₹${amount.toLocaleString()}` : amount}
        </h3>
      </div>
      <button 
        onClick={onViewHistory}
        className="w-full mt-3 pt-3 border-t border-zinc-800 flex items-center justify-between group-hover:px-1 transition-all cursor-pointer hover:bg-white/5 rounded-b-lg"
      >
        <span className={`text-[10px] ${colorClass} font-medium`}>View History</span>
        <ArrowRight size={12} className={`text-zinc-600 group-hover:${colorClass} transition-colors`} />
      </button>
    </div>
  );
};

const Materials = () => {
  const { materials, stats, getWalletHistory, addMaterial } = useApp();

  // History State
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [historyTitle, setHistoryTitle] = useState('');
  const [historyData, setHistoryData] = useState<any[]>([]);
  
  // Add Item State
  const [showAddModal, setShowAddModal] = useState(false);

  const handleOpenHistory = (type: string) => {
      let data: any[] = [];
      let title = type;

      if (type === 'Low Stock') {
          data = materials.filter(m => m.quantity <= m.minLevel).map(m => ({
              id: m.id,
              description: m.name,
              date: `Min Level: ${m.minLevel} ${m.unit}`,
              amount: m.quantity, // Display current quantity
              type: 'Debit', // Red for alert
              relatedUser: 'Critical'
          }));
      } else if (type === 'Total SKUs') {
          data = materials.map(m => ({
              id: m.id,
              description: m.name,
              date: `Unit: ${m.unit}`,
              amount: m.quantity,
              type: 'Credit',
              relatedUser: 'Inventory'
          }));
      } else if (type === 'Total Value') {
          data = materials.map(m => ({
              id: m.id,
              description: m.name,
              date: `Qty: ${m.quantity}`,
              amount: m.quantity * 150, // Mock price
              type: 'Credit',
              relatedUser: 'Stock Value'
          }));
      } else if (type === 'Budget Use') {
          // Show recent expenses from Booking Wallet
          title = 'Budget / Expenses';
          data = getWalletHistory('Booking').filter(t => t.type === 'Debit');
      } else {
          data = getWalletHistory(type);
      }

      setHistoryTitle(title);
      setHistoryData(data);
      setHistoryModalOpen(true);
  };

  const handleSaveMaterial = (item: Material) => {
      addMaterial(item);
      setShowAddModal(false);
  };

  // Stats
  const totalItems = materials.length;
  const lowStockItems = materials.filter(m => m.quantity <= m.minLevel).length;
  const totalValue = materials.reduce((acc, curr) => acc + (curr.quantity * 150), 0); 
  const budgetUtilization = 65; // Mock

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl md:text-4xl font-serif-display text-white">Manager Panel</h1>
          <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded text-xs uppercase tracking-wider font-bold">
            Authorized Panel
          </span>
        </div>
        <p className="text-zinc-400">Welcome back, track stock levels, inventory value and orders.</p>
      </div>

       {/* Search Bar */}
      <div className="relative mb-8 group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="text-zinc-500 group-focus-within:text-yellow-500 transition-colors" size={20} />
        </div>
        <input 
          type="text" 
          placeholder="Search Items, SKU or Category..." 
          className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 text-sm rounded-lg focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 block w-full pl-12 p-4 transition-all outline-none"
        />
      </div>

      {/* Action Buttons (Updated to Match Admin: Orders, Add Funds, New Bill) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Link to="/orders" className="flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-200 py-4 px-6 rounded-lg transition-all font-medium">
          <FileText size={20} className="text-blue-400" />
          <span>Orders</span>
        </Link>
        <button className="flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 text-black py-4 px-6 rounded-lg transition-all font-bold shadow-lg shadow-amber-900/20">
          <Plus size={20} />
          <span>Add Funds</span>
        </button>
        <Link to="/new-order" className="col-span-2 md:col-span-2 flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-200 py-4 px-6 rounded-lg transition-all font-medium">
          <FileText size={20} className="text-green-400" />
          <span>New Bill</span>
        </Link>
      </div>

      {/* Stats Grid - Full Admin Layout */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
        <WalletCard 
          title="Booking Wallet" 
          amount={stats.bookingWallet} 
          icon={Wallet} 
          colorClass="text-emerald-400" 
          bgClass="bg-emerald-500" 
          borderColor="border-emerald-900/30" 
          bonusLabel="Fund" 
          arrowType="up"
          onViewHistory={() => handleOpenHistory('Booking')}
        />
        <WalletCard 
          title="Upline Wallet" 
          amount={stats.uplineWallet} 
          icon={ArrowUpRight} 
          colorClass="text-blue-400" 
          bgClass="bg-blue-500" 
          borderColor="border-blue-900/30" 
          bonusLabel="Direct" 
          arrowType="up" 
          onViewHistory={() => handleOpenHistory('Upline')}
        />
        <WalletCard 
          title="Downline Wallet" 
          amount={stats.downlineWallet} 
          icon={ArrowDownRight} 
          colorClass="text-purple-400" 
          bgClass="bg-purple-500" 
          borderColor="border-purple-900/30" 
          bonusLabel="Team" 
          arrowType="down" 
          onViewHistory={() => handleOpenHistory('Downline')}
        />
         <WalletCard 
          title="Total Value" 
          amount={totalValue} 
          icon={Layers} 
          colorClass="text-yellow-400" 
          bgClass="bg-yellow-500" 
          borderColor="border-yellow-900/30" 
          arrowType="up" 
          bonusLabel="Stock" 
          onViewHistory={() => handleOpenHistory('Total Value')}
        />
        <WalletCard 
          title="Performance" 
          amount={stats.performanceWallet} 
          icon={Trophy} 
          colorClass="text-cyan-400" 
          bgClass="bg-cyan-500" 
          borderColor="border-cyan-900/30" 
          bonusLabel="Bonus" 
          arrowType="up" 
          onViewHistory={() => handleOpenHistory('Performance')}
        />
        <WalletCard 
          title="Budget Use" 
          amount={`${budgetUtilization}%`} 
          icon={Box} 
          colorClass="text-zinc-400" 
          bgClass="bg-zinc-500" 
          borderColor="border-zinc-800" 
          bonusLabel="Limit" 
          onViewHistory={() => handleOpenHistory('Budget Use')} 
        />
        <WalletCard 
          title="Low Stock" 
          amount={lowStockItems} 
          icon={AlertTriangle} 
          colorClass="text-red-400" 
          bgClass="bg-red-500" 
          borderColor="border-red-900/30" 
          arrowType="down" 
          bonusLabel="Critical" 
          onViewHistory={() => handleOpenHistory('Low Stock')}
        />
        <WalletCard 
          title="Total SKUs" 
          amount={totalItems} 
          icon={Package} 
          colorClass="text-blue-400" 
          bgClass="bg-blue-500" 
          borderColor="border-blue-900/30" 
          bonusLabel="Count" 
          onViewHistory={() => handleOpenHistory('Total SKUs')}
        />
        
        <div className="col-span-2 md:col-span-1">
           <WalletCard 
            title="Total Expense" 
            amount={stats.revenue} 
            icon={Wallet} 
            colorClass="text-amber-400" 
            bgClass="bg-amber-600" 
            borderColor="border-amber-900/30" 
            arrowType="up" 
            bonusLabel="YTD" 
            onViewHistory={() => handleOpenHistory('Daily')}
          />
        </div>
      </div>

      <div className="border-t border-zinc-800 pt-8">
         <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2 font-serif-display">
               <Box size={24} className="text-yellow-500" />
               Current Inventory List
            </h3>
            <button 
               onClick={() => setShowAddModal(true)}
               className="text-xs bg-yellow-600 hover:bg-yellow-500 text-black font-bold px-4 py-2 rounded transition-colors uppercase tracking-wider"
            >
               + Add New Item
            </button>
         </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map(mat => (
            <div key={mat.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl flex flex-col justify-between hover:border-yellow-500/30 transition-all group shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-zinc-200 group-hover:text-white transition-colors">{mat.name}</h3>
                  <p className="text-zinc-500 text-xs uppercase tracking-wider font-mono mt-1">SKU: {mat.id}</p>
                </div>
                {mat.quantity <= mat.minLevel && (
                  <div className="bg-red-500/10 p-2 rounded-lg animate-pulse border border-red-500/20">
                     <AlertTriangle className="text-red-500" size={18} />
                  </div>
                )}
              </div>

              <div className="mb-6">
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-zinc-400 uppercase">Stock Level</span>
                  <span className="text-zinc-100 font-mono">{mat.quantity} <span className="text-zinc-500">{mat.unit}</span></span>
                </div>
                <div className="w-full bg-black rounded-full h-2 border border-zinc-800 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${mat.quantity < mat.minLevel ? 'bg-red-500' : 'bg-yellow-500'}`} 
                    style={{ width: `${Math.min(100, (mat.quantity / (mat.minLevel * 3)) * 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex gap-3">
                 <button className="flex-1 py-3 border border-zinc-700 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors text-xs font-bold uppercase tracking-wider">
                    Edit Details
                 </button>
                 <button className="flex-1 py-3 bg-zinc-100 hover:bg-white text-black rounded-lg transition-colors text-xs font-bold uppercase tracking-wider shadow-lg">
                    Order More
                 </button>
              </div>
            </div>
          ))}
          {materials.length === 0 && (
              <p className="col-span-full text-center text-zinc-500 italic py-12">No materials in inventory. Add stock to begin.</p>
          )}
        </div>
      </div>

      <HistoryModal title={historyTitle} isOpen={historyModalOpen} onClose={() => setHistoryModalOpen(false)} data={historyData} />
      {showAddModal && <AddItemModal onClose={() => setShowAddModal(false)} onSave={handleSaveMaterial} />}
    </div>
  );
};

export default Materials;
