"use client";

import React, { useState } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CartDrawer } from "./CartDrawer";
import { CartNotification } from "./CartNotification";
import { useCart } from "../context/CartContext";

export const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { notificationProduct, setNotificationProduct } = useCart();

  return (
    <>
      <Header onCartClick={() => setIsCartOpen(true)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <CartNotification 
        isOpen={!!notificationProduct} 
        onClose={() => setNotificationProduct(null)} 
        product={notificationProduct}
      />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
};
