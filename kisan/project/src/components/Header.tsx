import React from 'react';
import { Plane as Plant, Upload, MessageCircle, Bell, Database, Thermometer, Shield } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-green-600 text-white">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Plant className="h-8 w-8" />
          <span className="text-2xl font-bold">KISAN AID</span>
        </div>
        <div className="hidden md:flex space-x-6">
          <a href="#features" className="hover:text-green-200 transition">Features</a>
          <a href="#how-it-works" className="hover:text-green-200 transition">How It Works</a>
          <a href="#experts" className="hover:text-green-200 transition">Our Experts</a>
          <a href="#contact" className="hover:text-green-200 transition">Contact</a>
        </div>
        <button className="bg-white text-green-600 px-6 py-2 rounded-full font-semibold hover:bg-green-100 transition">
          Get Started
        </button>
      </nav>
    </header>
  );
}