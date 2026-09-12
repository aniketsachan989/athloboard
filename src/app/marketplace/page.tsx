'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ALL_PRODUCTS, Product } from '@/lib/products-data';
import AmazonBuyModal from '@/components/marketplace/AmazonBuyModal';
import { 
  ShoppingCart, ShieldCheck, Star, Sparkles, 
  Search, SlidersHorizontal, Lock, ArrowRight, Eye, CheckCircle2 
} from 'lucide-react';

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>(ALL_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Amazon Buy Modal State
  const [selectedProductForBuy, setSelectedProductForBuy] = useState<Product | null>(null);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);

  useEffect(() => {
    document.title = 'Verified Marketplace | Athloboard';
    
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'}/api/products`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            // Merge backend data with rich catalog
            setProducts(data);
          } else {
            setProducts(ALL_PRODUCTS);
          }
        } else {
          setProducts(ALL_PRODUCTS);
        }
      } catch (err) {
        setProducts(ALL_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  const categories = ['All', 'Proteins', 'Performance', 'Lifting Gear', 'Weights', 'Barbells', 'Recovery'];

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'All' || (p.category && p.category.toLowerCase() === selectedCategory.toLowerCase());
    const matchesSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleOpenBuyModal = (p: Product) => {
    setSelectedProductForBuy(p);
    setIsBuyModalOpen(true);
  };

  return (
    <div className="py-12 px-4 sm:px-6 max-w-7xl mx-auto space-y-8 text-white">
      
      {/* Marketplace Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% Laboratory HPLC Tested & Authenticated
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Verified Athletic <span className="text-gold">Marketplace</span>
          </h1>
          <p className="text-muted text-sm sm:text-base mt-1.5 max-w-2xl">
            Amazon-style 1-click checkout with Athloboard Lift Points redemption. Every supplement is independently tested for purity, protein content, and zero heavy metals.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search whey, creatine, belts..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface border border-white/10 text-white text-xs outline-none focus:border-gold placeholder:text-slate-500 transition-colors"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-gold text-black shadow-gold-glow'
                : 'bg-surface hover:bg-surfaceHover text-slate-300 border border-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="glass-panel p-6 rounded-3xl h-80 animate-pulse bg-white/5" />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-3xl border border-white/10">
          <p className="text-muted text-base">No verified products found matching your search.</p>
          <button 
            onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
            className="mt-4 px-4 py-2 rounded-xl bg-surface hover:bg-surfaceHover text-xs font-bold text-gold"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p) => {
            const displayPrice = p.price || (p.priceAmount ? `₹ ${p.priceAmount.toLocaleString()}` : 'TBA');
            const displayMrp = p.mrp || (p.mrpAmount ? `₹ ${p.mrpAmount.toLocaleString()}` : '');

            return (
              <div 
                key={p._id} 
                className="glass-panel p-5 sm:p-6 rounded-3xl glass-panel-hover flex flex-col justify-between border border-white/10 hover:border-white/20 transition-all group"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex justify-between items-start">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/30 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      {p.hplcTested || 'HPLC Verified'}
                    </span>
                    {p.isSponsored && (
                      <span className="px-2 py-0.5 rounded bg-gold/15 text-gold font-black text-[10px] tracking-wider">
                        FEATURED
                      </span>
                    )}
                  </div>

                  {/* Thumbnail Visual */}
                  {p.images && p.images.length > 0 && (
                    <div className="mt-4 h-48 rounded-2xl overflow-hidden bg-slate-900/80 border border-white/5 relative group-hover:scale-[1.02] transition-transform">
                      <img 
                        src={p.images[0]} 
                        alt={p.name} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-[10px] font-mono text-emerald-400 font-bold">
                        {p.boughtPastMonth || '1K+ bought'}
                      </div>
                    </div>
                  )}

                  {/* Product Title & Brand */}
                  <h2 className="text-base sm:text-lg font-bold text-white mt-4 line-clamp-2 leading-snug group-hover:text-gold transition-colors">
                    {p.name}
                  </h2>
                  <p className="text-xs text-gold font-semibold mt-1">{p.brand}</p>

                  {/* Amazon Rating Stars */}
                  <div className="flex items-center gap-2 mt-2 text-xs">
                    <div className="flex items-center text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 inline mr-1" />
                      {p.rating || 4.8}
                    </div>
                    <span className="text-slate-400 text-[11px]">({(p.ratingCount || 1200).toLocaleString()})</span>
                    <span className="text-[11px] text-emerald-400 font-semibold ml-auto">FREE Tomorrow</span>
                  </div>

                  {/* Specs Pill Box */}
                  <div className="grid grid-cols-2 gap-2 mt-3.5 p-2.5 rounded-xl bg-background/80 border border-white/5 text-[11px] text-muted">
                    <div>Weight: <strong className="text-white">{p.weight || 'N/A'}</strong></div>
                    <div>Specs: <strong className="text-white">{p.servings || 'N/A'}</strong></div>
                  </div>
                </div>

                {/* Bottom Price & Amazon-Style Buy Button */}
                <div className="mt-5 pt-4 border-t border-white/5">
                  <div className="flex items-baseline justify-between mb-3">
                    <div>
                      <div className="text-xl font-black text-white">{displayPrice}</div>
                      {displayMrp && (
                        <div className="text-[11px] text-slate-400 line-through">
                          M.R.P.: {displayMrp}
                        </div>
                      )}
                    </div>
                    {p.discountPercent && (
                      <span className="text-xs font-bold text-rose-400 bg-rose-950/50 px-2 py-0.5 rounded border border-rose-800/40">
                        {p.discountPercent}% OFF
                      </span>
                    )}
                  </div>

                  {/* 2 Action Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    {/* View Full Amazon Specs Page */}
                    <Link
                      href={`/marketplace/${p._id || p.id}`}
                      className="py-2.5 px-3 rounded-xl bg-surface hover:bg-surfaceHover border border-white/10 text-xs font-bold text-slate-200 flex items-center justify-center gap-1 transition-colors text-center"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      Details
                    </Link>

                    {/* Instant Amazon Buy Box Modal */}
                    <button 
                      onClick={() => handleOpenBuyModal(p)}
                      className="py-2.5 px-3 rounded-xl bg-[#FFA41C] hover:bg-[#FA8900] text-black text-xs font-black flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(255,164,28,0.25)] transition-all hover:scale-105 active:scale-95"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" /> Buy Now
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Global Interactive Amazon Buy Modal */}
      <AmazonBuyModal 
        product={selectedProductForBuy}
        isOpen={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
      />

    </div>
  );
}
