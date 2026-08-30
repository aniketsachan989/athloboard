import { Dumbbell, MapPin, Star, ShieldCheck, Search } from 'lucide-react';

export default function GymsDirectoryPage() {
  const gyms = [
    {
      name: 'Iron Pulse Strength & Conditioning',
      city: 'South Extension II, New Delhi',
      rating: '4.9',
      reviews: 128,
      plates: '3,200 kg',
      dumbbells: '65 kg',
      trainers: '4 Male, 2 Female',
      status: 'Audited Gold',
      pricing: '₹ 2,499 / mo',
    },
    {
      name: 'Barbell Club India',
      city: 'Bandra West, Mumbai',
      rating: '4.8',
      reviews: 94,
      plates: '2,800 kg',
      dumbbells: '60 kg',
      trainers: '3 Male, 1 Female',
      status: 'Audited Gold',
      pricing: '₹ 3,200 / mo',
    },
    {
      name: 'Spartan Strength Lab',
      city: 'Indiranagar, Bengaluru',
      rating: '4.9',
      reviews: 156,
      plates: '4,100 kg',
      dumbbells: '70 kg',
      trainers: '5 Male, 3 Female',
      status: 'Audited Gold',
      pricing: '₹ 2,800 / mo',
    },
  ];

  return (
    <div className="py-12 px-6 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Audited Gyms Directory</h1>
        <p className="text-muted text-sm mt-1">Verified plate inventories, calibrated weights, and certified coaching staff</p>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by gym name, city, or equipment..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface border border-white/10 text-white text-sm focus:border-gold outline-none"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {gyms.map((gym, idx) => (
          <div key={idx} className="glass-panel p-6 rounded-3xl glass-panel-hover flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <span className="px-2.5 py-1 rounded bg-gold/10 text-gold border border-gold/30 font-black text-[10px] uppercase">
                  {gym.status}
                </span>
                <div className="flex items-center gap-1 text-xs font-bold text-gold">
                  <Star className="w-3.5 h-3.5 fill-gold" /> {gym.rating} ({gym.reviews})
                </div>
              </div>

              <h2 className="text-xl font-bold text-white mt-4">{gym.name}</h2>
              <div className="flex items-center gap-1.5 text-muted text-xs mt-1">
                <MapPin className="w-3.5 h-3.5 text-gold flex-shrink-0" /> {gym.city}
              </div>

              <div className="grid grid-cols-2 gap-2 mt-6 p-3 rounded-xl bg-background border border-white/5 text-[11px] text-muted">
                <div>Plates: <strong className="text-white">{gym.plates}</strong></div>
                <div>DB Max: <strong className="text-white">{gym.dumbbells}</strong></div>
                <div className="col-span-2">Staff: <strong className="text-white">{gym.trainers}</strong></div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
              <div>
                <span className="text-xs text-muted">From</span>
                <div className="font-bold text-white text-sm">{gym.pricing}</div>
              </div>
              <button className="px-4 py-2 rounded-lg bg-surface hover:bg-surfaceHover border border-white/10 text-white text-xs font-bold">
                View Specs
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
