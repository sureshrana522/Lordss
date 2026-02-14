
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  Search, 
  ArrowUpRight, 
  ArrowDownRight, 
  FileText, 
  Plus, 
  Calendar, 
  Trophy, 
  Sparkles, 
  ArrowRight, 
  PlusCircle, 
  Scissors, 
  X, 
  History, 
  Hash, 
  User, 
  Wallet 
} from 'lucide-react';

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
                                        {typeof tx.amount === 'number' ? `₹${tx.amount.toLocaleString()}` : tx.amount}
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

const ShowroomEntry = () => {
  const { customers, orders, stats, getWalletHistory } = useApp();

  // History State
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [historyTitle, setHistoryTitle] = useState('');
  const [historyData, setHistoryData] = useState<any[]>([]);

  const handleOpenHistory = (type: string) => {
      let data: any[] = [];
      let title = type;

      if (type === 'Total Clients') {
          data = customers.map(c => ({
              id: c.id, 
              description: c.name, 
              date: `Bill: ${c.billNumber}`, 
              amount: 0, 
              type: 'Credit', 
              relatedUser: c.mobile
          }));
      } else if (type === 'Total Orders') {
          data = orders.map(o => ({
              id: o.id, 
              description: `${o.type} - ${o.customerName}`, 
              date: o.createdAt, 
              amount: o.price, 
              type: 'Credit', 
              relatedUser: o.billNumber
          }));
      } else {
          data = getWalletHistory(type);
      }

      setHistoryTitle(title);
      setHistoryData(data);
      setHistoryModalOpen(true);
  };

  // Stats Logic
  const totalOrders = orders.length;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const vipCustomers = customers.filter(c => c.isVIP).length;
  const totalRevenue = orders.reduce((acc, curr) => acc + curr.price, 0);
  
  const myCommission = stats.todaysWallet; 
  const networkBonus = stats.performanceWallet; 

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl md:text-4xl font-serif-display text-white">Showroom</h1>
          <span className="px-3 py-1 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded text-xs uppercase tracking-wider font-bold">
            Authorized Panel
          </span>
        </div>
        <p className="text-zinc-400">Welcome back, track your sales, earnings and wallet distribution.</p>
      </div>

       {/* Search Bar */}
      <div className="relative mb-8 group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="text-zinc-500 group-focus-within:text-blue-500 transition-colors" size={20} />
        </div>
        <input 
          type="text" 
          placeholder="Search Customer or Bill No..." 
          className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 text-sm rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 block w-full pl-12 p-4 transition-all outline-none"
        />
      </div>

       {/* Action Buttons */}
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

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
        <WalletCard 
          title="Booking Wallet" 
          amount={stats.bookingWallet} 
          icon={Scissors} 
          colorClass="text-emerald-400" 
          bgClass="bg-emerald-500" 
          borderColor="border-emerald-900/30" 
          bonusLabel="Credits" 
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
          title="Today's Wallet" 
          amount={myCommission} 
          icon={Calendar} 
          colorClass="text-amber-400" 
          bgClass="bg-amber-500"
          borderColor="border-amber-900/30"
          bonusLabel="Sales"
          arrowType="up"
          onViewHistory={() => handleOpenHistory('Daily')}
        />
         <WalletCard 
          title="Performance" 
          amount={networkBonus} 
          icon={Trophy} 
          colorClass="text-zinc-500" 
          bgClass="bg-zinc-800"
          borderColor="border-zinc-800"
          bonusLabel="Pending"
          arrowType="up"
          onViewHistory={() => handleOpenHistory('Performance')}
        />
        <WalletCard 
          title="Magic Income" 
          amount={stats.magicIncome} 
          icon={Sparkles} 
          colorClass="text-pink-400" 
          bgClass="bg-pink-500"
          borderColor="border-pink-900/30"
          bonusLabel="Auto"
          arrowType="up"
          onViewHistory={() => handleOpenHistory('Magic')}
        />
         <WalletCard 
          title="Total Clients" 
          amount={customers.length} 
          icon={Users} 
          colorClass="text-emerald-400" 
          bgClass="bg-emerald-500"
          borderColor="border-emerald-900/30"
          bonusLabel="Active"
          onViewHistory={() => handleOpenHistory('Total Clients')}
        />
         <WalletCard 
          title="Total Orders" 
          amount={totalOrders} 
          icon={ShoppingBag} 
          colorClass="text-orange-400" 
          bgClass="bg-orange-500"
          borderColor="border-orange-900/30"
          bonusLabel="All"
          onViewHistory={() => handleOpenHistory('Total Orders')}
        />
        
        <div className="col-span-2 md:col-span-1">
           <WalletCard 
            title="Total Revenue" 
            amount={totalRevenue} 
            icon={TrendingUp} 
            colorClass="text-yellow-400" 
            bgClass="bg-yellow-600"
            borderColor="border-yellow-900/30"
            arrowType="up"
            bonusLabel="Gross"
            onViewHistory={() => handleOpenHistory('Daily')}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 flex flex-col justify-center items-center text-center">
            <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mb-4">
               <PlusCircle size={32} className="text-amber-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Create New Booking</h2>
            <p className="text-zinc-500 mb-6 max-w-sm">Start a new bespoke order with customer details, measurements, and garment selection.</p>
            <Link to="/new-order" className="bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 px-8 rounded-lg shadow-lg shadow-amber-900/20 transition-all active:scale-95">
               Start Booking
            </Link>
        </div>

        {/* Recent Customers Sidebar */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 h-fit">
           <div className="flex items-center gap-2 mb-6">
              <Users size={20} className="text-zinc-500" />
              <h3 className="text-lg font-bold text-white">Recent Entries</h3>
           </div>
           
           <div className="space-y-4">
              {customers.slice(-5).reverse().map((customer) => (
                 <div key={customer.id} className="flex items-center gap-3 pb-3 border-b border-zinc-800 last:border-0 hover:bg-zinc-800/50 p-2 rounded transition-colors cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-400">
                       {customer.name.substring(0,2).toUpperCase()}
                    </div>
                    <div>
                       <h4 className="text-sm font-bold text-zinc-200">{customer.name}</h4>
                       <p className="text-xs text-zinc-500">{customer.billNumber}</p>
                       {customer.address && <p className="text-[10px] text-zinc-600 truncate max-w-[150px]">{customer.address}</p>}
                    </div>
                 </div>
              ))}
              {customers.length === 0 && (
                  <p className="text-center text-zinc-500 text-xs italic py-4">No customers found.</p>
              )}
           </div>
        </div>
      </div>

      <HistoryModal title={historyTitle} isOpen={historyModalOpen} onClose={() => setHistoryModalOpen(false)} data={historyData} />
    </div>
  );
};

export default ShowroomEntry;
