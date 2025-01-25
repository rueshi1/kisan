import React, { useEffect, useState } from 'react';
import { Thermometer, Droplets, Bug, AlertCircle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

interface SensorReading {
  sensor_type: string;
  reading: number;
  unit: string;
  timestamp: string;
}

export default function SensorDashboard() {
  const [sensorData, setSensorData] = useState<Record<string, SensorReading>>({});

  if (!isSupabaseConfigured()) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Smart Sensor Dashboard</h2>
          <div className="max-w-3xl mx-auto">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
                <p className="ml-3 text-yellow-700">
                  Please click the "Connect to Supabase" button in the top right corner to enable sensor monitoring features.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  useEffect(() => {
    const fetchSensorData = async () => {
      const { data, error } = await supabase
        .from('sensor_data')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(1);

      if (data && !error) {
        const latestReadings = data.reduce((acc, reading) => ({
          ...acc,
          [reading.sensor_type]: reading
        }), {});
        setSensorData(latestReadings);
      }
    };

    fetchSensorData();
    
    // Subscribe to real-time updates
    const subscription = supabase
      .channel('sensor_updates')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'sensor_data'
      }, payload => {
        setSensorData(current => ({
          ...current,
          [payload.new.sensor_type]: payload.new
        }));
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const sensors = [
    {
      type: 'temperature',
      icon: Thermometer,
      label: 'Temperature',
      value: sensorData.temperature?.reading || 25,
      unit: '°C',
      color: 'text-red-500'
    },
    {
      type: 'moisture',
      icon: Droplets,
      label: 'Soil Moisture',
      value: sensorData.moisture?.reading || 65,
      unit: '%',
      color: 'text-blue-500'
    },
    {
      type: 'pest',
      icon: Bug,
      label: 'Pest Activity',
      value: sensorData.pest?.reading || 2,
      unit: 'detected',
      color: 'text-yellow-500'
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Smart Sensor Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sensors.map((sensor) => (
            <div key={sensor.type} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <sensor.icon className={`h-8 w-8 ${sensor.color}`} />
                <span className="text-sm text-gray-500">Live</span>
              </div>
              
              <h3 className="text-lg font-semibold mb-2">{sensor.label}</h3>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold">{sensor.value}</span>
                <span className="ml-2 text-gray-600">{sensor.unit}</span>
              </div>
              
              {sensor.type === 'moisture' && sensor.value < 40 && (
                <div className="mt-4 p-2 bg-yellow-50 text-yellow-700 rounded-md text-sm">
                  Low moisture level detected! Consider irrigation.
                </div>
              )}
              
              {sensor.type === 'pest' && sensor.value > 5 && (
                <div className="mt-4 p-2 bg-red-50 text-red-700 rounded-md text-sm">
                  High pest activity! Check affected areas.
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}