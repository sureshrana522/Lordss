
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Box, 
  CheckCircle2, 
  Clock, 
  Truck, 
  IndianRupee, 
  Send,
  User,
  ArrowRight,
  AlertTriangle,
  Scissors
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OrderStage, Order } from '../types';

interface WorkflowProps {
  title: string;
  stageFilter: OrderStage;
  nextStage: OrderStage;
  payPerItem: number;
  allowedTypes?: string[]; // Prop to filter specific garments (e.g. ['Shirt', 'Kurta'])
}

const WorkflowPage = ({ title, stageFilter, nextStage, payPerItem, allowedTypes }: WorkflowProps) => {
  const { orders, moveOrder, currentUser, stats, systemUsers, addFrequentWorker } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Handover Modal State
  const [showHandoverModal, setShowHandoverModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedWorker, setSelectedWorker] = useState<any>(null);
  const [otpInput, setOtpInput] = useState('');
  
  // Stats for the header
  const myEarnings = stats.todaysWallet; // Simplified for demo
  const pendingCount = orders.filter(o => 
      o.stage === stageFilter && 
      o.folder === 'Inbox' && 
      o.assignedWorker === currentUser?.name &&
      (!allowedTypes || allowedTypes.includes(o.type))
  ).length;

  // Filter Orders Logic
  const filteredOrders = useMemo(() => {
      return orders.filter(order => {
          // 1. Must be assigned to current user
          const isAssigned = order.assignedWorker === currentUser?.name;
          // 2. Must be in the correct Inbox/Stage
          const isCorrectStage = order.stage === stageFilter;
          const isInbox = order.folder === 'Inbox' && order.handoverStatus === 'Accepted'; // Only accepted orders are actionable
          
          // 3. Must match the specific Types (e.g. Shirt Maker only sees Shirts)
          let typeMatch = true;
          if (allowedTypes && allowedTypes.length > 0) {
              typeMatch = allowedTypes.includes(order.type);
          }

          // 4. Search Filter
          const searchMatch = !searchQuery || 
              order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
              order.billNumber.toLowerCase().includes(searchQuery.toLowerCase());

          return isAssigned && isCorrectStage && isInbox && typeMatch && searchMatch;
      });
  }, [orders, currentUser, stageFilter, allowedTypes, searchQuery]);

  const handleProcess = (order: Order) => {
      setSelectedOrder(order);
      setSelectedWorker(null);
      setOtpInput('');
      setShowHandoverModal(true);
  };

  const confirmProcess = () => {
      if (!selectedOrder) return;

      // Determine next worker role based on nextStage
      // Logic: For Sewing -> Finishing, or Finishing -> Press
      
      // Since this is a specialized panel, we simply move it to the 'nextStage' 
      // and assign it to a worker of that role.
      
      // For Demo: We assume the user selects the next worker from a list or it goes to a pool.
      // Here we simulate sending to a specific next worker.
      
      if (!selectedWorker) {
          alert("Please select the next worker.");
          return;
      }

      // Add to frequent contacts
      addFrequentWorker(selectedWorker.id);

      // Perform Move
      moveOrder(selectedOrder.id, 'Inbox', selectedWorker.name, nextStage);
      
      setShowHandoverModal(false);
      setSelectedOrder(null);
  };

  // Filter Potential Next Workers
  const nextWorkers = useMemo(() => {
      let targetRole = '';
      if (nextStage === OrderStage.SEWING) targetRole = 'Sewing'; // Should filter by garment type in real app
      else if (nextStage === OrderStage.FINISHING) targetRole = 'Finishing';
      else if (nextStage === OrderStage.PRESS) targetRole = 'Press';
      else if (nextStage === OrderStage.READY) targetRole = 'Delivery';
      else if (nextStage === OrderStage.CUTTING) targetRole = 'Cutting';
      else if (nextStage === OrderStage.MEASUREMENT) targetRole = 'Measurement';
      else if (nextStage === OrderStage.DELIVERED) targetRole = 'Delivery';

      return systemUsers.filter(u => u.role.includes(targetRole) || u.role === 'Admin'); // Simplified match
  }, [systemUsers, nextStage]);

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto min-h-screen pb-24">
       
       {/* Header */}
       <div className="flex items-center justify-between mb-6">
          <div>
             <h1 className="text-2xl font-serif-display text-white mb-1">{title} Panel</h1>
             <p className="text-zinc-500 text-xs uppercase tracking-widest">Rate: ₹{payPerItem} / Piece</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl text-right">
             <p className="text-[10px] text-zinc-500 uppercase font-bold">Today's Earn</p>
             <p className="text-xl font-mono font-bold text-emerald-500">₹{myEarnings.toLocaleString()}</p>
          </div>
       </div>

       {/* Stats Cards */}
       <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center gap-3">
             <div className="p-3 bg-amber-500/10 rounded-full text-amber-500 border border-amber-500/20">
                <Scissors size={20} />
             </div>
             <div>
                <p className="text-2xl font-bold text-white">{pendingCount}</p>
                <p className="text-[10px] text-zinc-500 uppercase font-bold">Pending Jobs</p>
             </div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center gap-3">
             <div className="p-3 bg-blue-500/10 rounded-full text-blue-500 border border-blue-500/20">
                <CheckCircle2 size={20} />
             </div>
             <div>
                <p className="text-2xl font-bold text-white">{stats.todaysWallet / payPerItem}</p>
                <p className="text-[10px] text-zinc-500 uppercase font-bold">Completed Today</p>
             </div>
          </div>
       </div>

       {/* Search */}
       <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
          <input 
             type="text" 
             placeholder="Search Bill No or Customer..." 
             className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-white outline-none focus:border-amber-500"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
          />
       </div>

       {/* Order List */}
       <div className="space-y-4">
          {filteredOrders.length > 0 ? (
             filteredOrders.map(order => (
                <div key={order.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group hover:border-zinc-700 transition-all">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-black border border-zinc-800 flex items-center justify-center font-bold text-lg text-zinc-400">
                         {order.type.charAt(0)}
                      </div>
                      <div>
                         <h3 className="font-bold text-white text-lg flex items-center gap-2">
                            {order.type} 
                            <span className="text-xs bg-zinc-800 px-2 py-0.5 rounded text-zinc-400 font-mono">{order.billNumber}</span>
                         </h3>
                         <p className="text-sm text-zinc-400">{order.customerName}</p>
                         {order.measurements?.isUrgent && (
                            <span className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1 animate-pulse">
                               <AlertTriangle size={10} /> URGENT ORDER
                            </span>
                         )}
                         <div className="flex gap-2 mt-2">
                            {order.measurements?.deliveryDate && (
                                <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-1 rounded flex items-center gap-1">
                                    <Clock size={10} /> Due: {order.measurements.deliveryDate}
                                </span>
                            )}
                         </div>
                      </div>
                   </div>

                   <button 
                      onClick={() => handleProcess(order)}
                      className="w-full md:w-auto bg-amber-600 hover:bg-amber-500 text-black font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 uppercase tracking-widest transition-all shadow-lg shadow-amber-900/20 active:scale-95"
                   >
                      Complete & Send <ArrowRight size={16} />
                   </button>
                </div>
             ))
          ) : (
             <div className="text-center py-16 border-2 border-dashed border-zinc-800 rounded-2xl bg-zinc-900/50">
                <Box size={48} className="mx-auto text-zinc-700 mb-4" />
                <h3 className="text-xl font-bold text-zinc-500">No Pending Work</h3>
                <p className="text-xs text-zinc-600 mt-2">You have completed all assigned tasks.</p>
             </div>
          )}
       </div>

       {/* Handover Modal */}
       {showHandoverModal && selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
             <div className="bg-zinc-900 border border-zinc-800 w-full max-w-sm rounded-2xl p-6 shadow-2xl relative">
                <h3 className="text-xl font-serif-display text-white mb-1">Pass to Next Stage</h3>
                <p className="text-xs text-zinc-500 uppercase tracking-widest mb-6">Target: {nextStage}</p>

                <div className="space-y-4 mb-6">
                   <div>
                      <label className="text-xs text-zinc-500 uppercase font-bold block mb-2">Select Worker</label>
                      <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                         {nextWorkers.map(worker => (
                            <button 
                               key={worker.id}
                               onClick={() => setSelectedWorker(worker)}
                               className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${selectedWorker?.id === worker.id ? 'bg-emerald-500/20 border-emerald-500 text-white' : 'bg-black border-zinc-800 text-zinc-400 hover:bg-zinc-800'}`}
                            >
                               <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center font-bold text-xs">{worker.name.charAt(0)}</div>
                               <div className="text-left">
                                  <p className="text-sm font-bold">{worker.name}</p>
                                  <p className="text-[10px] text-zinc-500 uppercase">{worker.role}</p>
                               </div>
                               {selectedWorker?.id === worker.id && <CheckCircle2 size={16} className="ml-auto text-emerald-500" />}
                            </button>
                         ))}
                         {nextWorkers.length === 0 && <p className="text-xs text-zinc-500 text-center py-2">No active workers found for {nextStage}</p>}
                      </div>
                   </div>
                </div>

                <div className="flex gap-3">
                   <button onClick={() => setShowHandoverModal(false)} className="flex-1 py-3 bg-zinc-800 text-white rounded-xl font-bold text-sm hover:bg-zinc-700">Cancel</button>
                   <button 
                      onClick={confirmProcess} 
                      disabled={!selectedWorker}
                      className={`flex-1 py-3 font-bold text-sm rounded-xl flex items-center justify-center gap-2 ${selectedWorker ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg' : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'}`}
                   >
                      <Send size={16} /> Confirm
                   </button>
                </div>
             </div>
          </div>
       )}

    </div>
  );
};

export default WorkflowPage;
