'use client';

import { useState } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
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
    <div className="py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-8 text-white">
      
      {/* Toast Notification */}
      {addedToCartToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-500 text-black px-5 py-3 rounded-2xl font-bold shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-black" />
          <span>Added {quantity}x {product.name} to Cart!</span>
        </div>
      )}

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-muted flex-wrap">
        <Link href="/marketplace" className="hover:text-gold flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Verified Marketplace
        </Link>
        <span>/</span>
        <span className="text-slate-400">{product.category}</span>
        <span>/</span>
        <span className="text-slate-300 font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Amazon 3-Column Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* =============================================================== */}
        {/* COLUMN 1: PRODUCT IMAGES (4 cols on lg)                        */}
        {/* =============================================================== */}
        <div className="lg:col-span-5 space-y-4 sticky top-24">
          <div className="glass-panel p-4 rounded-3xl border border-white/10 relative overflow-hidden bg-slate-900/60 aspect-square flex items-center justify-center">
            {/* Badges */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
              {product.isBestSeller && (
                <span className="px-2.5 py-1 rounded bg-[#E47911] text-black font-extrabold text-[10px] uppercase tracking-wider shadow">
                  #1 Best Seller
                </span>
              )}
              <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                ✓ {product.hplcTested}
              </span>
            </div>

            <img 
              src={selectedImage} 
              alt={product.name}
              className="w-full h-full object-cover rounded-2xl hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Thumbnail Strip */}
          <div className="flex gap-3">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                  selectedImage === img ? 'border-gold shadow-gold-glow' : 'border-white/10 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Official Laboratory Certificate Banner */}
          <div className="glass-panel p-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-emerald-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Eurofins HPLC Certificate Verified
              </span>
              <span className="text-[10px] font-mono text-slate-400">{product.coaCertificateId}</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Every production lot undergoes independent HPLC potency assay. Zero amino spiking, zero heavy metal contamination (Lead &lt;0.05 ppm, Arsenic &lt;0.01 ppm).
            </p>
          </div>
        </div>

        {/* =============================================================== */}
        {/* COLUMN 2: PRODUCT DETAILS & SPECIFICATIONS (4 cols on lg)      */}
        {/* =============================================================== */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Brand & Store */}
          <div>
            <Link href={product.brandStoreUrl || '#'} className="text-xs text-gold font-bold hover:underline">
              Visit the {product.brand} Store &rarr;
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1 leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Ratings & Social Proof */}
          <div className="flex items-center gap-3 text-xs border-b border-white/10 pb-4">
            <div className="flex items-center text-amber-400 font-black">
              <span className="mr-1">{product.rating}</span>
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-slate-400">({product.ratingCount.toLocaleString()} ratings)</span>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400 font-semibold font-mono">{product.boughtPastMonth}</span>
          </div>

          {/* Amazon-style Price Block */}
          <div className="space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-rose-500">-{product.discountPercent}%</span>
              <span className="text-4xl font-black text-white">{product.price}</span>
            </div>
            <div className="text-xs text-slate-400">
              M.R.P.: <span className="line-through">{product.mrp}</span>
            </div>
            <p className="text-xs text-slate-300 pt-1">
              Inclusive of all GST taxes • EMI starts at ₹{Math.round(product.priceAmount / 12)}/month
            </p>
          </div>

          {/* Offers Carousel / Cards */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-surface border border-white/10 space-y-1">
              <strong className="text-gold block font-bold">Bank Offer</strong>
              <p className="text-slate-300 text-[11px]">Up to ₹500 off on select credit/debit cards.</p>
            </div>
            <div className="p-3 rounded-xl bg-surface border border-white/10 space-y-1">
              <strong className="text-emerald-400 block font-bold">Partner Offer</strong>
              <p className="text-slate-300 text-[11px]">Free delivery + 10% discount at verified gyms.</p>
            </div>
          </div>

          {/* Flavor Variant Selector */}
          {product.flavors && product.flavors.length > 0 && (
            <div className="space-y-2 border-t border-white/10 pt-4">
              <label className="text-xs font-bold text-slate-300 block">
                Flavor: <span className="text-gold">{selectedFlavor}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.flavors.map((flv) => (
                  <button
                    key={flv}
                    onClick={() => setSelectedFlavor(flv)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      selectedFlavor === flv
                        ? 'bg-gold/15 border-gold text-gold shadow-sm'
                        : 'bg-surface/50 border-white/10 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    {flv}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Variant Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">
                Size / Weight: <span className="text-gold">{selectedSize}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      selectedSize === sz
                        ? 'bg-gold/15 border-gold text-gold shadow-sm'
                        : 'bg-surface/50 border-white/10 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* About this item (Amazon Style) */}
          <div className="space-y-3 border-t border-white/10 pt-4">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-300">About this item</h3>
            <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
              {product.features.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0 mt-1.5"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Description */}
          <div className="border-t border-white/10 pt-4 text-xs text-slate-400 leading-relaxed">
            <p>{product.description}</p>
          </div>

        </div>

        {/* =============================================================== */}
        {/* COLUMN 3: THE AMAZON BUY BOX (3 cols on lg)                    */}
        {/* =============================================================== */}
        <div className="lg:col-span-3">
          <div className="glass-panel p-6 rounded-3xl border border-white/15 bg-slate-900/90 shadow-2xl space-y-5 sticky top-24">
            
            {/* Price in Buy Box */}
            <div>
              <div className="text-2xl font-black text-white">
                ₹ {currentPrice.toLocaleString()}
              </div>
              <span className="text-xs font-bold text-emerald-400 block mt-1">
                ✓ FREE Delivery Tomorrow, 2 PM - 6 PM
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Order within 3 hrs 15 mins.
              </span>
            </div>

            {/* Delivery Pincode */}
            <div className="text-xs space-y-1.5 pt-2 border-t border-white/10">
              <div className="flex items-center gap-1 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
                <span>Deliver to <strong>Aniket - {pincode}</strong></span>
              </div>
              <span className="text-[11px] text-emerald-400 font-semibold block">
                ✓ In stock. Fast delivery available.
              </span>
            </div>

            {/* Stock Availability */}
            <div className="text-sm font-black">
              {product.stockNumber > 10 ? (
                <span className="text-emerald-400">In Stock</span>
              ) : (
                <span className="text-amber-400">Only {product.stockNumber} left in stock - order soon.</span>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center justify-between text-xs bg-background p-2.5 rounded-xl border border-white/10">
              <span className="text-slate-300 font-semibold">Quantity:</span>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 rounded-lg bg-surface hover:bg-surfaceHover text-white font-bold flex items-center justify-center border border-white/10"
                >
                  -
                </button>
                <span className="font-bold text-white w-5 text-center font-mono">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(product.stockNumber, quantity + 1))}
                  className="w-7 h-7 rounded-lg bg-surface hover:bg-surfaceHover text-white font-bold flex items-center justify-center border border-white/10"
                >
                  +
                </button>
              </div>
            </div>

            {/* Athloboard Lift Points Loyalty Discount */}
            <div className="p-3 rounded-xl bg-gold/10 border border-gold/30 text-xs space-y-1.5">
              <div className="flex items-center justify-between font-bold text-gold">
                <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5" /> Athloboard Lift Points</span>
                <span className="font-mono">1,200 Pts</span>
              </div>
              <label className="flex items-center gap-2 text-[11px] text-slate-200 cursor-pointer pt-1">
                <input 
                  type="checkbox" 
                  checked={applyPoints}
                  onChange={(e) => setApplyPoints(e.target.checked)}
                  className="w-3.5 h-3.5 accent-amber-500 rounded cursor-pointer"
                />
                <span>Redeem 500 points for <strong>₹500 instant off</strong></span>
              </label>
            </div>

            {/* Amazon Buy Box Action Buttons */}
            <div className="space-y-3 pt-2">
              {/* Add to Cart Button (Amazon Yellow) */}
              <button
                onClick={handleAddToCart}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-black bg-[#FFD814] hover:bg-[#F7CA00] shadow-sm text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </button>

              {/* Buy Now Button (Amazon Orange) */}
              <button
                onClick={() => setIsBuyModalOpen(true)}
                className="w-full py-3.5 px-4 rounded-xl font-black text-black bg-[#FFA41C] hover:bg-[#FA8900] shadow-[0_0_20px_rgba(255,164,28,0.35)] text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
              >
                <Lock className="w-4 h-4" />
                Buy Now
              </button>
            </div>

            {/* Safety Badges */}
            <div className="pt-3 border-t border-white/10 text-[11px] text-muted space-y-1.5">
              <div className="flex justify-between">
                <span>Ships from</span>
                <strong className="text-white">{product.fulfilledBy}</strong>
              </div>
              <div className="flex justify-between">
                <span>Sold by</span>
                <strong className="text-gold truncate max-w-[150px]">{product.soldBy}</strong>
              </div>
              <div className="flex justify-between">
                <span>Returns</span>
                <strong className="text-white">7-Day Replacement</strong>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold pt-1">
                <Lock className="w-3 h-3" /> Secure 256-bit Transaction
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Embedded Amazon Buy Modal / Checkout Flow */}
      <AmazonBuyModal 
        product={product}
        isOpen={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
      />

    </div>
  );
}
