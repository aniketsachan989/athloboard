import { Check, ShieldCheck, Tag, ShoppingCart } from 'lucide-react';

export default function MarketplacePage() {
  const products = [
    {
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

  return (
    <div className="py-12 px-6 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Verified Sports Nutrition & Gear</h1>
        <p className="text-muted text-sm mt-1">Every product independently audited with laboratory HPLC certificates</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {products.map((p, idx) => (
          <div key={idx} className="glass-panel p-6 rounded-3xl glass-panel-hover flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-400 font-bold text-[10px]">
                  ✓ {p.hplcTested}
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
                <div>Weight: <strong className="text-white">{p.weight}</strong></div>
                <div>Specs: <strong className="text-white">{p.servings}</strong></div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
              <div className="text-xl font-black text-white">{p.price}</div>
              <button className="px-4 py-2 rounded-lg bg-gold text-black text-xs font-black flex items-center gap-1.5">
                <ShoppingCart className="w-3.5 h-3.5" /> Buy Verified
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
