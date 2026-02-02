"use client";

import Link from "next/link";
import { ShoppingCart, Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto text-center space-y-6">
        
        
        <div className="flex items-center justify-center gap-2">
          <ShoppingCart className="w-6 h-6 text-teal-700" />
          <h2 className="text-xl font-bold text-teal-700 tracking-wide">
            Medi Store
          </h2>
        </div>

       
        <p className="text-gray-600 max-w-2xl mx-auto text-sm">
          Shop trusted medicines and daily health essentials at MediStore—great deals, fast delivery, limited stock.
        </p>

        <div className="border-t border-gray-300 w-full max-w-4xl mx-auto" />

        
        <div className="flex flex-wrap justify-center gap-6 text-gray-700 text-sm font-medium">
          <Link href="/" className="hover:text-teal-600 transition">
            Home
          </Link>
          <Link href="/products" className="hover:text-teal-600 transition">
            All Products
          </Link>
          <Link href="/about" className="hover:text-teal-600 transition">
            About Us
          </Link>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center gap-4 mt-4">
          <Link
            href="#"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-black text-white hover:scale-105 transition"
          >
            <Facebook size={16} />
          </Link>

          <Link
            href="#"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-black text-white hover:scale-105 transition"
          >
            <Instagram size={16} />
          </Link>

          <Link
            href="#"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-black text-white hover:scale-105 transition"
          >
            <Twitter size={16} />
          </Link>
        </div>

        {/* Copyright */}
        <p className="text-xs text-gray-500 mt-4">
          © 2026 SwiftCart. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
