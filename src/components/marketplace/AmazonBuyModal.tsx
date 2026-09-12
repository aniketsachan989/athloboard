'use client';

import { useState } from 'react';
import { Product } from '@/lib/products-data';
import { 
  X, ShieldCheck, CheckCircle2, Star, Truck, MapPin, 
  CreditCard, Smartphone, Check, Lock, ArrowRight, 
  RotateCcw, Sparkles, Award, ChevronRight, ShoppingCart 
} from 'lucide-react';
import Link from 'next/link';

interface AmazonBuyModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onOrderComplete?: (order: any) => void;
}

export default function AmazonBuyModal({ product, isOpen, onClose, onOrderComplete }: AmazonBuyModalProps) {
  if (!isOpen || !product) return null;

  // Checkout Steps: 'product-preview' -> 'address-and-payment' -> 'order-confirmed'
  const [checkoutStep, setCheckoutStep] = useState<'preview' | 'checkout' | 'confirmed'>('preview');

  // Variant States
  const [selectedFlavor, setSelectedFlavor] = useState(product.flavors ? product.flavors[0] : '');
  const [selectedSize, setSelectedSize] = useState(product.sizes ? product.sizes[0] : '');
  const [quantity, setQuantity] = useState(1);
  const [applyPoints, setApplyPoints] = useState(false);
  const pointsAvailable = 1200;
  const pointsToRedeem = 500;
  const pointsDiscountValue = applyPoints ? 500 : 0;

  // Delivery Pincode State
  const [pincode, setPincode] = useState('110049');
  const [isPincodeValid, setIsPincodeValid] = useState(true);

  // Address State
  const [shippingAddress, setShippingAddress] = useState({
    fullName: 'Aniket Sachan',
    phone: '+91 98765 43210',
    flat: 'Flat 402, Iron Heights',
    area: 'South Extension Part II',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110049',
  });
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'points' | 'cod'>('upi');
  const [upiApp, setUpiApp] = useState('gpay');

  // Order Details (Generated on confirm)
  const [confirmedOrderId, setConfirmedOrderId] = useState('');
  const [orderDate, setOrderDate] = useState('');

  // Calculations
  const itemTotal = product.priceAmount * quantity;
  const originalTotal = product.mrpAmount * quantity;
  const deliveryFee = 0; // Free delivery
  const finalTotal = Math.max(0, itemTotal - pointsDiscountValue + deliveryFee);

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length === 6 && /^\d+$/.test(pincode)) {
      setIsPincodeValid(true);
    } else {
      setIsPincodeValid(false);
    }
  };

  const handlePlaceOrder = () => {
    const randomOrderId = 'ATH-IND-' + Math.floor(100000 + Math.random() * 900000);
    const dateStr = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    setConfirmedOrderId(randomOrderId);
    setOrderDate(dateStr);
    setCheckoutStep('confirmed');
    if (onOrderComplete) {
      onOrderComplete({
        orderId: randomOrderId,
        product,
        quantity,
        total: finalTotal,
      });
    }
  };

  const resetAndClose = () => {
    setCheckoutStep('preview');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl bg-[#0F1420] border border-white/10 rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.9)] overflow-hidden text-white my-8 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Amazon-style Top Safety Header */}
        <div className="bg-[#141B2D] px-6 py-3.5 border-b border-white/10 flex items-center justify-between text-xs text-muted shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-bold text-white tracking-wider">ATHLOBOARD VERIFIED BUY BOX</span>
            <span className="hidden sm:inline text-slate-500">•</span>
            <span className="hidden sm:inline flex items-center gap-1 text-emerald-400 font-medium">
              <Lock className="w-3 h-3" /> 256-Bit SSL Encrypted Checkout
            </span>
          </div>
          <button 
            onClick={resetAndClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">

          {/* =============================================================== */}
          {/* STEP 1: PRODUCT PREVIEW & AMAZON BUY BOX                        */}
          {/* =============================================================== */}
          {checkoutStep === 'preview' && (
            <div className="grid md:grid-cols-12 gap-8">
              
              {/* Left Column: Product Visuals & Specs */}
              <div className="md:col-span-7 space-y-5">
                {/* Badges Bar */}
                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" /> {product.hplcTested}
                  </span>
                  {product.isBestSeller && (
                    <span className="px-2.5 py-0.5 rounded bg-[#E47911] text-black font-extrabold uppercase tracking-wide">
                      #1 Best Seller
                    </span>
                  )}
                  {product.isAthloboardChoice && (
                    <span className="px-2.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-white font-semibold">
                      Athloboard's <span className="text-[#E47911] font-bold">Choice</span>
                    </span>
                  )}
                </div>

                {/* Product Title & Brand */}
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                    {product.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-1.5 text-xs text-muted">
                    <span className="text-gold font-bold">{product.brand}</span>
                    <span>•</span>
                    <div className="flex items-center text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 inline mr-1" />
                      {product.rating}
                    </div>
                    <span className="text-slate-400">({product.ratingCount.toLocaleString()} verified reviews)</span>
                  </div>
                  <p className="text-[11px] text-emerald-400 font-mono mt-1 font-semibold">
                    {product.boughtPastMonth}
                  </p>
                </div>

                {/* Amazon Pricing Section */}
                <div className="p-4 rounded-2xl bg-surface/80 border border-white/5 space-y-2">
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-black text-rose-500">-{product.discountPercent}%</span>
                    <span className="text-3xl font-black text-white">{product.price}</span>
                    <span className="text-sm text-slate-400 line-through">M.R.P.: {product.mrp}</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Inclusive of all GST taxes • EMI starts at ₹{Math.round(product.priceAmount / 12)}/mo
                  </p>
                  <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold pt-1 border-t border-white/5">
                    <Sparkles className="w-3.5 h-3.5" /> You save ₹{(product.mrpAmount - product.priceAmount).toLocaleString()} ({product.discountPercent}%) with Athloboard Verification
                  </div>
                </div>

                {/* Variant Selector: Flavor */}
                {product.flavors && product.flavors.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 block">
                      Flavor: <span className="text-gold">{selectedFlavor}</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.flavors.map((flavor) => (
                        <button
                          key={flavor}
                          onClick={() => setSelectedFlavor(flavor)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                            selectedFlavor === flavor
                              ? 'bg-gold/15 border-gold text-gold shadow-sm'
                              : 'bg-surface/50 border-white/10 text-slate-300 hover:border-white/20'
                          }`}
                        >
                          {flavor}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Variant Selector: Size */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 block">
                      Size / Weight: <span className="text-gold">{selectedSize}</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                            selectedSize === size
                              ? 'bg-gold/15 border-gold text-gold shadow-sm'
                              : 'bg-surface/50 border-white/10 text-slate-300 hover:border-white/20'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Key Bullet Features */}
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">About this Verified Item</h4>
                  <ul className="space-y-1.5 text-xs text-slate-200">
                    {product.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Lab Audit Verification Seal */}
                <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-emerald-300 block">Eurofins Laboratory Certificate</span>
                    <span className="text-[11px] text-slate-400 font-mono">COA ID: {product.coaCertificateId}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-emerald-500 text-black text-[10px] font-black uppercase tracking-wider">
                    PASSED 100%
                  </span>
                </div>
              </div>

              {/* Right Column: Amazon Buy Box */}
              <div className="md:col-span-5 flex flex-col justify-between">
                <div className="glass-panel p-6 rounded-3xl border border-white/15 bg-slate-900/90 shadow-xl space-y-5">
                  
                  {/* Buy Box Header Price */}
                  <div>
                    <span className="text-xs text-slate-400 block font-semibold">Total Price:</span>
                    <div className="text-2xl font-black text-white">
                      ₹ {(product.priceAmount * quantity - pointsDiscountValue).toLocaleString()}
                    </div>
                    <span className="text-xs font-bold text-emerald-400 block mt-0.5">
                      ✓ FREE Delivery by Tomorrow, 2 PM - 6 PM
                    </span>
                  </div>

                  {/* Delivery Location Checker */}
                  <div className="pt-2 border-t border-white/10 text-xs space-y-2">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
                      <span>Deliver to <strong>Aniket - {pincode}</strong></span>
                    </div>

                    <form onSubmit={handlePincodeCheck} className="flex items-center gap-2">
                      <input 
                        type="text" 
                        maxLength={6}
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="Enter Pincode"
                        className="w-28 px-2.5 py-1 text-xs rounded-lg bg-background border border-white/15 text-white font-mono focus:border-gold outline-none"
                      />
                      <button 
                        type="submit"
                        className="px-2.5 py-1 text-xs font-bold rounded-lg bg-surface hover:bg-surfaceHover border border-white/10 text-slate-200 transition-colors"
                      >
                        Check
                      </button>
                    </form>
                    {isPincodeValid ? (
                      <span className="text-[11px] text-emerald-400 block">✓ In stock. Standard & Same-Day delivery available.</span>
                    ) : (
                      <span className="text-[11px] text-rose-400 block">Please enter a valid 6-digit PIN code.</span>
                    )}
                  </div>

                  {/* Stock Status */}
                  <div className="text-xs font-bold">
                    {product.stockNumber > 10 ? (
                      <span className="text-emerald-400">In Stock</span>
                    ) : (
                      <span className="text-amber-400">Only {product.stockNumber} left in stock - order soon.</span>
                    )}
                  </div>

                  {/* Quantity Dropdown */}
                  <div className="flex items-center justify-between text-xs bg-background p-2.5 rounded-xl border border-white/10">
                    <span className="text-slate-300 font-semibold">Quantity:</span>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-6 h-6 rounded bg-surface hover:bg-surfaceHover text-white font-bold flex items-center justify-center border border-white/10"
                      >
                        -
                      </button>
                      <span className="font-bold text-white w-4 text-center font-mono">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(Math.min(product.stockNumber, quantity + 1))}
                        className="w-6 h-6 rounded bg-surface hover:bg-surfaceHover text-white font-bold flex items-center justify-center border border-white/10"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Athloboard Lift Points Loyalty Discount */}
                  <div className="p-3 rounded-xl bg-gold/10 border border-gold/30 text-xs space-y-1.5">
                    <div className="flex items-center justify-between font-bold text-gold">
                      <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5" /> Athloboard Lift Points</span>
                      <span>{pointsAvailable} Pts</span>
                    </div>
                    <label className="flex items-center gap-2 text-[11px] text-slate-200 cursor-pointer pt-1">
                      <input 
                        type="checkbox" 
                        checked={applyPoints}
                        onChange={(e) => setApplyPoints(e.target.checked)}
                        className="w-3.5 h-3.5 accent-amber-500 rounded cursor-pointer"
                      />
                      <span>Redeem {pointsToRedeem} points for <strong>₹{pointsToRedeem} instant off</strong></span>
                    </label>
                  </div>

                  {/* Amazon Buy Box Buttons */}
                  <div className="space-y-3 pt-2">
                    {/* Primary Amazon-Style Buy Now Button */}
                    <button
                      onClick={() => setCheckoutStep('checkout')}
                      className="w-full py-3.5 px-4 rounded-xl font-black text-black bg-[#FFA41C] hover:bg-[#FA8900] shadow-[0_0_20px_rgba(255,164,28,0.3)] text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
                    >
                      <Lock className="w-4 h-4" />
                      Proceed to Buy Now (₹{(itemTotal - pointsDiscountValue).toLocaleString()})
                    </button>

                    {/* Secondary Add to Cart Button */}
                    <button
                      onClick={() => {
                        alert(`✓ Added ${quantity}x ${product.name} (${selectedFlavor || selectedSize || 'Standard'}) to your cart!`);
                      }}
                      className="w-full py-3 px-4 rounded-xl font-bold text-black bg-[#FFD814] hover:bg-[#F7CA00] shadow-sm text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                  </div>

                  {/* Merchant Details */}
                  <div className="pt-3 border-t border-white/10 text-[11px] text-muted space-y-1">
                    <div className="flex justify-between">
                      <span>Ships from</span>
                      <strong className="text-white">{product.fulfilledBy}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Sold by</span>
                      <strong className="text-gold truncate max-w-[200px]">{product.soldBy}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Returns</span>
                      <strong className="text-white">7-Day Replacement</strong>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <Link 
                    href={`/marketplace/${product._id}`}
                    onClick={onClose}
                    className="text-xs text-muted hover:text-gold transition-colors inline-flex items-center gap-1 font-semibold"
                  >
                    View Full Amazon-Style Product Specs Page <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

            </div>
          )}

          {/* =============================================================== */}
          {/* STEP 2: AMAZON CHECKOUT (ADDRESS & PAYMENT)                    */}
          {/* =============================================================== */}
          {checkoutStep === 'checkout' && (
            <div className="space-y-6">
              {/* Back to product preview button */}
              <button
                onClick={() => setCheckoutStep('preview')}
                className="text-xs text-muted hover:text-white flex items-center gap-1 font-semibold"
              >
                &larr; Back to Product Details
              </button>

              <div className="grid md:grid-cols-12 gap-6">
                
                {/* Left Column: Delivery Address & Payment Method */}
                <div className="md:col-span-8 space-y-6">

                  {/* SECTION 1: DELIVERY ADDRESS */}
                  <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-emerald-500 text-black font-black text-xs flex items-center justify-center">1</span>
                        <h3 className="font-extrabold text-white text-base">Delivery Address</h3>
                      </div>
                      <button 
                        onClick={() => setIsEditingAddress(!isEditingAddress)}
                        className="text-xs text-gold hover:underline font-bold"
                      >
                        {isEditingAddress ? 'Done' : 'Change Address'}
                      </button>
                    </div>

                    {!isEditingAddress ? (
                      <div className="text-xs text-slate-300 leading-relaxed bg-background p-3.5 rounded-xl border border-white/5 flex items-start justify-between">
                        <div>
                          <strong className="text-white font-bold text-sm block">{shippingAddress.fullName}</strong>
                          <p className="mt-1">{shippingAddress.flat}, {shippingAddress.area}</p>
                          <p>{shippingAddress.city}, {shippingAddress.state} - <strong className="text-white">{shippingAddress.pincode}</strong></p>
                          <p className="mt-1 font-mono text-slate-400">Phone: {shippingAddress.phone}</p>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                          DEFAULT
                        </span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <input 
                          type="text" 
                          value={shippingAddress.fullName}
                          onChange={(e) => setShippingAddress({...shippingAddress, fullName: e.target.value})}
                          placeholder="Full Name"
                          className="px-3 py-2 rounded-lg bg-background border border-white/15 text-white outline-none focus:border-gold col-span-2"
                        />
                        <input 
                          type="text" 
                          value={shippingAddress.flat}
                          onChange={(e) => setShippingAddress({...shippingAddress, flat: e.target.value})}
                          placeholder="Flat, House no., Building"
                          className="px-3 py-2 rounded-lg bg-background border border-white/15 text-white outline-none focus:border-gold col-span-2"
                        />
                        <input 
                          type="text" 
                          value={shippingAddress.city}
                          onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                          placeholder="City"
                          className="px-3 py-2 rounded-lg bg-background border border-white/15 text-white outline-none focus:border-gold"
                        />
                        <input 
                          type="text" 
                          value={shippingAddress.pincode}
                          onChange={(e) => setShippingAddress({...shippingAddress, pincode: e.target.value})}
                          placeholder="6-digit PIN"
                          className="px-3 py-2 rounded-lg bg-background border border-white/15 text-white outline-none focus:border-gold font-mono"
                        />
                      </div>
                    )}
                  </div>

                  {/* SECTION 2: PAYMENT METHOD */}
                  <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                    <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                      <span className="w-6 h-6 rounded-full bg-emerald-500 text-black font-black text-xs flex items-center justify-center">2</span>
                      <h3 className="font-extrabold text-white text-base">Select a Payment Method</h3>
                    </div>

                    <div className="space-y-3 text-xs">
                      {/* Option 1: UPI */}
                      <label className={`p-4 rounded-xl border flex items-start justify-between cursor-pointer transition-colors ${
                        paymentMethod === 'upi' ? 'bg-surface border-emerald-500' : 'bg-background border-white/5 hover:border-white/15'
                      }`}>
                        <div className="flex items-start gap-3">
                          <input 
                            type="radio" 
                            name="payment" 
                            checked={paymentMethod === 'upi'}
                            onChange={() => setPaymentMethod('upi')}
                            className="accent-emerald-500 mt-1"
                          />
                          <div>
                            <div className="font-bold text-white flex items-center gap-2">
                              <span>UPI (Instant Instant Settlement)</span>
                              <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">RECOMMENDED</span>
                            </div>
                            <p className="text-muted mt-0.5">Google Pay, PhonePe, Paytm, or any UPI App</p>

                            {paymentMethod === 'upi' && (
                              <div className="flex gap-2 mt-3">
                                {['gpay', 'phonepe', 'paytm'].map((app) => (
                                  <button
                                    key={app}
                                    type="button"
                                    onClick={() => setUpiApp(app)}
                                    className={`px-3 py-1.5 rounded-lg border uppercase text-[11px] font-bold ${
                                      upiApp === app ? 'bg-emerald-500/20 border-emerald-400 text-white' : 'bg-surface border-white/10 text-muted'
                                    }`}
                                  >
                                    {app}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <Smartphone className="w-4 h-4 text-emerald-400 shrink-0" />
                      </label>

                      {/* Option 2: Credit/Debit Card */}
                      <label className={`p-4 rounded-xl border flex items-start justify-between cursor-pointer transition-colors ${
                        paymentMethod === 'card' ? 'bg-surface border-emerald-500' : 'bg-background border-white/5 hover:border-white/15'
                      }`}>
                        <div className="flex items-start gap-3">
                          <input 
                            type="radio" 
                            name="payment" 
                            checked={paymentMethod === 'card'}
                            onChange={() => setPaymentMethod('card')}
                            className="accent-emerald-500 mt-1"
                          />
                          <div>
                            <div className="font-bold text-white">Credit or Debit Card</div>
                            <p className="text-muted mt-0.5">Visa, Mastercard, RuPay, Maestro</p>
                          </div>
                        </div>
                        <CreditCard className="w-4 h-4 text-slate-400 shrink-0" />
                      </label>

                      {/* Option 3: Athloboard Lift Points */}
                      <label className={`p-4 rounded-xl border flex items-start justify-between cursor-pointer transition-colors ${
                        paymentMethod === 'points' ? 'bg-surface border-gold' : 'bg-background border-white/5 hover:border-white/15'
                      }`}>
                        <div className="flex items-start gap-3">
                          <input 
                            type="radio" 
                            name="payment" 
                            checked={paymentMethod === 'points'}
                            onChange={() => setPaymentMethod('points')}
                            className="accent-amber-500 mt-1"
                          />
                          <div>
                            <div className="font-bold text-gold flex items-center gap-1.5">
                              <Award className="w-3.5 h-3.5" /> Pay with Athloboard Lift Points
                            </div>
                            <p className="text-muted mt-0.5">Balance: 1,200 Lift Points (Verified on-chain)</p>
                          </div>
                        </div>
                        <span className="text-gold font-bold font-mono">1,200 Pts</span>
                      </label>

                      {/* Option 4: Cash on Delivery */}
                      <label className={`p-4 rounded-xl border flex items-start justify-between cursor-pointer transition-colors ${
                        paymentMethod === 'cod' ? 'bg-surface border-emerald-500' : 'bg-background border-white/5 hover:border-white/15'
                      }`}>
                        <div className="flex items-start gap-3">
                          <input 
                            type="radio" 
                            name="payment" 
                            checked={paymentMethod === 'cod'}
                            onChange={() => setPaymentMethod('cod')}
                            className="accent-emerald-500 mt-1"
                          />
                          <div>
                            <div className="font-bold text-white">Cash on Delivery (Pay upon arrival)</div>
                            <p className="text-muted mt-0.5">Cash, UPI, or Card at doorstep</p>
                          </div>
                        </div>
                        <Truck className="w-4 h-4 text-slate-400 shrink-0" />
                      </label>
                    </div>
                  </div>

                </div>

                {/* Right Column: Amazon Order Summary Box */}
                <div className="md:col-span-4">
                  <div className="glass-panel p-6 rounded-2xl border border-white/15 bg-slate-900/90 shadow-xl space-y-4">
                    
                    <h4 className="font-extrabold text-white text-sm border-b border-white/10 pb-3">Order Summary</h4>
                    
                    {/* Item Row */}
                    <div className="flex gap-3 text-xs pb-3 border-b border-white/10">
                      <div className="w-12 h-12 rounded-lg bg-surface border border-white/10 shrink-0 flex items-center justify-center overflow-hidden">
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-bold text-white truncate">{product.name}</p>
                        <p className="text-slate-400 text-[11px]">Qty: {quantity} {selectedFlavor && `• ${selectedFlavor}`}</p>
                        <span className="text-emerald-400 font-bold">₹ {itemTotal.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Breakdown */}
                    <div className="text-xs space-y-2 text-slate-300">
                      <div className="flex justify-between">
                        <span>Items ({quantity}):</span>
                        <span className="font-mono">₹ {itemTotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery:</span>
                        <span className="text-emerald-400 font-bold font-mono">FREE</span>
                      </div>
                      {applyPoints && (
                        <div className="flex justify-between text-gold font-semibold">
                          <span>Lift Points Discount:</span>
                          <span className="font-mono">-₹ {pointsDiscountValue.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-black text-white text-base pt-3 border-t border-white/10">
                        <span>Order Total:</span>
                        <span className="font-mono text-emerald-400">₹ {finalTotal.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Amazon Place Your Order CTA */}
                    <button
                      onClick={handlePlaceOrder}
                      className="w-full py-4 px-4 rounded-xl font-black text-black bg-[#FFA41C] hover:bg-[#FA8900] shadow-[0_0_20px_rgba(255,164,28,0.35)] text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
                    >
                      <Lock className="w-4 h-4" />
                      Place Your Order & Pay
                    </button>

                    <p className="text-[10px] text-muted text-center leading-tight">
                      By placing your order, you agree to Athloboard's Verified Trade terms and Privacy notice.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* STEP 3: ORDER CONFIRMED & CELEBRATION                          */}
          {/* =============================================================== */}
          {checkoutStep === 'confirmed' && (
            <div className="text-center py-8 space-y-6 max-w-xl mx-auto">
              
              {/* Animated Success Badge */}
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_40px_rgba(16,185,129,0.3)] animate-pulse">
                <Check className="w-10 h-10 stroke-[3]" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800">
                  Payment Confirmed
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white mt-3">
                  Order Placed, Thank You!
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-2">
                  Confirmation sent to <strong className="text-white">aniket@athloboard.com</strong> and SMS to <strong className="text-white">{shippingAddress.phone}</strong>
                </p>
              </div>

              {/* Order Info Card */}
              <div className="glass-panel p-6 rounded-2xl border border-white/10 text-left space-y-3 text-xs bg-slate-900/80">
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Order Number</span>
                    <strong className="text-gold font-mono text-sm">{confirmedOrderId}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[11px]">Estimated Delivery</span>
                    <strong className="text-emerald-400 text-sm">Tomorrow by 6:00 PM</strong>
                  </div>
                </div>

                {/* Tracking Progress Bar */}
                <div className="pt-2 space-y-2">
                  <div className="flex justify-between text-[11px] font-bold text-white">
                    <span className="text-emerald-400">● Order Placed</span>
                    <span className="text-slate-400">Processing</span>
                    <span className="text-slate-400">Dispatched</span>
                    <span className="text-slate-400">Delivered</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-1/4 rounded-full"></div>
                  </div>
                </div>

                {/* Rewarded Points Banner */}
                <div className="mt-3 p-3 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-gold" />
                    <span className="text-slate-200">Earned for this verified purchase:</span>
                  </div>
                  <strong className="text-gold font-bold font-mono">+50 Lift Points</strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <button
                  onClick={resetAndClose}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-white bg-surface hover:bg-surfaceHover border border-white/15 text-xs transition-colors"
                >
                  Continue Shopping
                </button>
                <Link
                  href="/download"
                  onClick={resetAndClose}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-black text-black bg-emerald-400 hover:bg-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.3)] text-xs transition-all"
                >
                  Track in Mobile App &rarr;
                </Link>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
