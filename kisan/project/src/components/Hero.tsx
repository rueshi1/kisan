import React from 'react';
import { Upload, Users } from 'lucide-react';

export default function Hero() {
  return (
    <div className="bg-gradient-to-b from-green-600 to-green-500 text-white py-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Empowering Farmers with Expert Solutions
            </h1>
            <p className="text-xl mb-8">
              Upload photos of your affected crops and get expert advice from agricultural scientists. 
              Transform your farming practices with real-time monitoring and smart solutions.
            </p>
            <div className="flex space-x-4">
              <button className="bg-white text-green-600 px-8 py-3 rounded-full font-semibold hover:bg-green-100 transition flex items-center">
                <Upload className="mr-2 h-5 w-5" />
                Upload Now
              </button>
              <button className="border-2 border-white px-8 py-3 rounded-full font-semibold hover:bg-green-600 transition flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Meet Experts
              </button>
            </div>
          </div>
          <div className="md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
              alt="Farmer using smartphone in field" 
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}