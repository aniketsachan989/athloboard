'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getProductById, ALL_PRODUCTS, Product } from '@/lib/products-data';
import AmazonBuyModal from '@/components/marketplace/AmazonBuyModal';
import { 
  Star, ShieldCheck, CheckCircle2, Truck, RotateCcw, 
  Lock, MapPin, Award, ShoppingCart, ArrowLeft, 
  Sparkles, Check, Share2, Heart, ChevronRight 
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = (params?.id as string) || '1';
  const product: Product = getProductById(productId) || ALL_PRODUCTS[0];

  // States
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [selectedFlavor, setSelectedFlavor] = useState(product.flavors ? product.flavors[0] : '');
  const [selectedSize, setSelectedSize] = useState(product.sizes ? product.sizes[0] : '');
  const [quantity, setQuantity] = useState(1);
  const [applyPoints, setApplyPoints] = useState(false);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [addedToCartToast, setAddedToCartToast] = useState(false);

  // Delivery Pincode
  const [pincode, setPincode] = useState('110049');

  const pointsDiscount = applyPoints ? 500 : 0;
  const currentPrice = product.priceAmount * quantity - pointsDiscount;

  const handleAddToCart = () => {
    setAddedToCartToast(true);
    setTimeout(() => setAddedToCartToast(false), 3500);
  };

  return (
    <div className="py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-8 text-gray-900">
      
      {/* Toast Notification */}
      {addedToCartToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl font-bold shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span>Added {quantity}x {product.name} to Cart!</span>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
        <Link href="/marketplace" className="hover:text-fitRed transition-colors flex items-center gap-1 font-semibold">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Verified Store
        </Link>
        <span>/</span>
        <span className="text-gray-600">{product.category}</span>
        <span>/</span>
        <span className="text-gray-900 font-bold truncate max-w-xs">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Product Gallery & HPLC Certificate */}
        <div className="lg:col-span-5 space-y-4 sticky top-24">
          <div className="p-4 rounded-3xl border border-gray-200 bg-white shadow-sm relative overflow-hidden aspect-square flex items-center justify-center">
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
              {product.isBestSeller && (
                <span className="px-2.5 py-1 rounded bg-[#E47911] text-white font-extrabold text-[10px] uppercase tracking-wider shadow">
                  #1 Best Seller
                </span>
              )}
              <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                ✓ {product.hplcTested}
              </span>
            </div>

            <img 
              src={selectedImage} 
              alt={product.name}
              className="w-full h-full object-cover rounded-2xl hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Thumbnail Selection */}
          <div className="flex gap-3">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                  selectedImage === img ? 'border-fitRed shadow-md scale-105' : 'border-gray-200 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* HPLC Certificate Badge */}
          <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/60 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-emerald-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Eurofins HPLC Certificate Verified
              </span>
              <span className="text-[10px] font-mono text-gray-500">{product.coaCertificateId}</span>
            </div>
            <p className="text-[11px] text-gray-700 leading-relaxed">
              Every production lot undergoes independent HPLC potency assay. Zero amino spiking, zero heavy metal contamination (Lead &lt;0.05 ppm, Arsenic &lt;0.01 ppm).
            </p>
          </div>
        </div>

        {/* Center Column: Product Specs & Options */}
        <div className="lg:col-span-4 space-y-6">
          <div>
            <Link href={product.brandStoreUrl || '#'} className="text-xs text-fitRed font-bold hover:underline">
              Visit the {product.brand} Store &rarr;
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-950 mt-1 leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Ratings & Social Proof */}
          <div className="flex items-center gap-3 text-xs border-b border-gray-200 pb-4">
            <div className="flex items-center text-amber-500 font-black">
              <span className="mr-1">{product.rating}</span>
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-gray-500">({product.ratingCount.toLocaleString()} ratings)</span>
            <span className="text-gray-300">|</span>
            <span className="text-emerald-700 font-semibold font-mono">{product.boughtPastMonth}</span>
          </div>

          {/* Pricing Section */}
          <div className="space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-fitRed">-{product.discountPercent}%</span>
              <span className="text-4xl font-black text-gray-950">{product.price}</span>
            </div>
            <div className="text-xs text-gray-500">
              M.R.P.: <span className="line-through">{product.mrp}</span>
            </div>
            <p className="text-xs text-gray-600 pt-1">
              Inclusive of all GST taxes • EMI starts at ₹{Math.round(product.priceAmount / 12)}/month
            </p>
          </div>

          {/* Promotional Banners */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
              <strong className="text-fitRed block font-bold">Bank Offer</strong>
              <p className="text-gray-600 text-[11px]">Up to ₹500 off on select credit/debit cards.</p>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
              <strong className="text-emerald-700 block font-bold">Partner Offer</strong>
              <p className="text-gray-600 text-[11px]">Free delivery + 10% discount at verified gyms.</p>
            </div>
          </div>

          {/* Flavors Selector */}
          {product.flavors && product.flavors.length > 0 && (
            <div className="space-y-2 border-t border-gray-200 pt-4">
              <label className="text-xs font-bold text-gray-700 block">
                Flavor: <span className="text-fitRed">{selectedFlavor}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.flavors.map((flv) => (
                  <button
                    key={flv}
                    onClick={() => setSelectedFlavor(flv)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      selectedFlavor === flv
                        ? 'bg-red-50 border-fitRed text-fitRed shadow-sm'
                        : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {flv}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sizes Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 block">
                Size / Weight: <span className="text-fitRed">{selectedSize}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      selectedSize === sz
                        ? 'bg-red-50 border-fitRed text-fitRed shadow-sm'
                        : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Features Checklist */}
          <div className="space-y-3 border-t border-gray-200 pt-4">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-gray-900">About this item</h3>
            <ul className="space-y-2 text-xs text-gray-700 leading-relaxed">
              {product.features.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-fitRed shrink-0 mt-1.5"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Description */}
          <div className="border-t border-gray-200 pt-4 text-xs text-gray-600 leading-relaxed">
            <p>{product.description}</p>
          </div>

        </div>

        {/* Right Column: Amazon-Style Buy Box */}
        <div className="lg:col-span-3">
          <div className="p-6 rounded-3xl border border-gray-200 bg-white shadow-xl space-y-5 sticky top-24">
            <div>
              <div className="text-2xl font-black text-gray-950">
                ₹ {currentPrice.toLocaleString()}
              </div>
              <span className="text-xs font-bold text-emerald-700 block mt-1">
                ✓ FREE Delivery Tomorrow, 2 PM - 6 PM
              </span>
              <span className="text-[11px] text-gray-500 block mt-0.5">
                Order within 3 hrs 15 mins.
              </span>
            </div>

            <div className="text-xs space-y-1.5 pt-2 border-t border-gray-200">
              <div className="flex items-center gap-1 text-gray-700">
                <MapPin className="w-3.5 h-3.5 text-fitRed shrink-0" />
                <span>Deliver to <strong>Aniket - {pincode}</strong></span>
              </div>
              <span className="text-[11px] text-emerald-700 font-semibold block">
                ✓ In stock. Fast delivery available.
              </span>
            </div>

            <div className="text-sm font-black">
              {product.stockNumber > 10 ? (
                <span className="text-emerald-700">In Stock</span>
              ) : (
                <span className="text-amber-600">Only {product.stockNumber} left in stock - order soon.</span>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center justify-between text-xs bg-gray-50 p-2.5 rounded-xl border border-gray-200">
              <span className="text-gray-700 font-semibold">Quantity:</span>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 rounded-lg bg-white hover:bg-gray-100 text-gray-900 font-bold flex items-center justify-center border border-gray-300 shadow-sm"
                >
                  -
                </button>
                <span className="font-bold text-gray-950 w-5 text-center font-mono">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(product.stockNumber, quantity + 1))}
                  className="w-7 h-7 rounded-lg bg-white hover:bg-gray-100 text-gray-900 font-bold flex items-center justify-center border border-gray-300 shadow-sm"
                >
                  +
                </button>
              </div>
            </div>

            {/* Lift Points Redemption */}
            <div className="p-3 rounded-xl bg-red-50/60 border border-red-200 text-xs space-y-1.5">
              <div className="flex items-center justify-between font-bold text-fitRed">
                <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5" /> Athloboard Lift Points</span>
                <span className="font-mono">1,200 Pts</span>
              </div>
              <label className="flex items-center gap-2 text-[11px] text-gray-700 cursor-pointer pt-1">
                <input 
                  type="checkbox" 
                  checked={applyPoints}
                  onChange={(e) => setApplyPoints(e.target.checked)}
                  className="w-3.5 h-3.5 accent-fitRed rounded cursor-pointer"
                />
                <span>Redeem 500 points for <strong>₹500 instant off</strong></span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleAddToCart}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-black bg-[#FFD814] hover:bg-[#F7CA00] shadow-sm text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </button>

              <button
                onClick={() => setIsBuyModalOpen(true)}
                className="w-full py-3.5 px-4 rounded-xl font-black text-black bg-[#FFA41C] hover:bg-[#FA8900] shadow-md text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
              >
                <Lock className="w-4 h-4" />
                Buy Now
              </button>
            </div>

            {/* Shipping & Returns Details */}
            <div className="pt-3 border-t border-gray-200 text-[11px] text-gray-500 space-y-1.5">
              <div className="flex justify-between">
                <span>Ships from</span>
                <strong className="text-gray-900">{product.fulfilledBy}</strong>
              </div>
              <div className="flex justify-between">
                <span>Sold by</span>
                <strong className="text-fitRed truncate max-w-[150px]">{product.soldBy}</strong>
              </div>
              <div className="flex justify-between">
                <span>Returns</span>
                <strong className="text-gray-900">7-Day Replacement</strong>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-700 font-semibold pt-1">
                <Lock className="w-3 h-3" /> Secure 256-bit Transaction
              </div>
            </div>

          </div>
        </div>

      </div>

      <AmazonBuyModal 
        product={product}
        isOpen={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
      />

    </div>
  );
}
