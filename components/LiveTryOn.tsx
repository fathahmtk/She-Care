import React, { useState, useEffect, useRef, useCallback } from 'react';
// FIX: Import global types to make JSX augmentations available.
import '../types';
import { GoogleGenAI, Modality } from "@google/genai";
import type { Shade } from '../types';
import CloseIcon from './icons/CloseIcon';

const fileToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => {
      const result = (reader.result as string).split(',')[1];
      if (result) resolve(result);
      else reject(new Error("Failed to convert blob to base64."));
    };
    reader.onerror = error => reject(error);
  });
};

interface LiveTryOnProps {
  shades: Shade[];
  onClose: () => void;
}

const LiveTryOn: React.FC<LiveTryOnProps> = ({ shades, onClose }) => {
  const [selectedShade, setSelectedShade] = useState<Shade | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (processingIntervalRef.current) {
      clearInterval(processingIntervalRef.current);
      processingIntervalRef.current = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    stopCamera();
    setIsInitializing(true);
    setError(null);
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({ video: { width: 480, height: 480 } });
      if (videoRef.current) {
        videoRef.current.srcObject = streamRef.current;
      }
    } catch (err) {
      console.error("Camera access denied:", err);
      setError("Camera access is required for the Live Try-On feature. Please enable it in your browser settings.");
    } finally {
      setIsInitializing(false);
    }
  }, [stopCamera]);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);
  
  const processFrame = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !selectedShade || isProcessing) return;

    setIsProcessing(true);
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if (!context) {
        setIsProcessing(false);
        return;
    }
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob(async (blob) => {
        if (!blob) {
            setIsProcessing(false);
            return;
        }

        try {
            const base64Image = await fileToBase64(blob);
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const prompt = `Apply lipstick to the person in the image. The lipstick color should be exactly ${selectedShade.hex}. Make it look natural and realistic, matching the lip line. Do not alter any other part of the image.`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: {
                    parts: [
                        { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
                        { text: prompt },
                    ],
                },
                config: {
                    responseModalities: [Modality.IMAGE, Modality.TEXT],
                },
            });

            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    setProcessedImage(`data:image/jpeg;base64,${part.inlineData.data}`);
                    break;
                }
            }
        } catch (err) {
            console.error("Gemini API error:", err);
            // Don't show error to user, just stop processing for this shade
            setSelectedShade(null);
        } finally {
            setIsProcessing(false);
        }
    }, 'image/jpeg', 0.8);

  }, [selectedShade, isProcessing]);


  useEffect(() => {
    if (selectedShade) {
      setProcessedImage(null); // Clear previous image
      if (processingIntervalRef.current) clearInterval(processingIntervalRef.current);
      processingIntervalRef.current = setInterval(processFrame, 750); // Adjust interval for performance
    } else {
      if (processingIntervalRef.current) {
        clearInterval(processingIntervalRef.current);
        processingIntervalRef.current = null;
        setProcessedImage(null);
        setIsProcessing(false);
      }
    }

    return () => {
      if (processingIntervalRef.current) clearInterval(processingIntervalRef.current);
    }
  }, [selectedShade, processFrame]);

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center p-4 animate-fade-in" role="dialog" aria-modal="true">
      <canvas ref={canvasRef} className="hidden" />
      <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-accent transition-transform duration-300 transform hover:scale-125 z-20" aria-label="Close Live Try-On">
        <CloseIcon className="w-8 h-8"/>
      </button>

      <div className="relative w-full max-w-lg aspect-square bg-black rounded-xl overflow-hidden shadow-2xl">
        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]"></video>
        {processedImage && <img src={processedImage} alt="Lipstick Try-On" className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]" />}
        
        {(isInitializing || (isProcessing && !processedImage)) && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="flex flex-col items-center text-white">
                    <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <p className="mt-3 text-sm">{isInitializing ? 'Starting camera...' : 'Applying shade...'}</p>
                </div>
            </div>
        )}
        {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 p-6">
                <p className="text-white text-center">{error}</p>
            </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-surface/10 backdrop-blur-sm rounded-xl">
        <div className="flex items-center justify-center gap-4">
          {shades.map(shade => (
            <button
              key={shade.name}
              onClick={() => setSelectedShade(s => s?.name === shade.name ? null : shade)}
              className={`w-12 h-12 rounded-full border-2 transition-all duration-300 transform hover:scale-110 ${selectedShade?.name === shade.name ? 'border-accent ring-2 ring-accent ring-offset-2 ring-offset-black/20' : 'border-white/50'}`}
              style={{ backgroundColor: shade.hex }}
              aria-label={`Select shade ${shade.name}`}
            >
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveTryOn;