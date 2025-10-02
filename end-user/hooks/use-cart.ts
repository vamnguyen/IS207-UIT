"use client";

import { useState, useEffect } from "react";
import type { CartItem, Product } from "@/lib/types";
import { generateId, calculateDays } from "@/lib/utils";

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("rental-cart");
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("rental-cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (
    product: Product,
    quantity: number,
    startDate: string,
    endDate: string
  ) => {
    const days = calculateDays(startDate, endDate);
    const total_price = product.price * quantity * days;

    const newItem: CartItem = {
      id: generateId(),
      product,
      quantity,
      start_date: startDate,
      end_date: endDate,
      days,
      total_price,
    };

    setItems((prev) => [...prev, newItem]);
  };

  const removeFromCart = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity,
              total_price: item.product.price * quantity * item.days,
            }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalAmount = () => {
    return items.reduce((total, item) => total + item.total_price, 0);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalAmount,
    getTotalItems,
  };
}
