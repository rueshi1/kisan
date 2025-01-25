import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import ImageAnalysis from './components/ImageAnalysis';
import SensorDashboard from './components/SensorDashboard';

function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <ImageAnalysis />
      <SensorDashboard />
    </div>
  );
}

export default App;