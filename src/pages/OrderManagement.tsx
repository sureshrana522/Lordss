
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, Filter, Box, Inbox, Clock, Layers, CheckCircle2, Calendar,
  X, Bookmark, Trash2, Save, Send, RotateCcw, ThumbsUp, Lock, PenTool,
  Ruler, Edit3, Eye, Scissors, Shirt, ArrowRight, IndianRupee, Truck,
  Plus, Star, AlertTriangle, Ban, Wallet, Key, Zap, User, Check,
  Printer, MessageCircle, Phone, Layout, Copy, RefreshCw
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { OrderStage, Order, MeasurementData, UserRole } from '../types';

// --- VISUAL BODY COMPONENT ---
const BodyVisualizer = ({ onPartClick, activePart, isReadOnly }: { onPartClick: (part: string) => void, activePart: string | null, isReadOnly: boolean }) => {
    const Point = ({ cx, cy, label, id }: any) => (
        <g onClick={() => !isReadOnly && onPartClick(id)} className={`${isReadOnly ? 'cursor-default' : 'cursor-pointer'} group`}>
            <circle cx={cx} cy={cy} r="6" className={`${activePart === id ? 'fill-amber-500 stroke-amber-300' : 'fill-zinc-900 stroke-zinc-500 group-hover:stroke-amber-500'} stroke-2 transition-all`} />
            <circle cx={cx} cy={cy} r="12" className={`${activePart === id ? 'animate-ping opacity-75 stroke-amber-500' : 'opacity-0'} fill-transparent stroke-1`} />
            <text x={cx + 10} y={cy} className={`text-[8px] uppercase font-bold ${activePart === id ? 'fill-amber-500' : 'fill-zinc-600'} transition-all`} dy=".3em">{label}</text>
        </g>
    );

    return (
        <div className="relative w-full h-[400px] bg-black/50 rounded-xl border border-zinc-800 flex items-center justify-center overflow-hidden">
            <div className="absolute top-2 left-2">
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{isReadOnly ? 'Measurement Reference' : 'Interactive Body Map'}</p>
                <p className="text-[9px] text-zinc-600">{isReadOnly ? 'Viewing Mode' : 'Click points to enter data'}</p>
            </div>
            <svg viewBox="0 0 200 400" className="h-full w-auto drop-shadow-[0_0_15px_rgba(180,83,9,0.2)]">
                <path d="M100 20 C 115 20, 120 40, 115 55 L 115 65 L 85 65 L 85 55 C 80 40, 85 20, 100 20" fill="none" stroke="#333" strokeWidth="1" />
                <Point cx="100" cy="65" label="Neck" id="collar" />
                <Point cx="60" cy="75" label="Shoulder" id="shoulder" />
                <Point cx="100" cy="100" label="Chest" id="chest" />
                <Point cx="100" cy="130" label="Stomach" id="stomach" />
                <Point cx="100" cy="160" label="Waist" id="waist" />
                <Point cx="100" cy="190" label="Seat" id="seat" />
                <Point cx="140" cy="110" label="Sleeve" id="sleeve" />
                <Point cx="90" cy="280" label="Thigh" id="thigh" />
                <Point cx="90" cy="320" label="Knee" id="knee" />
                <Point cx="90" cy="380" label="Length" id="length" />
            </svg>
        </div>
    );
};

const OrderStatusCard = ({ title, value, icon: Icon, colorClass, bgClass, borderClass, onClick, isActive }: any) => (
  <div onClick={onClick} className={`flex flex-col items-center justify-center p-3 rounded-xl border ${isActive ? 'border-white ring-1 ring-white bg-opacity-20' : borderClass} ${bgClass} h-28 relative overflow-hidden group transition-all hover:scale-105 cursor-pointer active:scale-95`}>
    <div className={`mb-2 p-2 rounded-full bg-black/20 ${colorClass}`}><Icon size={20} /></div>
    <h3 className="text-xl font-bold text-white mb-0">{value}</h3>
    <p className={`text-[9px] uppercase font-bold tracking-widest text-center ${colorClass} opacity-80 leading-tight`}>{title}</p>
    {isActive && <div className="absolute bottom-0 left-0 w-full h-1 bg-white animate-pulse"></div>}
  </div>
);

