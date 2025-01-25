import React from 'react';
import { Camera, MessageCircle, Bell, Database, Thermometer, Shield } from 'lucide-react';

const features = [
  {
    icon: Camera,
    title: "Image Upload & Analysis",
    description: "Upload multiple images of affected crops for comprehensive analysis by experts"
  },
  {
    icon: MessageCircle,
    title: "Expert Consultation",
    description: "Connect with agricultural scientists and experts through chat and video calls"
  },
  {
    icon: Bell,
    title: "Real-time Alerts",
    description: "Receive timely notifications about weather, market trends, and disease outbreaks"
  },
  {
    icon: Database,
    title: "Knowledge Base",
    description: "Access comprehensive database of plant diseases and prevention guides"
  },
  {
    icon: Thermometer,
    title: "Smart Sensors",
    description: "Monitor soil moisture, temperature, and pest detection in real-time"
  },
  {
    icon: Shield,
    title: "Preventive Measures",
    description: "Get early warnings and preventive solutions for crop protection"
  }
];

export default function Features() {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Comprehensive Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition">
              <feature.icon className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}