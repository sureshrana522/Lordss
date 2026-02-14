import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { OrderStage } from '../types';
import { Search, CheckCircle2, Circle } from 'lucide-react';

const CustomerTrack = () => {
  const { orders } = useApp();
  const [searchBill, setSearchBill] = useState('');
  const [foundOrder, setFoundOrder] = useState<any>(null);

  const handleSearch = () => {
    const order = orders.find(o => o.billNumber === searchBill);
    if (order) {
      setFoundOrder(order);
    } else {
      alert('Order not found. Please check bill number.');
      setFoundOrder(null);
    }
  };

  const stages = Object.values(OrderStage);
  const currentStageIndex = foundOrder ? stages.indexOf(foundOrder.stage) : -1;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="font-serif-display text-4xl text-gold mb-4">Track Your Order</h1>
        <p className="text-zinc-400">Enter your bill number to see the live status of your bespoke garment.</p>
      </div>

      <div className="flex gap-4 mb-12">
        <input 
          type="text" 
          placeholder="Enter Bill Number (e.g., LBT-1001)"
          className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-6 py-4 text-xl text-center tracking-widest uppercase outline-none focus:border-amber-500"
          value={searchBill}
          onChange={e => setSearchBill(e.target.value)}
        />
        <button 
          onClick={handleSearch}
          className="bg-zinc-100 text-black font-bold px-8 rounded-lg hover:bg-amber-500 hover:text-white transition-colors"
        >
          <Search size={24} />
        </button>
      </div>

      {foundOrder && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-700 via-amber-500 to-amber-700"></div>
          
          <div className="flex justify-between items-end mb-8 border-b border-zinc-800 pb-6">
            <div>
              <p className="text-zinc-500 uppercase tracking-widest text-xs mb-1">Customer</p>
              <h3 className="text-2xl font-serif-display text-zinc-100">{foundOrder.customerName}</h3>
            </div>
            <div className="text-right">
              <p className="text-zinc-500 uppercase tracking-widest text-xs mb-1">Item</p>
              <p className="text-amber-500 font-bold text-xl">{foundOrder.type}</p>
            </div>
          </div>

          <div className="space-y-6 relative">
            {/* Vertical Line */}
            <div className="absolute left-[19px] top-4 bottom-4 w-[2px] bg-zinc-800 z-0"></div>

            {stages.map((stage, index) => {
              const isCompleted = index <= currentStageIndex;
              const isCurrent = index === currentStageIndex;

              return (
                <div key={stage} className={`flex items-center gap-4 relative z-10 ${isCompleted ? 'opacity-100' : 'opacity-40'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    isCompleted ? 'bg-amber-500 border-amber-500 text-black' : 'bg-zinc-950 border-zinc-700 text-zinc-700'
                  }`}>
                    {isCompleted ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                  </div>
                  <div>
                    <h4 className={`text-lg font-bold ${isCurrent ? 'text-amber-500' : 'text-zinc-300'}`}>{stage}</h4>
                    {isCurrent && <p className="text-xs text-zinc-500 mt-1">Currently in progress</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerTrack;