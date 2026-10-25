"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "../../context/CartContext";
import { CheckCircle, ArrowLeft, Loader2, MessageCircle, Truck, ShieldCheck, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice, WHATSAPP_LINK, WHATSAPP_NUMBER } from "../../lib/constants";

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Lahore");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "whatsapp">("cod");

  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsProcessing(true);

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    const fullAddress = `${address.trim()}, ${city.trim()}`;

    const itemsPayload = cart.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      selectedSize: item.selectedSize,
      image: item.images?.[0] || "",
    }));

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: fullName,
          customerEmail: email.trim(),
          customerPhone: phone.trim(),
          shippingAddress: fullAddress,
          items: itemsPayload,
          totalAmount: totalPrice,
          message: notes.trim()
            ? `[Payment: ${paymentMethod === "cod" ? "Cash on Delivery" : "WhatsApp Concierge"}] ${notes.trim()}`
            : `[Payment: ${paymentMethod === "cod" ? "Cash on Delivery" : "WhatsApp Concierge"}]`,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Unable to register order. Please verify your details.");
        setIsProcessing(false);
        return;
      }

      setConfirmedOrder(data.inquiry);
      clearCart();
    } catch (err: any) {
      setErrorMessage("Network error connecting to store: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (confirmedOrder) {
    const summaryItems = confirmedOrder.items
      .map((i: any) => `${i.name} (Size: ${i.selectedSize}) x${i.quantity}`)
      .join(", ");
    const whatsappMsg = encodeURIComponent(
      `Assalam-o-Alaikum AB SHOES! I just placed an order (Ref: #${confirmedOrder.id.slice(-4).toUpperCase()}).\n\nName: ${confirmedOrder.customerName}\nItems: ${summaryItems}\nTotal: Rs. ${confirmedOrder.totalAmount.toLocaleString()}\nAddress: ${confirmedOrder.shippingAddress}\n\nPlease confirm dispatch details!`
    );
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMsg}`;

    return (
      <div className="min-h-screen flex items-center justify-center bg-black px-6 py-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel p-8 md:p-12 rounded-3xl border border-white/10 max-w-xl w-full text-center space-y-6"
        >
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-emerald-500/10 text-emerald-400 mx-auto">
            <CheckCircle size={40} />
          </div>

          <div>
            <span className="text-gold text-[10px] font-bold uppercase tracking-[0.4em] block mb-2">
              Acquisition Confirmed
            </span>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white">
              Order <span className="gold-gradient italic">Registered.</span>
            </h1>
            <p className="text-zinc-400 text-xs mt-2 font-mono">
              Order Reference: <strong className="text-gold">#{confirmedOrder.id.slice(-6).toUpperCase()}</strong>
            </p>
          </div>

          <p className="text-zinc-400 text-xs leading-relaxed max-w-md mx-auto">
            Thank you, <strong className="text-white">{confirmedOrder.customerName}</strong>. Our atelier artisans have registered your order for nationwide express delivery.
          </p>

          {/* Action buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white w-full sm:w-auto px-6 py-4 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-105"
            >
              <MessageCircle size={16} />
              Confirm on WhatsApp Concierge
            </a>

            <Link
              href="/shop"
              className="gold-button w-full sm:w-auto px-6 py-4 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center"
            >
              Return to Catalog
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black gap-6 px-6">
        <p className="text-zinc-500 uppercase tracking-[0.2em] text-xs">Your acquisition bag is empty</p>
        <Link
          href="/shop"
          className="gold-button px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 min-h-screen bg-black">
      <div className="container mx-auto px-6 max-w-6xl">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest mb-8"
        >
          <ArrowLeft size={14} /> Continue Shopping
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-20">
          {/* Form Side */}
          <div className="space-y-10">
            <div>
              <span className="text-gold text-[10px] font-bold uppercase tracking-[0.3em] block mb-2">
                Express Nationwide Checkout
              </span>
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">
                Finalize <span className="gold-gradient italic">Acquisition.</span>
              </h1>
              <p className="text-zinc-500 text-xs mt-1">
                Complementary insured express delivery across all cities in Pakistan.
              </p>
            </div>

            {errorMessage && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleCheckout} className="space-y-8">
              {/* Client Info */}
              <div className="space-y-4">
                <h2 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                  Recipient Identity
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="FIRST NAME"
                    className="bg-white/5 border border-white/10 px-5 py-3.5 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-gold transition-colors uppercase tracking-wider"
                  />
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="LAST NAME"
                    className="bg-white/5 border border-white/10 px-5 py-3.5 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-gold transition-colors uppercase tracking-wider"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="MOBILE / WHATSAPP (03XX XXXXXXX)"
                    className="bg-white/5 border border-white/10 px-5 py-3.5 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-gold transition-colors tracking-wider font-mono"
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="EMAIL ADDRESS"
                    className="bg-white/5 border border-white/10 px-5 py-3.5 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-gold transition-colors tracking-wider"
                  />
                </div>
              </div>

              {/* Shipping Address */}
              <div className="space-y-4">
                <h2 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                  Delivery Destination
                </h2>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="STREET ADDRESS, HOUSE/APARTMENT NUMBER"
                  className="w-full bg-white/5 border border-white/10 px-5 py-3.5 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-gold transition-colors uppercase tracking-wider"
                />

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="CITY (e.g. Lahore, Karachi, Islamabad)"
                    className="bg-white/5 border border-white/10 px-5 py-3.5 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-gold transition-colors uppercase tracking-wider"
                  />
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="ORDER NOTES / SPECIAL SIZING (OPTIONAL)"
                    className="bg-white/5 border border-white/10 px-5 py-3.5 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-gold transition-colors uppercase tracking-wider"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-4">
                <h2 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                  Payment Protocol
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cod")}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      paymentMethod === "cod"
                        ? "bg-gold/10 border-gold text-white"
                        : "bg-white/5 border-white/10 text-zinc-400 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-white">
                        Cash on Delivery
                      </span>
                      <Truck size={16} className="text-gold" />
                    </div>
                    <p className="text-[10px] text-zinc-400">
                      Pay courier upon receiving parcel anywhere in Pakistan.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("whatsapp")}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      paymentMethod === "whatsapp"
                        ? "bg-gold/10 border-gold text-white"
                        : "bg-white/5 border-white/10 text-zinc-400 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-white">
                        WhatsApp Concierge
                      </span>
                      <MessageCircle size={16} className="text-emerald-400" />
                    </div>
                    <p className="text-[10px] text-zinc-400">
                      Confirm via WhatsApp with direct bank transfer / bespoke support.
                    </p>
                  </button>
                </div>
              </div>

              <button
                disabled={isProcessing}
                type="submit"
                className="gold-button w-full py-5 rounded-full font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 disabled:opacity-50 shadow-2xl cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Registering Acquisition...
                  </>
                ) : (
                  <>
                    Complete Acquisition ({formatPrice(totalPrice)})
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Summary Side */}
          <div className="lg:sticky lg:top-40 h-fit glass-panel p-8 md:p-10 rounded-3xl border border-white/10 space-y-8">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
              Acquisition Summary
            </h3>

            <div className="space-y-4 max-h-[360px] overflow-y-auto pr-2">
              {cart.map((item) => (
                <div
                  key={`${item.id}-${item.selectedSize}`}
                  className="flex items-center justify-between gap-4 p-3 rounded-xl bg-white/5 border border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-14 bg-zinc-900 rounded-lg overflow-hidden border border-white/10 relative shrink-0">
                      {item.images?.[0] && (
                        <Image
                          src={item.images[0]}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-tight text-white">{item.name}</p>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-0.5">
                        Size: <strong className="text-gold">{item.selectedSize}</strong> • Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs font-bold text-gold shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-6 border-t border-white/10 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Nationwide Shipping</span>
                <span className="text-emerald-400 uppercase font-bold tracking-wider">Complementary</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Artisanal Packaging</span>
                <span className="text-zinc-200">Included</span>
              </div>
              <div className="flex justify-between items-end pt-4 border-t border-white/10">
                <span className="text-xs font-bold uppercase tracking-widest text-white">
                  Total Acquisition Value
                </span>
                <span className="text-2xl font-black text-gold">{formatPrice(totalPrice)}</span>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-center gap-6 text-zinc-500 text-[10px] uppercase tracking-widest">
              <span className="flex items-center gap-1">
                <ShieldCheck size={14} className="text-gold" /> 100% Authentic
              </span>
              <span className="flex items-center gap-1">
                <Truck size={14} className="text-gold" /> Nationwide Delivery
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
