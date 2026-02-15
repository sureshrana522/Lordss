import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ShieldCheck, UserPlus, ArrowRight, CheckCircle2, LogIn
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

const JoinForm = ({ referralId, onSwitchToLogin }: { referralId: string, onSwitchToLogin: () => void }) => {
    const { autoRegister, loginUser } = useApp();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [role, setRole] = useState<UserRole>(UserRole.SHIRT_MAKER);
    const [generatedCreds, setGeneratedCreds] = useState<{id: string, password: string} | null>(null);

    const handleSubmit = () => {
        if (!name || !mobile) return alert("Please fill Name and Mobile");
        const creds = autoRegister(name, mobile, role, referralId);
        setGeneratedCreds(creds);
    };

    const handleAutoLogin = () => {
        if (generatedCreds) {
            loginUser(role, generatedCreds.id);
            navigate('/dashboard');
        }
    };

    if (generatedCreds) {
        return (
            <div className="bg-zinc-900 border border-emerald-500/50 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                    <CheckCircle2 size={32} className="text-emerald-500" />
                </div>
                <h3 className="text-2xl text-white mb-6 font-bold uppercase">Done!</h3>
                <div className="bg-black p-6 rounded-xl border border-zinc-800 mb-8 text-left space-y-4">
                    <div>
                        <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Mobile ID</p>
                        <p className="text-lg text-white font-mono font-bold">{mobile}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Password</p>
                        <p className="text-xl text-amber-500 font-mono font-black">{generatedCreds.password}</p>
                    </div>
                </div>
                <button onClick={handleAutoLogin} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 uppercase">
                    Login Now <ArrowRight size={18} />
                </button>
            </div>
        );
    }

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-sm w-full shadow-2xl">
            <h2 className="text-xl text-white mb-6 flex items-center gap-3 font-bold uppercase">
                <UserPlus className="text-amber-500" /> Registration
            </h2>

            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 mb-6 flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 rounded text-amber-500">
                    <ShieldCheck size={16} />
                </div>
                <div>
                    <p className="text-[9px] text-zinc-500 uppercase font-black tracking-widest">Sponsor Code</p>
                    <p className="text-white font-mono font-bold uppercase">{referralId}</p>
                </div>
            </div>

            <div className="space-y-4">
                <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-xl py-4 px-4 text-white focus:border-amber-500 outline-none" />
                <input type="tel" placeholder="10 Digit Mobile" maxLength={10} value={mobile} onChange={e => setMobile(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-xl py-4 px-4 text-white focus:border-amber-500 outline-none" />
                <select value={role} onChange={e => setRole(e.target.value as UserRole)}
                    className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-white outline-none focus:border-amber-500">
                    {Object.values(UserRole).filter(r => r !== UserRole.ADMIN && r !== UserRole.MANAGER && r !== UserRole.CUSTOMER).map(r => (
                        <option key={r} value={r}>{r}</option>
                    ))}
                </select>
            </div>

            <button onClick={handleSubmit} className="w-full mt-8 bg-amber-600 hover:bg-amber-500 text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 uppercase">
                Register ID <ArrowRight size={18} />
            </button>
            <button onClick={onSwitchToLogin} className="w-full mt-4 text-zinc-500 text-[10px] font-black uppercase hover:text-white">
                Already Have Account? Login
            </button>
        </div>
    );
};

const LoginPage = () => {
  const { loginUser, authenticateUser } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const [referralId, setReferralId] = useState<string | null>(null);
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isReferredLogin, setIsReferredLogin] = useState(false);

  useEffect(() => {
      const hash = window.location.hash;
      const search = hash.includes('?') ? hash.split('?')[1] : window.location.search.replace('?', '');
      const urlParams = new URLSearchParams(search);
      const ref = urlParams.get('ref');
      if (ref) {
          setReferralId(ref.toUpperCase());
          setIsReferredLogin(false);
      }
  }, [location]);

  const handleLogin = async (specificMobile?: string, specificPass?: string) => {
      const mob = specificMobile || mobile;
      const pass = specificPass || password;
      if (!mob || !pass) return;
      setError(''); setIsLoading(true);
      
      const user = authenticateUser(mob, pass);
      if (user) {
          if (user.status === 'Blocked') { setError('ID Blocked.'); setIsLoading(false); return; }
          let path = user.role === UserRole.CUSTOMER ? '/track' : user.role === UserRole.SHOWROOM ? '/showroom' : '/dashboard';
          loginUser(user.role, user.id); 
          navigate(path);
      } else { 
          setError('Wrong ID/Pin'); 
          setIsLoading(false); 
      }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center p-4 py-12 md:py-20 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-zinc-900/40 via-black to-black opacity-80 pointer-events-none fixed"></div>
      
      <div className="z-10 text-center mb-10 shrink-0">
        <h1 className="font-serif-display text-5xl mb-1 text-amber-400 tracking-tight uppercase font-bold">LORD'S</h1>
        <p className="text-zinc-500 text-[9px] uppercase font-black tracking-[0.8em]">Bespoke Tailors</p>
      </div>

      <div className="z-20 w-full max-w-sm space-y-6">
        {(!referralId || isReferredLogin) ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl relative">
              <div className="flex justify-between items-center mb-8">
                 <h3 className="text-white font-black uppercase text-xs tracking-widest flex items-center gap-2">
                    <LogIn size={16} className="text-amber-500"/> System Login
                 </h3>
                 {referralId && <button onClick={() => setIsReferredLogin(false)} className="text-[9px] text-zinc-500 hover:text-amber-500 font-bold uppercase tracking-widest underline decoration-amber-500/30 underline-offset-4">Join New</button>}
              </div>
              <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-4">
                  <input type="tel" placeholder="Access Mobile ID" value={mobile} onChange={(e) => setMobile(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-xl py-4 px-4 text-white focus:border-amber-500 outline-none font-mono" required />
                  <input type="password" placeholder="Access Password" value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-xl py-4 px-4 text-white focus:border-amber-500 outline-none" required />
                  {error && <div className="text-red-500 text-[10px] font-black text-center uppercase tracking-widest animate-pulse">{error}</div>}
                  <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-amber-600 to-amber-500 text-black font-black py-4 rounded-xl uppercase tracking-widest shadow-xl shadow-amber-900/20">
                      {isLoading ? 'Loading...' : 'SECURE ACCESS'}
                  </button>
              </form>
          </div>
        ) : (
          <JoinForm referralId={referralId} onSwitchToLogin={() => setIsReferredLogin(true)} />
        )}
      </div>
      
      <div className="z-10 mt-12 text-zinc-800 text-[10px] uppercase font-black tracking-[0.3em] opacity-40">
          Core Engine v6.5 • High Performance System
      </div>
    </div>
  );
};

export default LoginPage;
