'use client';

import { MapPin, Star, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function GymsDirectoryPage() {
  const fallbackGyms = [
    {
      _id: '1',
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
      _id: '2',
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
      _id: '3',
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
    {
      _id: '4',
      name: 'Titan Athletic Performance',
      city: 'Jubilee Hills, Hyderabad',
      rating: '4.9',
      reviews: 112,
      plates: '3,500 kg',
      dumbbells: '65 kg',
      trainers: '4 Male, 2 Female',
      status: 'Audited Gold',
      pricing: '₹ 2,750 / mo',
    },
    {
      _id: '5',
      name: 'Apex Power & Barbell Lab',
      city: 'Koregaon Park, Pune',
      rating: '4.8',
      reviews: 86,
      plates: '2,900 kg',
      dumbbells: '60 kg',
      trainers: '3 Male, 2 Female',
      status: 'Audited Gold',
      pricing: '₹ 2,399 / mo',
    },
    {
      _id: '6',
      name: 'Olympus Strength Sanctuary',
      city: 'Salt Lake Sector V, Kolkata',
      rating: '4.9',
      reviews: 104,
      plates: '3,100 kg',
      dumbbells: '65 kg',
      trainers: '4 Male, 2 Female',
      status: 'Audited Gold',
      pricing: '₹ 2,299 / mo',
    },
  ];

  const [gyms, setGyms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    document.title = 'Find Verified Gyms | Athloboard';
    
    const fetchGyms = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'}/api/gyms`);
        if (res.ok) {
          const data = await res.json();
          setGyms(data.length > 0 ? data : fallbackGyms);
        } else {
          setGyms(fallbackGyms);
        }
      } catch (err) {
        setGyms(fallbackGyms);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGyms();
  }, []);

  const filteredGyms = gyms.filter(gym => 
    gym.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    gym.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="py-12 px-4 sm:px-6 max-w-7xl mx-auto space-y-8 text-gray-900">
      <div>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-950">
          Audited Gyms <span className="text-fitRed">Directory</span>
        </h1>
        <p className="text-gray-600 text-sm mt-1">Verified plate inventories, calibrated weights, and certified coaching staff</p>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by gym name, city, or equipment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 text-sm focus:border-fitRed outline-none shadow-sm transition-colors placeholder:text-gray-400"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white p-6 rounded-3xl h-64 animate-pulse border border-gray-200 shadow-sm" />
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {filteredGyms.map((gym, idx) => (
            <div key={gym._id || idx} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <span className="px-2.5 py-1 rounded bg-red-50 text-fitRed border border-red-200 font-black text-[10px] uppercase">
                    {gym.status || 'Audited Gold'}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-gray-900">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {gym.rating || '4.9'} ({gym.reviews || 0})
                  </div>
                </div>

                <h2 className="text-xl font-bold text-gray-950 mt-4">{gym.name}</h2>
                <div className="flex items-center gap-1.5 text-gray-500 text-xs mt-1">
                  <MapPin className="w-3.5 h-3.5 text-fitRed flex-shrink-0" /> {gym.city || (gym.location?.city + ', ' + gym.location?.state) || 'Unknown Location'}
                </div>

                <div className="grid grid-cols-2 gap-2 mt-6 p-3 rounded-xl bg-gray-50 border border-gray-200 text-[11px] text-gray-600">
                  <div>Plates: <strong className="text-gray-950">{gym.plates || gym.equipmentInventory?.plates || 'N/A'}</strong></div>
                  <div>DB Max: <strong className="text-gray-950">{gym.dumbbells || gym.equipmentInventory?.dumbbellsMax || 'N/A'}</strong></div>
                  <div className="col-span-2">Staff: <strong className="text-gray-950">{gym.trainers || 'N/A'}</strong></div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-500">From</span>
                  <div className="font-bold text-gray-950 text-sm">{gym.pricing || 'Contact Gym'}</div>
                </div>
                <Link href={`/gyms/${gym._id || gym.id || '#'}`} className="px-4 py-2 rounded-lg bg-fitRed hover:bg-fitRed-hover text-white text-xs font-bold transition-all shadow-sm">
                  View Specs
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
