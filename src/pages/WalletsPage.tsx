
import React, { useState, useMemo } from 'react';
import { 
  Wallet, QrCode, ArrowRightLeft, Download, Upload, CreditCard, 
  UserCheck, Search, CheckCircle2, AlertCircle, Landmark, 
  Smartphone, Lock, AlertTriangle, Ban, History, X, ArrowRight, 
  Clock, Hash, User, Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SystemUser, WalletTransaction, TransactionRequest } from '../types';

const WalletsPage = () => {
  const { stats, requestAddFunds, requestWithdrawal, currentUser, config, transactions, requests, transferFunds } = useApp();
  const [activeTab, setActiveTab] = useState<'ADD' | 'WITHDRAW' | 'ID_TRANSFER'>('ADD');
  
  const [amount, setAmount] = useState('');
  const [utr, setUtr] = useState('');
  const [targetId, setTargetId] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState<'BANK' | 'UPI'>('UPI');
  
  const [notification, setNotification] = useState<{ show: boolean; msg: string; type: 'success' | 'error' }>({ 
      show: false, 
      msg: '', 
      type: 'success' 
  });

  const showNotification = (msg: string, type: 'success' | 'error' = 'success') => {
    setNotification({ show: true, msg, type });
    setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 4000);
  };

  const handleAddMoney = async () => {
    const amt = parseInt(amount);
    if (!amt || isNaN(amt) || !utr) return showNotification("Please fill valid amount and UTR", "error");
    const success = await requestAddFunds(amt, utr);
    if (success) {
        showNotification("Add Money Request Sent to Admin!");
        setAmount(''); setUtr('');
    } else {
        showNotification("Failed to send request. Try again.", "error");
    }
  };

  const handleWithdraw = async () => {
    const amt = parseInt(amount);
    if (!amt || isNaN(amt) || amt < 500) return showNotification("Minimum withdrawal is ₹500", "error");
    if (amt > stats.bookingWallet) return showNotification("Insufficient Balance", "error");
    
    let details = "";
    if (withdrawMethod === 'UPI') {
        if (!currentUser?.upiId) return showNotification("Please update UPI ID in Profile first!", "error");
        details = `UPI: ${currentUser.upiId}`;
    } else {
        if (!currentUser?.bankDetails?.accountNumber) return showNotification("Please update Bank Details in Profile first!", "error");
        details = `Bank: ${currentUser.bankDetails.bankName}, A/C: ${currentUser.bankDetails.accountNumber}, IFSC: ${currentUser.bankDetails.ifscCode}, Name: ${currentUser.bankDetails.accountName}`;
    }

    const success = await requestWithdrawal(amt, withdrawMethod, details);
    if (success) {
        showNotification("Withdrawal Request Sent Successfully!");
        setAmount('');
    } else {
        showNotification("Failed to send request.", "error");
    }
  };

  const handleTransfer = async () => {
    const amt = parseInt(amount);
    if (!amt || isNaN(amt) || !targetId) return showNotification("Fill all fields", "error");
    if (amt <= 0) return showNotification("Invalid Amount", "error");

    const success = await transferFunds(targetId.toUpperCase(), amt);
    if (success) {
        showNotification(`Successfully Transferred ₹${amt} to ${targetId}!`);
        setAmount(''); setTargetId('');
    } else {
        showNotification("Transfer Failed. Check ID validity or Balance.", "error");
    }
  };

  const myRequests = useMemo(() => requests.filter(r => r.userId === currentUser?.id), [requests, currentUser]);

  // QR Logic
  const qrUrl = config.companyDetails?.qrUrl || `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=${config.companyDetails?.upiId || '9571167318@paytm'}&pn=LordsBespoke`;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto min-h-screen pb-20">
      
      <div className={`fixed top-0 left-0 w-full z-[100] py-4 text-center font-bold text-black transition-transform duration-500 shadow-xl ${notification.show ? 'translate-y-0' : '-translate-y-full'} ${notification.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}>
         {notification.msg}
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-serif-display text-white mb-2">Accounting</h1>
        <p className="text-zinc-500">Manage your Booking Wallet, Withdrawals and Transfers.</p>
      </div>

      <div className="bg-zinc-900 border border-emerald-500/30 p-6 rounded-2xl mb-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
          <p className="text-zinc-500 text-xs uppercase font-bold tracking-widest mb-2 flex items-center gap-2">
            <Wallet size={14} className="text-emerald-500" /> Booking Wallet Balance
          </p>
          <h2 className="text-4xl font-serif-display font-bold text-white mb-4">₹{stats.bookingWallet.toLocaleString()}</h2>
          <div className="flex gap-4">
             <div className="bg-black/40 px-3 py-1.5 rounded-lg border border-zinc-800">
                <p className="text-[10px] text-zinc-500 uppercase">Daily Earnings</p>
                <p className="text-sm font-bold text-emerald-500">₹{stats.todaysWallet.toLocaleString()}</p>
             </div>
             <div className="bg-black/40 px-3 py-1.5 rounded-lg border border-zinc-800">
                <p className="text-[10px] text-zinc-500 uppercase">Network Bonus</p>
                <p className="text-sm font-bold text-blue-500">₹{stats.uplineWallet.toLocaleString()}</p>
             </div>
          </div>
      </div>

      <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800 mb-8">
         <button onClick={() => setActiveTab('ADD')} className={`flex-1 py-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'ADD' ? 'bg-amber-600 text-black shadow-lg' : 'text-zinc-500 hover:text-white'}`}>
            <Upload size={16} /> Add Funds
         </button>
         <button onClick={() => setActiveTab('WITHDRAW')} className={`flex-1 py-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'WITHDRAW' ? 'bg-amber-600 text-black shadow-lg' : 'text-zinc-500 hover:text-white'}`}>
            <Download size={16} /> Withdraw
         </button>
         <button onClick={() => setActiveTab('ID_TRANSFER')} className={`flex-1 py-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'ID_TRANSFER' ? 'bg-amber-600 text-black shadow-lg' : 'text-zinc-500 hover:text-white'}`}>
            <ArrowRightLeft size={16} /> Transfer
         </button>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 mb-8">
         
         {activeTab === 'ADD' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
               <h3 className="text-white font-bold mb-6 flex items-center gap-2"><QrCode size={20} className="text-amber-500" /> Official Payment Gateway</h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  <div className="space-y-4">
                     <div className="bg-white p-4 rounded-2xl shadow-xl shadow-amber-500/5 flex flex-col items-center group relative">
                        <img src={qrUrl} alt="Payment QR" className="w-full h-auto max-w-[200px] group-hover:scale-105 transition-transform duration-500" />
                        <div className="bg-amber-500 text-black text-[9px] font-black px-2 py-1 rounded absolute top-2 right-2 shadow-lg uppercase tracking-widest">Scan & Pay</div>
                        <p className="text-[10px] text-zinc-400 text-center mt-3 font-bold uppercase tracking-tighter">{config.companyDetails?.upiId}</p>
                     </div>
                     <div className="bg-black/40 border border-zinc-800 p-4 rounded-xl">
                        <p className="text-[10px] text-zinc-500 uppercase font-bold mb-2 flex items-center gap-2"><Landmark size={12} className="text-amber-500" /> Company Bank Account</p>
                        <div className="space-y-1">
                           <p className="text-xs text-white"><span className="text-zinc-500">Bank:</span> {config.companyDetails?.bankName}</p>
                           <p className="text-xs text-white"><span className="text-zinc-500">A/C:</span> {config.companyDetails?.accountNumber}</p>
                           <p className="text-xs text-white"><span className="text-zinc-500">IFSC:</span> {config.companyDetails?.ifscCode}</p>
                           <p className="text-[9px] text-amber-500/80 font-bold mt-1 uppercase tracking-tighter">{config.companyDetails?.accountName}</p>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-4 w-full">
                     <div className="bg-zinc-800/30 p-3 rounded-lg border border-zinc-700/50 flex items-start gap-2">
                        <Info size={14} className="text-amber-500 mt-0.5" />
                        <p className="text-[10px] text-zinc-400 leading-relaxed uppercase tracking-wide">Step 1: Pay using QR or UPI.<br/>Step 2: Enter amount and UTR below.<br/>Step 3: Submit for verification.</p>
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-xs text-zinc-500 uppercase font-bold">Deposit Amount</label>
                        <input type="number" placeholder="Enter ₹ Amount" className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-white focus:border-amber-500 outline-none" value={amount} onChange={e => setAmount(e.target.value)} />
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-xs text-zinc-500 uppercase font-bold">Transaction UTR / Ref No.</label>
                        <input type="text" placeholder="12 Digit UTR Number" className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-white focus:border-amber-500 outline-none font-mono" value={utr} onChange={e => setUtr(e.target.value)} />
                     </div>
                     <button onClick={handleAddMoney} className="w-full bg-amber-600 hover:bg-amber-500 text-black font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
                        <CheckCircle2 size={18} /> Submit Deposit Request
                     </button>
                  </div>
               </div>
            </div>
         )}

         {activeTab === 'WITHDRAW' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
               <h3 className="text-white font-bold mb-6 flex items-center gap-2"><CreditCard size={20} className="text-red-500" /> Request Withdrawal</h3>
               <div className="grid gap-6">
                  <div className="flex gap-4">
                     <button onClick={() => setWithdrawMethod('UPI')} className={`flex-1 p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${withdrawMethod === 'UPI' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' : 'bg-black border-zinc-800 text-zinc-500'}`}>
                        <Smartphone size={24} /> <span className="text-xs font-bold uppercase">UPI ID</span>
                     </button>
                     <button onClick={() => setWithdrawMethod('BANK')} className={`flex-1 p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${withdrawMethod === 'BANK' ? 'bg-blue-500/10 border-blue-500 text-blue-500' : 'bg-black border-zinc-800 text-zinc-500'}`}>
                        <Landmark size={24} /> <span className="text-xs font-bold uppercase">Bank Account</span>
                     </button>
                  </div>
                  <div className="space-y-4">
                     <div>
                        <label className="text-xs text-zinc-500 uppercase font-bold mb-2 block">Withdrawal Amount</label>
                        <input type="number" placeholder="Min ₹500" className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-white focus:border-amber-500 outline-none" value={amount} onChange={e => setAmount(e.target.value)} />
                     </div>
                     <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                         <p className="text-[10px] text-zinc-500 uppercase font-bold mb-2">Destination Details (From Profile)</p>
                         {withdrawMethod === 'UPI' ? (
                            <p className="text-sm text-white font-mono">{currentUser?.upiId || '❌ No UPI ID in Profile'}</p>
                         ) : (
                            <p className="text-sm text-white font-mono leading-relaxed">{currentUser?.bankDetails?.accountNumber ? `${currentUser.bankDetails.bankName} - ${currentUser.bankDetails.accountNumber}` : '❌ No Bank Details in Profile'}</p>
                         )}
                         <p className="text-[9px] text-zinc-600 mt-2 italic">* To change payment destination, update your Profile Page.</p>
                     </div>
                     <button onClick={handleWithdraw} className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 uppercase tracking-widest text-xs">
                        Confirm Withdrawal Request
                     </button>
                  </div>
               </div>
            </div>
         )}

         {activeTab === 'ID_TRANSFER' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
               <h3 className="text-white font-bold mb-6 flex items-center gap-2"><ArrowRightLeft size={20} className="text-blue-500" /> Member Transfer</h3>
               <div className="space-y-4">
                  <div>
                     <label className="text-xs text-zinc-500 uppercase font-bold mb-2 block">Recipient System ID</label>
                     <input type="text" placeholder="LBT-XXXX" className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-white focus:border-blue-500 outline-none font-mono uppercase" value={targetId} onChange={e => setTargetId(e.target.value)} />
                  </div>
                  <div>
                     <label className="text-xs text-zinc-500 uppercase font-bold mb-2 block">Transfer Amount</label>
                     <input type="number" placeholder="₹ Amount" className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-white focus:border-blue-500 outline-none" value={amount} onChange={e => setAmount(e.target.value)} />
                  </div>
                  <button onClick={handleTransfer} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 uppercase tracking-widest text-xs">
                     Send Funds Instantly
                  </button>
               </div>
            </div>
         )}
      </div>

      <div className="space-y-4">
          <h3 className="text-white font-bold flex items-center gap-2 uppercase tracking-widest text-xs text-zinc-500"><History size={16} /> Recent Requests</h3>
          {myRequests.length > 0 ? (
             myRequests.map(req => (
                <div key={req.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center justify-between group hover:border-zinc-700 transition-colors shadow-lg shadow-black/20">
                   <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${req.type === 'ADD_FUNDS' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                         {req.type === 'ADD_FUNDS' ? <Upload size={18}/> : <Download size={18}/>}
                      </div>
                      <div>
                         <p className="text-white font-bold text-sm">{req.type === 'ADD_FUNDS' ? 'Fund Addition' : 'Withdrawal'}</p>
                         <p className="text-[10px] text-zinc-500 font-mono uppercase">{req.date}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-sm font-bold text-white">₹{req.amount.toLocaleString()}</p>
                      <span className={`text-[9px] px-2 py-0.5 rounded font-black uppercase tracking-widest ${req.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-500' : req.status === 'REJECTED' ? 'bg-red-500/20 text-red-500' : 'bg-amber-500/20 text-amber-500'}`}>
                         {req.status}
                      </span>
                   </div>
                </div>
             ))
          ) : (
             <div className="text-center py-10 border border-dashed border-zinc-800 rounded-2xl text-zinc-600 text-xs italic uppercase tracking-widest">
                No recent transaction history.
             </div>
          )}
      </div>

    </div>
  );
};

export default WalletsPage;
