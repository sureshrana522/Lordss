
import React from 'react';
import { useApp } from '../context/AppContext';
import { Image, ArrowLeft, Search, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GalleryPage = () => {
  const { galleryItems } = useApp();
  const navigate = useNavigate();

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen">
       <div className="mb-8 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 bg-zinc-800 rounded-full text-zinc-400 hover:text-white">
             <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl md:text-4xl font-serif-display text-white mb-2">Design Gallery</h1>
            <p className="text-zinc-400">Exclusive Bespoke Collection & Patterns</p>
          </div>
       </div>

       {/* Search & Filter */}
       <div className="flex gap-4 mb-8">
           <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
              <input 
                 type="text" 
                 placeholder="Search designs..." 
                 className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-white outline-none focus:border-amber-500"
              />
           </div>
           <button className="px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white font-bold hover:bg-zinc-800">
              Filter
           </button>
       </div>

       {/* Gallery Grid */}
       {galleryItems.length > 0 ? (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {galleryItems.map(item => (
                <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden group hover:border-amber-500/50 transition-all">
                    <div className="relative aspect-[3/4] overflow-hidden bg-zinc-950">
                        <img 
                          src={item.imageUrl} 
                          alt={item.type} 
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                        <div className="absolute bottom-4 left-4">
                           <span className="bg-amber-500 text-black text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest">{item.code}</span>
                        </div>
                    </div>
                    <div className="p-4">
                        <h3 className="text-lg font-bold text-white mb-1">{item.type}</h3>
                        <div className="flex justify-between items-center mt-2">
                           <div>
                              <p className="text-[10px] text-zinc-500 uppercase font-bold">Price</p>
                              <p className="text-emerald-400 font-mono font-bold">₹{item.customerPrice}</p>
                           </div>
                           <button className="p-2 bg-zinc-800 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-700">
                              <Plus size={20} />
                           </button>
                        </div>
                    </div>
                </div>
            ))}
         </div>
       ) : (
         <div className="text-center py-20 bg-zinc-900/50 border border-dashed border-zinc-800 rounded-2xl">
             <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-600">
                 <Image size={32} />
             </div>
             <h3 className="text-xl font-bold text-zinc-400">Gallery is Empty</h3>
             <p className="text-zinc-600 text-sm mt-2">Upload designs from Admin Panel to showcase here.</p>
         </div>
       )}
    </div>
  );
};

export default GalleryPage;
