'use client';

import { ShoppingCart } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function MarketplacePage() {
  const fallbackProducts = [
    {
      _id: '1',
      name: 'Pure Whey Isolate 100% (2kg)',
      brand: 'Titan Nutrition India',
      category: 'Proteins',
      price: '₹ 4,499',
      servings: '66 Servings',
      weight: '2.0 kg',
      hplcTested: '94.2% Pure HPLC',
      isSponsored: true,
    },
    {
      _id: '2',
      name: 'Creapure Micronized Creatine (300g)',
      brand: 'IronForge Lab',
      category: 'Performance',
      price: '₹ 1,199',
      servings: '100 Servings',
      weight: '300 g',
      hplcTested: '99.9% Creapure',
      isSponsored: false,
    },
    {
      _id: '3',
      name: 'IPF Approved 13mm Lever Belt',
      brand: 'GritGear Athletic',
      category: 'Lifting Gear',
      price: '₹ 6,899',
      servings: 'Lifetime Warranty',
      weight: '1.4 kg',
      hplcTested: 'IPF Sanctioned',
      isSponsored: true,
    },
  ];

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Marketplace | Athloboard';
    
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'}/api/products`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data.length > 0 ? data : fallbackProducts);
        } else {
          setProducts(fallbackProducts);
        }
      } catch (err) {
        setProducts(fallbackProducts);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  return (
    <div className="py-12 px-6 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Verified Sports Nutrition & Gear</h1>
        <p className="text-muted text-sm mt-1">Every product independently audited with laboratory HPLC certificates</p>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass-panel p-6 rounded-3xl h-64 animate-pulse bg-white/5" />
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {products.map((p, idx) => (
            <div key={p._id || idx} className="glass-panel p-6 rounded-3xl glass-panel-hover flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-400 font-bold text-[10px]">
                    ✓ {p.hplcTested || 'Lab Verified'}
                  </span>
                  {p.isSponsored && (
                    <span className="px-2 py-0.5 rounded bg-gold/10 text-gold font-bold text-[10px]">
                      FEATURED
                    </span>
                  )}
                </div>

                <h2 className="text-lg font-bold text-white mt-4">{p.name}</h2>
                <p className="text-xs text-gold font-semibold mt-0.5">{p.brand}</p>

                <div className="grid grid-cols-2 gap-2 mt-4 p-3 rounded-xl bg-background border border-white/5 text-[11px] text-muted">
                  <div>Weight: <strong className="text-white">{p.weight || 'N/A'}</strong></div>
                  <div>Specs: <strong className="text-white">{p.servings || 'N/A'}</strong></div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="text-xl font-black text-white">{p.price || (p.priceAmount ? `₹ ${p.priceAmount}` : 'TBA')}</div>
                <Link href={`/marketplace/${p._id || p.id || '#'}`} className="px-4 py-2 rounded-lg bg-gold text-black text-xs font-black flex items-center gap-1.5 transition-transform hover:scale-105">
                  <ShoppingCart className="w-3.5 h-3.5" /> Buy Verified
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
