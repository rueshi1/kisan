import React, { useState, useRef } from 'react';
import { Camera, Upload, RefreshCw, AlertCircle } from 'lucide-react';
import Webcam from 'react-webcam';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export default function ImageAnalysis() {
  const [isCapturing, setIsCapturing] = useState(false);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  if (!isSupabaseConfigured()) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
                <p className="ml-3 text-yellow-700">
                  Please click the "Connect to Supabase" button in the top right corner to enable image analysis features.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const captureImage = async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setIsAnalyzing(true);
        try {
          // Upload to Supabase Storage
          const fileName = `crop-${Date.now()}.jpg`;
          const { data, error } = await supabase.storage
            .from('crop-images')
            .upload(fileName, base64ToBlob(imageSrc), {
              contentType: 'image/jpeg'
            });

          if (error) throw error;

          // Analyze image using TensorFlow.js model
          const result = await analyzeImage(imageSrc);
          setPrediction(result);

          // Save analysis to database
          await supabase.from('crop_analyses').insert({
            image_url: data.path,
            disease_prediction: result,
            confidence_score: 0.85 // Example score
          });
        } catch (error) {
          console.error('Error processing image:', error);
        } finally {
          setIsAnalyzing(false);
        }
      }
    }
  };

  const base64ToBlob = (base64: string) => {
    const byteString = atob(base64.split(',')[1]);
    const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  const analyzeImage = async (imageSrc: string): Promise<string> => {
    // Placeholder for TensorFlow.js model prediction
    // In reality, you would load and use a trained model here
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('Healthy Plant - No Disease Detected');
      }, 2000);
    });
  };

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Crop Disease Analysis</h2>
          
          <div className="bg-gray-50 rounded-lg p-6 shadow-lg">
            {isCapturing ? (
              <div className="space-y-4">
                <Webcam
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full rounded-lg"
                />
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={captureImage}
                    className="bg-green-600 text-white px-6 py-2 rounded-full flex items-center"
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Camera className="mr-2 h-5 w-5" />
                        Capture
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setIsCapturing(false)}
                    className="border-2 border-green-600 text-green-600 px-6 py-2 rounded-full"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <button
                  onClick={() => setIsCapturing(true)}
                  className="bg-green-600 text-white px-8 py-3 rounded-full flex items-center mx-auto"
                >
                  <Camera className="mr-2 h-5 w-5" />
                  Start Camera
                </button>
                <div className="mt-4 flex items-center justify-center">
                  <div className="border-t border-gray-300 flex-grow" />
                  <span className="px-4 text-gray-500">or</span>
                  <div className="border-t border-gray-300 flex-grow" />
                </div>
                <label className="mt-4 inline-flex items-center px-8 py-3 border-2 border-green-600 text-green-600 rounded-full cursor-pointer hover:bg-green-50">
                  <Upload className="mr-2 h-5 w-5" />
                  Upload Image
                  <input type="file" className="hidden" accept="image/*" />
                </label>
              </div>
            )}

            {prediction && (
              <div className="mt-6 p-4 bg-white rounded-lg border border-green-200">
                <h3 className="font-semibold text-lg mb-2">Analysis Result:</h3>
                <p className="text-gray-700">{prediction}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}