const OrderManagement = () => {
  const { orders, moveOrder, confirmHandover, saveMeasurements, systemUsers, role, currentUser, customers } = useApp();
  const [activeTab, setActiveTab] = useState('Self Order');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [bannerMessage, setBannerMessage] = useState('');
  const [bannerColor, setBannerColor] = useState('bg-emerald-500');
  const [showBanner, setShowBanner] = useState(false);
  const [showHandoverModal, setShowHandoverModal] = useState(false);
  const [handoverOrderId, setHandoverOrderId] = useState<string | null>(null);
  const [selectedWorker, setSelectedWorker] = useState<any>(null);
  const [nextStage, setNextStage] = useState<OrderStage | null>(null);
  const [workerList, setWorkerList] = useState<any[]>([]);
  const [handoverTitle, setHandoverTitle] = useState('');
  const [manualIdInput, setManualIdInput] = useState(''); 
  const [otpInput, setOtpInput] = useState('');
  const [codInput, setCodInput] = useState('');
  const [showOtpError, setShowOtpError] = useState(false);
  const [showMeasurementModal, setShowMeasurementModal] = useState(false);
  const [measurementOrder, setMeasurementOrder] = useState<Order | null>(null);
  const [measurementData, setMeasurementData] = useState<MeasurementData>({});
  const [activeBodyPart, setActiveBodyPart] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const isMeasurementRole = role === UserRole.MEASUREMENT || role === UserRole.ADMIN;

  const triggerBanner = (msg: string, isError: boolean = false) => { setBannerMessage(msg); setBannerColor(isError ? 'bg-red-500' : 'bg-emerald-500'); setShowBanner(true); setTimeout(() => setShowBanner(false), 2000); };

  const handleRefresh = () => {
      setRefreshKey(prev => prev + 1);
      triggerBanner("LIST UPDATED");
  };

  const { filteredOrders, counts } = useMemo(() => {
    const tempCounts = { 'Self Order': 0, 'Inbox': 0, 'Save Box': 0, 'Return Order': 0, 'Completed': 0 };
    let tabOrders: Order[] = [];
    const lowerQuery = searchQuery.toLowerCase();
    const curUserId = currentUser?.id || '';
    const curUserName = currentUser?.name || '';

    // Sort orders by latest first
    const sortedOrders = [...orders].sort((a, b) => {
        // Sort by ID (assuming ID contains timestamp logic) or updated date if available
        return (b.id > a.id) ? 1 : -1;
    });

    sortedOrders.forEach(o => {
        // CRITICAL FIX: Logic to determine ownership and assignment
        // 1. Is Assigned: Matches ID or Name
        const isAssigned = o.assignedWorker === curUserName || o.assignedWorker === curUserId;
        
        // 2. Is Creator: Matches ID or Name (for older data support)
        const isCreator = o.creatorId === curUserId || o.createdBy === curUserName;

        // FOLDER LOGIC
        // Self: Orders in 'Self' folder AND (Created by me OR Assigned to me)
        const isSelf = o.folder === 'Self' && (isCreator || isAssigned);
        
        // Inbox: Orders assigned to me, Pending status, Inbox folder
        const isInbox = isAssigned && o.handoverStatus === 'Pending' && o.folder === 'Inbox';
        
        // Save Box: Assigned to me, Accepted status, Save folder
        const isSaveBox = isAssigned && o.handoverStatus === 'Accepted' && o.folder === 'Save';
        
        // Return: Return folder AND (Assigned to me OR I am Admin/Showroom)
        const isReturn = o.folder === 'Return' && (isAssigned || role === UserRole.ADMIN || role === UserRole.SHOWROOM);
        
        // Completed: Completed folder OR Delivered stage. Visible to Admin/Showroom OR if I worked on it.
        const isCompleted = (o.folder === 'Completed' || o.stage === OrderStage.DELIVERED) && (role === UserRole.ADMIN || role === UserRole.SHOWROOM || o.workerHistory?.includes(curUserId));

        if (isSelf) tempCounts['Self Order']++;
        if (isInbox) tempCounts['Inbox']++;
        if (isSaveBox) tempCounts['Save Box']++;
        if (isReturn) tempCounts['Return Order']++;
        if (isCompleted) tempCounts['Completed']++;

        let matchTab = false;
        if (activeTab === 'Self Order' && isSelf) matchTab = true;
        else if (activeTab === 'Inbox' && isInbox) matchTab = true;
        else if (activeTab === 'Save Box' && isSaveBox) matchTab = true;
        else if (activeTab === 'Return Order' && isReturn) matchTab = true;
        else if (activeTab === 'Completed' && isCompleted) matchTab = true;

        if (matchTab && (!searchQuery || o.customerName.toLowerCase().includes(lowerQuery) || o.billNumber.toLowerCase().includes(lowerQuery))) {
            tabOrders.push(o);
        }
    });
    return { filteredOrders: tabOrders, counts: tempCounts };
  }, [orders, activeTab, searchQuery, currentUser, role, refreshKey]);

  const initiateHandover = (e: React.MouseEvent, order: Order) => {
    e.stopPropagation();
    if (role === UserRole.MEASUREMENT && (!order.measurements || Object.keys(order.measurements).length === 0)) { triggerBanner("⚠️ TAKE MEASUREMENT FIRST", true); return; }
    
    let next: OrderStage | 'RETURN_ADMIN' = OrderStage.ORDER_PLACED;
    let roleTitle = '';
    let targetRole: UserRole | null = null;

    switch (order.stage) {
      case OrderStage.ORDER_PLACED: next = OrderStage.MEASUREMENT; roleTitle = 'Measurement'; targetRole = UserRole.MEASUREMENT; break;
      case OrderStage.MEASUREMENT: next = OrderStage.CUTTING; roleTitle = 'Cutting'; targetRole = UserRole.CUTTING; break;
      case OrderStage.CUTTING: next = OrderStage.SEWING; roleTitle = 'Stitching'; if (['Shirt', 'Kurta'].some(t => order.type.includes(t))) targetRole = UserRole.SHIRT_MAKER; else if (['Pant', 'Trouser'].some(t => order.type.includes(t))) targetRole = UserRole.PANT_MAKER; else targetRole = UserRole.COAT_MAKER; break;
      case OrderStage.SEWING: next = OrderStage.FINISHING; roleTitle = 'Kaaj Maker'; targetRole = UserRole.FINISHING; break;
      case OrderStage.FINISHING: next = OrderStage.PRESS; roleTitle = 'Paresh Paresh'; targetRole = UserRole.PRESS; break;
      case OrderStage.PRESS: next = OrderStage.READY; roleTitle = 'Delivery logistics'; targetRole = UserRole.DELIVERY; break;
      case OrderStage.READY: next = 'RETURN_ADMIN' as any; roleTitle = `Bill Creator (Admin)`; targetRole = UserRole.ADMIN; break;
      default: next = OrderStage.ORDER_PLACED; roleTitle = 'Support'; targetRole = UserRole.ADMIN;
    }

    setNextStage(next as any);
    let workers = systemUsers.filter(u => u.role === targetRole);
    if (targetRole === UserRole.ADMIN && order.creatorId) {
        const creator = systemUsers.find(u => u.id === order.creatorId);
        if (creator) workers = [creator];
    }

    setWorkerList(workers); setHandoverTitle(roleTitle); setHandoverOrderId(order.id); setSelectedWorker(null); setOtpInput(''); setManualIdInput(''); setCodInput(''); setShowOtpError(false); setShowHandoverModal(true);
  };

  const handleManualSearch = () => {
      if (!manualIdInput) return;
      const found = systemUsers.find(u => u.id.toLowerCase() === manualIdInput.toLowerCase());
      if (found) {
          if (!workerList.some(w => w.id === found.id)) setWorkerList(prev => [found, ...prev]);
          setSelectedWorker(found);
      } else alert("ID not found!");
  };

  const confirmHandoverSend = () => {
    if (handoverOrderId && selectedWorker && nextStage) {
      if (nextStage === 'RETURN_ADMIN' as any) {
         const currentOrder = orders.find(o => o.id === handoverOrderId);
         if (currentOrder?.securityCode !== otpInput) { setShowOtpError(true); return; }
         moveOrder(handoverOrderId, 'Completed', selectedWorker.name, OrderStage.DELIVERED, parseInt(codInput) || 0); triggerBanner('VERIFIED & DELIVERED');
      } else {
         moveOrder(handoverOrderId, 'Inbox', selectedWorker.id, nextStage);
         triggerBanner(`SENT TO ${selectedWorker.name}`);
      }
      setShowHandoverModal(false); setHandoverOrderId(null); setSelectedWorker(null); setSelectedOrderId(null);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto min-h-screen flex flex-col relative pb-20">
      <div className={`fixed top-0 left-0 w-full ${bannerColor} text-black font-bold text-center py-3 z-[100] transition-transform duration-300 shadow-xl flex items-center justify-center gap-2 ${showBanner ? 'translate-y-0' : '-translate-y-full'}`}>
          {bannerColor.includes('red') ? <Ban size={20} /> : <CheckCircle2 size={20} />}{bannerMessage}
       </div>
      
      <div className="flex justify-between items-start mb-6 pt-4">
        <div>
            <h1 className="text-3xl font-serif-display text-white mb-1">{role} Panel</h1>
            <p className="text-zinc-500 text-sm">{currentUser?.name} <span className="text-zinc-600">•</span> {currentUser?.id}</p>
        </div>
        <div className="flex gap-2">
            <button onClick={handleRefresh} className="p-2 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors active:scale-90">
                <RefreshCw size={20} />
            </button>
            <Link to="/" className="p-2 text-zinc-500 hover:text-white transition-colors"><X size={24} /></Link>
        </div>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-6">
         <OrderStatusCard title="Self" value={counts['Self Order']} icon={Box} colorClass="text-blue-400" bgClass="bg-blue-500/10" borderClass="border-blue-500/30" isActive={activeTab === 'Self Order'} onClick={() => setActiveTab('Self Order')} />
         <OrderStatusCard title="Inbox" value={counts['Inbox']} icon={Inbox} colorClass="text-purple-400" bgClass="bg-purple-500/10" borderClass="border-purple-500/30" isActive={activeTab === 'Inbox'} onClick={() => setActiveTab('Inbox')} />
         <OrderStatusCard title="Save" value={counts['Save Box']} icon={Bookmark} colorClass="text-emerald-400" bgClass="bg-emerald-500/10" borderClass="border-emerald-500/30" isActive={activeTab === 'Save Box'} onClick={() => setActiveTab('Save Box')} />
         <OrderStatusCard title="Return" value={counts['Return Order']} icon={RotateCcw} colorClass="text-orange-400" bgClass="bg-orange-500/10" borderClass="border-orange-500/30" isActive={activeTab === 'Return Order'} onClick={() => setActiveTab('Return Order')} />
         <OrderStatusCard title="Done" value={counts['Completed']} icon={CheckCircle2} colorClass="text-pink-400" bgClass="bg-pink-500/10" borderClass="border-pink-500/30" isActive={activeTab === 'Completed'} onClick={() => setActiveTab('Completed')} />
      </div>

      <div className="border-t border-zinc-800 pt-6 flex-1">
        <div className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => {
              const isSelected = selectedOrderId === order.id;
              const isCreator = currentUser?.id === order.creatorId || role === UserRole.ADMIN;
              const customer = customers.find(c => c.id === order.customerId);
              return (
                 <div key={order.id} onClick={() => setSelectedOrderId(isSelected ? null : order.id)} className={`bg-zinc-900 rounded-2xl border flex flex-col transition-all cursor-pointer relative overflow-hidden ${isSelected ? 'border-amber-500/50' : 'border-zinc-800'}`}>
                    <div className="p-4 pl-6 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                           <div className="h-12 w-12 rounded-full flex items-center justify-center font-bold text-lg bg-zinc-800 text-zinc-400 border border-zinc-700">{order.type.charAt(0)}</div>
                           <div>
                              <h4 className="font-bold text-zinc-100 text-lg flex items-center gap-2">{order.type}<span className="text-zinc-500 text-[10px] font-mono px-2 py-0.5 bg-black rounded">{order.billNumber}</span></h4>
                              <p className="text-xs text-zinc-400">{order.customerName}</p>
                              <div className="flex flex-wrap items-center gap-2 mt-2">
                                  <div className="flex items-center gap-1 text-[9px] text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded uppercase tracking-tighter"><Phone size={10} />{isCreator ? customer?.mobile : '**********'}</div>
                                  {isCreator && <div className="flex items-center gap-1 text-emerald-500 font-bold text-xs">₹{order.price.toLocaleString()}</div>}
                                  {(isCreator || activeTab === 'Self Order' || role === UserRole.DELIVERY) && <div className="flex items-center gap-1 text-amber-500 font-bold text-[9px] bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 uppercase tracking-widest">OTP: {order.securityCode}</div>}
                              </div>
                           </div>
                        </div>
                        <div className="text-right"><span className="text-[9px] uppercase font-black text-zinc-600 tracking-widest block">{order.stage}</span></div>
                    </div>
                    {isSelected && (
                        <div className="p-3 bg-black/20 border-t border-zinc-800 grid grid-cols-2 gap-2 animate-in slide-in-from-top-2 duration-200">
                           {activeTab === 'Self Order' && <button onClick={(e) => { e.stopPropagation(); moveOrder(order.id, 'Save'); triggerBanner('SAVED TO BOX'); }} className="col-span-2 py-3 bg-emerald-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider">Confirm Order</button>}
                           {activeTab === 'Inbox' && <button onClick={(e) => { e.stopPropagation(); confirmHandover(order.id); triggerBanner(`ACCEPTED`); }} className="col-span-2 py-3 bg-purple-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider">Accept Job</button>}
                           {activeTab === 'Save Box' && <><button onClick={(e) => { e.stopPropagation(); setMeasurementOrder(order); setMeasurementData(order.measurements || {}); setShowMeasurementModal(true); }} className="col-span-1 py-3 bg-zinc-800 text-white rounded-xl font-bold text-[10px] uppercase tracking-wider">{isMeasurementRole ? 'Take Measure' : 'View Measure'}</button><button onClick={(e) => initiateHandover(e, order)} className="col-span-1 py-3 bg-amber-600 text-black rounded-xl font-bold text-[10px] uppercase tracking-wider">Pass to Next</button></>}
                           {activeTab === 'Return Order' && <button onClick={(e) => { e.stopPropagation(); moveOrder(order.id, 'Completed', undefined, OrderStage.DELIVERED); triggerBanner('DONE'); }} className="col-span-2 py-3 bg-pink-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider">Verify & Finish</button>}
                        </div>
                    )}
                 </div>
              );
            })
          ) : (
            <div className="text-center py-20 border border-dashed border-zinc-800 rounded-3xl bg-zinc-900/30">
                <Box size={40} className="mx-auto text-zinc-700 mb-2 opacity-50" />
                <p className="text-zinc-500 text-xs font-black uppercase tracking-[0.2em]">Queue Empty</p>
                {activeTab === 'Self Order' && (
                    <Link to="/new-order" className="mt-4 inline-block px-4 py-2 bg-amber-600/20 text-amber-500 rounded-lg text-xs font-bold uppercase tracking-widest border border-amber-600/30">Create New Bill</Link>
                )}
            </div>
          )}
        </div>
      </div>

      {showHandoverModal && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"><div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 shadow-2xl flex flex-col max-h-[90vh]"><div className="flex justify-between items-center mb-6 shrink-0"><div><h3 className="text-xl font-serif-display text-white uppercase tracking-widest">Handover</h3><p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mt-1">Target: {handoverTitle}</p></div><button onClick={() => setShowHandoverModal(false)}><X size={24} className="text-zinc-600"/></button></div><div className="mb-4 shrink-0 flex gap-2"><input type="text" placeholder="Worker ID" className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 outline-none font-mono uppercase" value={manualIdInput} onChange={(e) => setManualIdInput(e.target.value)} /><button onClick={handleManualSearch} className="bg-zinc-800 text-white rounded-xl px-4 flex items-center justify-center hover:bg-zinc-700 transition-colors"><Plus size={20} /></button></div><div className="space-y-2 mb-6 overflow-y-auto flex-1 scrollbar-hide">{workerList.map(worker => <button key={worker.id} onClick={() => setSelectedWorker(worker)} className={`w-full flex items-center p-4 rounded-2xl border transition-all mb-2 ${selectedWorker?.id === worker.id ? 'bg-amber-500/20 border-amber-500' : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'}`}><div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mr-3 ${selectedWorker?.id === worker.id ? 'bg-amber-500 text-black' : 'bg-zinc-800'}`}>{worker.name.charAt(0)}</div><div className="text-left"><p className="font-bold text-sm text-white">{worker.name}</p><p className="text-[9px] text-zinc-500 uppercase">{worker.id}</p></div>{selectedWorker?.id === worker.id && <CheckCircle2 className="ml-auto text-amber-500" size={18} />}</button>)}</div>{nextStage === 'RETURN_ADMIN' as any && <div className="mb-6 p-5 bg-black rounded-3xl border border-zinc-800 space-y-4"><div><label className="text-[9px] text-zinc-600 uppercase font-black block mb-2 tracking-widest">Customer OTP</label><input type="text" maxLength={4} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center tracking-[1em] text-white font-mono font-black outline-none" value={otpInput} onChange={(e) => setOtpInput(e.target.value)} />{showOtpError && <p className="text-red-500 text-[8px] mt-2 text-center font-black uppercase tracking-widest animate-bounce">OTP MISMATCH</p>}</div><div><label className="text-[9px] text-zinc-600 uppercase font-black block mb-2 tracking-widest">Collect COD (₹)</label><input type="number" placeholder="0" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white font-mono outline-none" value={codInput} onChange={(e) => setCodInput(e.target.value)} /></div></div>}<button onClick={confirmHandoverSend} disabled={!selectedWorker} className={`w-full py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-2 transition-all active:scale-95 ${selectedWorker ? 'bg-emerald-500 text-black shadow-xl shadow-emerald-900/20' : 'bg-zinc-800 text-zinc-600'}`}>CONFIRM HANDOVER</button></div></div>}

      {showMeasurementModal && measurementOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-4xl bg-[#121214] border border-zinc-800 rounded-[2.5rem] p-6 shadow-2xl h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-6 pb-6 border-b border-zinc-900">
              <div>
                <h3 className="text-xl font-serif-display text-white uppercase tracking-widest">{isMeasurementRole ? 'Take Measurement' : 'View Measure Book'}</h3>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">{measurementOrder.customerName} • {measurementOrder.billNumber}</p>
              </div>
              <button onClick={() => setShowMeasurementModal(false)}><X size={28} className="text-zinc-600 hover:text-white transition-colors" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/3 shrink-0"><BodyVisualizer onPartClick={setActiveBodyPart} activePart={activeBodyPart} isReadOnly={!isMeasurementRole}/></div>
                <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {['Length', 'Chest', 'Stomach', 'Seat', 'Shoulder', 'Sleeve', 'Cuff', 'Collar'].map((part) => (
                    <div key={part} className="space-y-1.5">
                      <label className="text-[8px] uppercase font-black text-zinc-600 tracking-[0.2em] ml-1">{part}</label>
                      <input type="text" readOnly={!isMeasurementRole} className={`w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-white font-mono text-sm outline-none transition-all ${!isMeasurementRole ? 'opacity-50' : 'focus:border-amber-500'}`} value={measurementData[part.toLowerCase() as keyof MeasurementData] as string || ''} onChange={(e) => setMeasurementData({...measurementData, [part.toLowerCase()]: e.target.value})} placeholder="-" />
                    </div>
                  ))}
                  <div className="col-span-full mt-4 space-y-1.5">
                      <label className="text-[8px] uppercase font-black text-zinc-600 tracking-[0.2em] ml-1">Special Master Instructions</label>
                      <textarea readOnly={!isMeasurementRole} className={`w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-5 text-white text-xs outline-none min-h-[120px] transition-all ${!isMeasurementRole ? 'opacity-50' : 'focus:border-amber-500'}`} value={measurementData.notes || ''} onChange={(e) => setMeasurementData({...measurementData, notes: e.target.value})} placeholder="..." />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 mt-auto shrink-0">
                {isMeasurementRole ? (
                    <button onClick={() => { saveMeasurements(measurementOrder.id, measurementData, measurementOrder.price); setShowMeasurementModal(false); triggerBanner('MEASUREMENT SAVED'); }} className="w-full py-5 bg-amber-600 text-black font-black uppercase tracking-[0.3em] text-[11px] rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-amber-900/20 active:scale-95 transition-all">
                        <Save size={20} /> Save Measure Book
                    </button>
                ) : (
                    <button onClick={() => setShowMeasurementModal(false)} className="w-full py-5 bg-zinc-800 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl active:scale-95 transition-all">Close Viewer</button>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default OrderManagement;
