import React, { useState } from 'react';
import { X, Loader2, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ManualReleasePanelProps {
    onClose: () => void;
    onAction: (msg: string, type: 'success' | 'error') => void;
}

const ManualReleasePanel: React.FC<ManualReleasePanelProps> = ({ onClose, onAction }) => {
    const { releaseFundsManually } = useApp();
    const [userId, setUserId] = useState('');
    const [amount, setAmount] = useState('');
    const [walletType, setWalletType] = useState('Booking');
    const [loading, setLoading] = useState(false);

    const handleRelease = async () => {
        if (!userId || !amount) {
            return onAction("Please fill User ID and Amount", "error");
        }
        setLoading(true);
        const success = await releaseFundsManually(
            userId.toUpperCase(),
            parseInt(amount),
            walletType,
            'Admin Manual Adjustment (COD Style)'
        );
        if (success) {
            onAction(`₹${amount} added to ${userId} Successfully!`, "success");
            onClose();
        } else {
            onAction("Invalid User ID or Error", "error");
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-serif-display text-white tracking-widest uppercase">Manual Fund Add</h2>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full text-zinc-500 transition-colors">
                        <X size={24}/>
                    </button>
                </div>
                <div className="space-y-5">
                    <input
                        type="text"
                        placeholder="LBT-XXXX"
                        className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-white focus:border-amber-500 outline-none font-mono uppercase"
                        value={userId}
                        onChange={e => setUserId(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Amount ₹"
                        className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-white focus:border-amber-500 outline-none font-mono"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                    />
                    <select
                        className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-white outline-none"
                        value={walletType}
                        onChange={e => setWalletType(e.target.value)}
                    >
                        <option value="Booking">Booking Wallet</option>
                        <option value="Daily">Daily Income</option>
                        <option value="Upline">Direct Bonus</option>
                        <option value="Magic">Magic Matrix</option>
                    </select>
                </div>
                <button
                    disabled={loading}
                    onClick={handleRelease}
                    className="w-full mt-8 bg-[#0ea5e9] hover:bg-blue-400 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all uppercase tracking-widest shadow-xl shadow-blue-900/20 active:scale-95"
                >
                    {loading ? <Loader2 className="animate-spin" /> : <><Send size={18} /> CREDIT FUNDS INSTANTLY</>}
                </button>
            </div>
        </div>
    );
};

export default ManualReleasePanel;
