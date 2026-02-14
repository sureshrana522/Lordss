
import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, MapPin, Lock, CreditCard, Save, QrCode, 
  ShieldCheck, Hash, Eye, EyeOff, Download, CheckCircle2, 
  BadgeCheck, Landmark, Smartphone, Share2, Copy, Link as LinkIcon, Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const ProfilePage = () => {
  const { currentUser, updateSystemUser } = useApp();
  const [showTPassword, setShowTPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [copyStatus, setCopyStatus] = useState(false);
  
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    mobile: currentUser?.mobile || '',
    address: 'Jaipur, Rajasthan',
    email: `${currentUser?.id.toLowerCase()}@lords.bespoke.com`,
    tPassword: currentUser?.tPassword || '1234', 
    loginPassword: currentUser?.loginPassword || '123456',
    upiId: currentUser?.upiId || '',
    bankAccountName: currentUser?.bankDetails?.accountName || '',
    bankAccountNumber: currentUser?.bankDetails?.accountNumber || '',
    bankIfsc: currentUser?.bankDetails?.ifscCode || '',
    bankName: currentUser?.bankDetails?.bankName || ''
  });

  useEffect(() => {
      if(currentUser) {
          setFormData(prev => ({
              ...prev,
              name: currentUser.name,
              mobile: currentUser.mobile,
              tPassword: currentUser.tPassword || '1234',
              loginPassword: currentUser.loginPassword || '123456',
              upiId: currentUser.upiId || '',
              bankAccountName: currentUser.bankDetails?.accountName || '',
              bankAccountNumber: currentUser.bankDetails?.accountNumber || '',
              bankIfsc: currentUser.bankDetails?.ifscCode || '',
              bankName: currentUser.bankDetails?.bankName || ''
          }));
      }
  }, [currentUser]);

  const handleCopyLink = () => {
      // Correct link generation for HashRouter auto-reg
      const refLink = `${window.location.origin}/#/login?ref=${currentUser?.id}`;
      navigator.clipboard.writeText(refLink);
      setCopyStatus(true);
      setTimeout(() => setCopyStatus(false), 2000);
  };

  const handleSave = () => {
    if (currentUser) {
        updateSystemUser(currentUser.id, {
            name: formData.name,
            mobile: formData.mobile,
            tPassword: formData.tPassword,
            loginPassword: formData.loginPassword,
            upiId: formData.upiId,
            bankDetails: {
                accountName: formData.bankAccountName,
                accountNumber: formData.bankAccountNumber,
                ifscCode: formData.bankIfsc,
                bankName: formData.bankName
            }
        });
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto min-h-screen relative pb-32">
       <div className={`fixed top-0 left-0 w-full bg-emerald-500 text-black font-bold text-center py-3 z-50 transition-transform duration-300 shadow-xl flex items-center justify-center gap-2 ${showSuccess ? 'translate-y-0' : '-translate-y-full'}`}>
          <CheckCircle2 size={20} /> PROFILE UPDATED
       </div>

       <div className="mb-10">
        <h1 className="text-3xl font-serif-display text-white mb-2 uppercase tracking-widest">My Digital ID</h1>
        <p className="text-zinc-500 text-xs font-black uppercase tracking-widest">Authorized System User Profile</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
           {/* DIGITAL ID CARD */}
           <div className="w-full bg-zinc-900 rounded-[2.5rem] border border-amber-500/20 p-10 text-center relative overflow-hidden shadow-2xl group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-600 to-amber-400"></div>
              <div className="w-24 h-24 rounded-[2rem] bg-zinc-950 border-2 border-amber-500/20 mx-auto mb-6 flex items-center justify-center shadow-inner group-hover:border-amber-500 transition-colors">
                 <span className="text-4xl font-serif-display text-gold drop-shadow-lg">{formData.name.charAt(0)}</span>
              </div>
              <h2 className="text-2xl font-bold text-white uppercase tracking-tight mb-1">{formData.name}</h2>
              <p className="text-[10px] text-amber-500 font-black uppercase tracking-[0.3em] mb-8">{currentUser?.role}</p>
              
              <div className="grid grid-cols-2 gap-4 text-left border-t border-zinc-800 pt-8 mb-8">
                 <div><p className="text-[10px] text-zinc-600 uppercase font-black tracking-widest mb-1">User ID</p><p className="text-sm text-white font-mono font-bold">{currentUser?.id}</p></div>
                 <div><p className="text-[10px] text-zinc-600 uppercase font-black tracking-widest mb-1">Status</p><p className="text-sm text-emerald-500 font-black uppercase">{currentUser?.status}</p></div>
              </div>
              <div className="bg-white p-3 rounded-2xl inline-block shadow-2xl"><QrCode size={90} className="text-black" /></div>
           </div>

           {/* REFERRAL BOX - HIGHLIGHTED */}
           <div className="w-full bg-gradient-to-br from-amber-600 to-amber-400 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500"><Share2 size={80} /></div>
              <h3 className="text-black font-black text-sm uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                 <LinkIcon size={18} /> Referral Program
              </h3>
              <div className="bg-black/20 p-5 rounded-3xl border border-black/10 backdrop-blur-md">
                 <div className="flex items-center justify-between mb-4">
                    <p className="text-black/70 text-[10px] font-black uppercase tracking-widest">Share My Link</p>
                    <div className="p-1.5 bg-black/10 rounded-lg"><Zap size={14} className="text-black" /></div>
                 </div>
                 <p className="text-black font-mono text-[10px] truncate mb-5 bg-black/5 p-2 rounded-lg">{window.location.origin}/#/login?ref={currentUser?.id}</p>
                 <button onClick={handleCopyLink} className="w-full bg-black text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xl">
                    {copyStatus ? <><CheckCircle2 size={16} /> Link Copied!</> : <><Copy size={16} /> Copy Referral Link</>}
                 </button>
              </div>
              <p className="text-black/50 text-[9px] font-black uppercase mt-5 text-center tracking-tighter">Grow your network to earn magic matrix income</p>
           </div>
        </div>

        <div className="w-full lg:w-2/3 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
           <div className="flex items-center gap-3 mb-10 pb-6 border-b border-zinc-800">
               <Smartphone size={24} className="text-amber-500" />
               <h3 className="text-white font-bold text-xl uppercase tracking-widest">Secure Settings</h3>
           </div>
           
           <div className="grid md:grid-cols-2 gap-8">
              <div className="md:col-span-2 space-y-2">
                 <label className="text-[10px] text-zinc-600 uppercase font-black tracking-widest ml-1">Full Name</label>
                 <input type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-5 text-white focus:border-amber-500 outline-none transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] text-zinc-600 uppercase font-black tracking-widest ml-1">Mobile Access</label>
                 <input type="tel" className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-5 text-white focus:border-amber-500 outline-none transition-all font-mono" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] text-zinc-600 uppercase font-black tracking-widest ml-1">Payment UPI</label>
                 <input type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-5 text-white focus:border-emerald-500 outline-none transition-all font-mono" value={formData.upiId} onChange={e => setFormData({...formData, upiId: e.target.value})} placeholder="id@upi" />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] text-zinc-600 uppercase font-black tracking-widest ml-1">Login Password</label>
                 <div className="relative">
                    <input type={showLoginPassword ? "text" : "password"} className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-5 text-white focus:border-red-500 outline-none transition-all font-mono" value={formData.loginPassword} onChange={e => setFormData({...formData, loginPassword: e.target.value})} />
                    <button onClick={() => setShowLoginPassword(!showLoginPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-700 hover:text-white transition-colors">{showLoginPassword ? <EyeOff size={18}/> : <Eye size={18}/>}</button>
                 </div>
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] text-zinc-600 uppercase font-black tracking-widest ml-1">Tx Pin (1234)</label>
                 <div className="relative">
                    <input type={showTPassword ? "text" : "password"} className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-5 text-white focus:border-blue-500 outline-none transition-all font-mono" value={formData.tPassword} onChange={e => setFormData({...formData, tPassword: e.target.value})} />
                    <button onClick={() => setShowTPassword(!showTPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-700 hover:text-white transition-colors">{showTPassword ? <EyeOff size={18}/> : <Eye size={18}/>}</button>
                 </div>
              </div>
           </div>
           
           <div className="mt-12 pt-8 border-t border-zinc-800">
              <button onClick={handleSave} className="w-full md:w-auto bg-amber-600 hover:bg-amber-500 text-black font-black py-5 px-14 rounded-2xl uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 shadow-xl shadow-amber-900/10 transition-all active:scale-95">
                 <Save size={20} /> Update Secure Information
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
