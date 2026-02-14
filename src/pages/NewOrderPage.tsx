
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Edit3, XCircle, CheckCircle2, Zap, AlertTriangle, Wallet, IndianRupee, Crown, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Order, OrderStage } from '../types';

const NewOrderPage = () => {
  const navigate = useNavigate();
  const { addCustomer, addOrder, customers, currentUser, stitchingRates, stats } = useApp(); 
  
  const [customer, setCustomer] = useState({ name: '', mobile: '', address: '' });
  const [quality, setQuality] = useState<'Normal' | 'Medium' | 'Regular' | 'VIP'>('Medium'); 
  const [items, setItems] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [showModal, setShowModal] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState('ORDER CREATED SUCCESSFULLY');
  const [bannerColor, setBannerColor] = useState('bg-emerald-500');

  const vipGarments = stitchingRates.filter(r => r.type.includes('Suit') || r.type.includes('Set') || r.type.includes('Line') || r.type.includes('Premium') || r.type.includes('Fit') || r.type.includes('Ceremony') || r.type.includes('Luxury') || r.type.includes('Edition')).map(r => r.type);
  const regularGarments = stitchingRates.filter(r => !vipGarments.includes(r.type as any)).map(r => r.type);
  
  const getQualityStyles = (q: string, isSelected: boolean) => {
    if (!isSelected) return 'bg-zinc-950 text-zinc-500 border-zinc-800 hover:border-zinc-600';
    switch (q) {
      case 'Normal': return 'bg-zinc-300 text-black border-zinc-300 shadow-lg';
      case 'Medium': return 'bg-purple-500 text-white border-purple-500 shadow-lg';
      case 'Regular': return 'bg-blue-600 text-white border-blue-600 shadow-lg';
      case 'VIP': return 'bg-amber-500 text-black border-amber-500 shadow-lg';
      default: return 'bg-zinc-800 text-white';
    }
  };

  const total = items.reduce((acc, item) => acc + item.rate, 0);

  const addItem = (type: string) => {
    const rateObj = stitchingRates.find(r => r.type === type);
    if (rateObj) {
      let rate = 0;
      const q = quality.toLowerCase();
      if (q === 'normal') rate = rateObj.normal;
      else if (q === 'medium') rate = rateObj.medium;
      else if (q === 'regular') rate = rateObj.regular;
      else if (q === 'vip') rate = rateObj.vip;
      setItems([...items, { type, rate, quality }]);
    } else {
       setItems([...items, { type, rate: 500, quality }]);
    }
  };

  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handlePreSubmit = () => {
      if (!customer.name || !customer.mobile) return alert("Please enter customer name and mobile.");
      if (items.length === 0) return alert("Please select at least one item.");
      setShowModal(true);
  };

  const handleSelfOrder = async () => {
      if (!currentUser) {
          alert("Session Expired. Please Re-login.");
          navigate('/login');
          return;
      }

      setIsSubmitting(true);
      try {
          const newId = `c${Date.now()}`;
          const billNum = `LBT-${1000 + customers.length + 1}`;
          
          // Fallbacks for safety
          const workerName = currentUser.name || 'Admin';
          const workerId = currentUser.id || 'LBT-ADMIN';
          
          // 1. Create Customer + First Order (Atomic)
          const success = await addCustomer(
              { 
                  id: newId, 
                  name: customer.name, 
                  mobile: customer.mobile, 
                  address: customer.address || '', 
                  billNumber: billNum, 
                  clothMeters: 0, 
                  deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
                  isVIP: quality === 'VIP' 
              }, 
              items[0].type, 
              Number(items[0].rate), 
              workerName, 
              quality, 
              workerId 
          );
          
          if (success) {
              // 2. Create remaining orders (if multiple items)
              if (items.length > 1) {
                  const remainingPromises = [];
                  for (let i = 1; i < items.length; i++) {
                      const item = items[i];
                      const itemBillNum = `${billNum}-${i+1}`;
                      const newOrder: Order = { 
                          id: `o${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`, 
                          customerId: newId, 
                          customerName: customer.name, 
                          billNumber: itemBillNum, 
                          type: item.type, 
                          stage: OrderStage.ORDER_PLACED, 
                          assignedWorker: workerId, // Use ID for assignment
                          createdBy: workerName, // Use Name for display
                          creatorId: workerId, 
                          createdAt: new Date().toISOString().split('T')[0], 
                          lastUpdated: new Date().toISOString().split('T')[0], 
                          deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
                          price: Number(item.rate), 
                          quality: quality || 'Regular', 
                          folder: 'Self', 
                          handoverStatus: 'Accepted', 
                          securityCode: Math.floor(1000 + Math.random() * 9000).toString(), 
                          workerHistory: [workerId], 
                          isPaid: false 
                      };
                      remainingPromises.push(addOrder(newOrder));
                  }
                  await Promise.all(remainingPromises);
              }

              setBannerMessage('ORDER CREATED SUCCESSFULLY');
              setBannerColor('bg-emerald-500');
              setShowModal(false);
              setShowSuccessBanner(true);
              // Slight delay to allow Firestore cache to update locally
              setTimeout(() => { navigate('/orders'); }, 2000);
          } else {
              setBannerMessage('DATABASE ERROR: CHECK CONNECTION');
              setBannerColor('bg-red-500');
              setShowSuccessBanner(true);
              setIsSubmitting(false);
              setTimeout(() => setShowSuccessBanner(false), 2000);
          }
      } catch (error) {
          console.error("Order Creation Failed:", error);
          setBannerMessage('CRITICAL ERROR');
          setBannerColor('bg-red-500');
          setShowSuccessBanner(true);
          setIsSubmitting(false);
          setTimeout(() => setShowSuccessBanner(false), 2000);
      }
  };

  return (
    <div className="min-h-screen bg-black p-4 text-zinc-100 font-sans pb-20 relative">
       <div className={`fixed top-0 left-0 w-full ${bannerColor} text-black font-bold text-center py-3 z-[100] transition-transform duration-500 shadow-xl flex items-center justify-center gap-2 ${showSuccessBanner ? 'translate-y-0' : '-translate-y-full'}`}>
          <CheckCircle2 size={20} />
          {bannerMessage}
       </div>

       <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
             <button onClick={() => navigate(-1)} className="p-2 hover:bg-zinc-800 rounded-full transition-colors"><ArrowLeft size={24} className="text-zinc-400" /></button>
             <div>
                <h1 className="text-xl font-bold text-amber-500">New Booking</h1>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Funds will be deducted on Cutting Accept</p>
             </div>
          </div>
       </div>

       <div className="max-w-md mx-auto space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-1 group focus-within:border-amber-500/50 transition-colors">
             <input type="text" placeholder="Customer Name" className="w-full bg-transparent p-4 outline-none text-zinc-200 placeholder-zinc-600 font-medium" value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})} />
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-1 group focus-within:border-amber-500/50 transition-colors">
             <input type="tel" placeholder="Mobile" className="w-full bg-transparent p-4 outline-none text-zinc-200 placeholder-zinc-600 font-medium" value={customer.mobile} onChange={e => setCustomer({...customer, mobile: e.target.value})} />
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
             <p className="text-xs text-zinc-500 uppercase font-bold mb-3 tracking-wider">Quality Line</p>
             <div className="flex gap-2">
                {['Normal', 'Medium', 'Regular', 'VIP'].map((q) => (
                   <button key={q} onClick={() => setQuality(q as any)} className={`flex-1 py-3 px-1 text-xs font-bold uppercase tracking-wider rounded-lg border transition-all ${getQualityStyles(q, quality === q)}`}>{q}</button>
                ))}
             </div>
          </div>
          
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mt-6">
             <div className="flex justify-between items-center mb-4 border-b border-zinc-800 pb-2">
                <span className="text-xs font-bold text-zinc-500 uppercase">Items List ({items.length})</span>
                <span className="text-amber-500 font-bold font-mono">Bill Amount: ₹{total.toLocaleString()}</span>
             </div>
             
             <div className="grid grid-cols-2 gap-2 mb-4">
                {['Shirt', 'Pant', 'Kurta', 'Pyjama', 'Coat', 'Sherwani'].map((g) => (
                   <button key={g} onClick={() => addItem(g)} className="py-3 px-2 border border-zinc-800 bg-zinc-900 hover:border-amber-500/50 hover:text-amber-500 rounded-xl text-[10px] font-bold tracking-wider text-zinc-400 transition-all text-center">{g}</button>
                ))}
             </div>

             {items.length > 0 && (
                <div className="space-y-2">
                   {items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm p-3 bg-black rounded-lg border border-zinc-800">
                         <div>
                            <span className="text-zinc-200 font-bold block">{item.type}</span>
                            <span className="text-[10px] uppercase tracking-wider font-bold text-amber-500">Lord's {item.quality}</span>
                         </div>
                         <div className="flex items-center gap-4">
                            <span className="text-zinc-300 font-mono">₹{item.rate.toLocaleString()}</span>
                            <button onClick={() => removeItem(idx)} className="text-zinc-600 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                         </div>
                      </div>
                   ))}
                </div>
             )}
          </div>
          
          <div className="pt-4">
             <button onClick={handlePreSubmit} disabled={items.length === 0} className={`w-full py-4 font-bold uppercase tracking-widest rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${items.length > 0 ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-black shadow-amber-900/20' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'}`}>
                <Plus size={20} /> Create Bill
             </button>
          </div>
       </div>

       {showModal && (
         <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
               <h3 className="text-xl font-serif-display text-white text-center mb-2">Generate Bill</h3>
               <p className="text-zinc-500 text-center text-sm mb-6">Order will be created immediately.</p>
               <div className="flex flex-col gap-3">
                  <button disabled={isSubmitting} onClick={() => setShowModal(false)} className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"><Edit3 size={18} /> Edit Details</button>
                  <button disabled={isSubmitting} onClick={handleSelfOrder} className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95">
                      {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <><CheckCircle2 size={18} /> Confirm Order</>}
                  </button>
               </div>
            </div>
         </div>
       )}
    </div>
  );
};

export default NewOrderPage;
