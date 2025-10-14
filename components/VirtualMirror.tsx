import React, { useState, useRef, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import CaptureIcon from './icons/CaptureIcon';
import SparklesIcon from './icons/SparklesIcon';

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

const VirtualMirror: React.FC = () => {
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const stopCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setIsCameraOn(false);
    }, []);

    const startCamera = useCallback(async () => {
        if (isCameraOn) return;
        stopCamera();
        setError(null);
        setCapturedImage(null);
        setFeedback(null);
        try {
            streamRef.current = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 480, height: 480 } });
            if (videoRef.current) {
                videoRef.current.srcObject = streamRef.current;
                videoRef.current.onloadedmetadata = () => {
                    setIsCameraOn(true);
                }
            }
        } catch (err) {
            console.error("Camera access error:", err);
            setError("Camera access is needed for the Virtual Mirror. Please enable it in your browser.");
        }
    }, [isCameraOn, stopCamera]);
    
    const handleCaptureAndAnalyze = async () => {
        if (!videoRef.current || !canvasRef.current) return;

        setIsLoading(true);
        setError(null);
        setFeedback(null);

        const canvas = canvasRef.current;
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        if (!context) return;
        
        // Flip the context horizontally to get a mirrored image
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageUrl);
        stopCamera();

        canvas.toBlob(async (blob) => {
            if (!blob) {
                setError("Failed to capture image.");
                setIsLoading(false);
                return;
            }

            try {
                const base64Image = await fileToBase64(blob);
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                
                const prompt = "You are 'SheStyle', a friendly and encouraging AI fashion expert from SheCareHub.com. Analyze the user's pose and outfit in this image. Provide positive and constructive feedback, highlighting what works well and offering one gentle suggestion for improvement (e.g., accessorizing, a different color combination, or a posture tip). Keep the tone upbeat and empowering. Start your feedback with 'Looking fabulous! ✨'.";
                
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: {
                        parts: [
                            { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
                            { text: prompt },
                        ],
                    },
                });

                setFeedback(response.text);
            } catch (err) {
                console.error("Gemini API error:", err);
                setError("Sorry, I couldn't analyze the photo. Please try again.");
            } finally {
                setIsLoading(false);
            }
        }, 'image/jpeg');
    };

    const handleTryAgain = () => {
        setCapturedImage(null);
        setFeedback(null);
        setError(null);
        startCamera();
    };

    return (
        <section id="virtual-mirror" className="py-24 bg-surface/50">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-4xl md:text-5xl font-heading text-accent mb-4">AI Virtual Mirror</h2>
                <p className="text-text-secondary mb-12 max-w-2xl mx-auto">
                    Check your look and get instant style feedback from our AI fashion expert, SheStyle!
                </p>

                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    {/* Mirror/Image View */}
                    <div className="relative w-full aspect-square bg-black/20 rounded-xl overflow-hidden shadow-lg mx-auto max-w-md">
                        <canvas ref={canvasRef} className="hidden" />
                        {capturedImage ? (
                            <img src={capturedImage} alt="User capture" className="w-full h-full object-cover"/>
                        ) : (
                            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]"></video>
                        )}
                        {!isCameraOn && !capturedImage && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                {error ? (
                                    <div className="p-4 text-center">
                                      <p className="text-white">{error}</p>
                                      <button onClick={startCamera} className="mt-4 bg-accent text-surface font-semibold py-2 px-5 rounded-md">Try Again</button>
                                    </div>
                                ) : (
                                    <button onClick={startCamera} className="bg-accent text-surface font-body font-semibold py-3 px-8 border-2 border-accent hover:bg-accent-hover transition-all duration-300 transform hover:scale-105">
                                        Start Camera
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Controls & Feedback */}
                    <div className="text-left">
                        {feedback ? (
                            <div className="bg-surface p-6 rounded-lg animate-fade-in">
                                <h3 className="text-2xl font-semibold text-text-primary mb-3 flex items-center gap-2">
                                  <SparklesIcon className="w-6 h-6 text-accent" /> SheStyle Says...
                                </h3>
                                <p className="text-text-secondary whitespace-pre-wrap">{feedback}</p>
                                <button onClick={handleTryAgain} className="mt-6 w-full bg-accent text-surface font-semibold py-3 px-6 rounded-lg transition-colors hover:bg-accent-hover">
                                    Try Again
                                </button>
                            </div>
                        ) : isLoading ? (
                            <div className="text-center p-6">
                                <svg className="animate-spin h-8 w-8 text-accent mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                <p className="mt-4 text-text-secondary">SheStyle is analyzing your look...</p>
                            </div>
                        ) : (
                             <div>
                                <h3 className="text-2xl font-heading text-text-primary mb-2">Ready for your close-up?</h3>
                                <p className="text-text-secondary mb-6">Strike a pose! When you're ready, capture your look to get instant feedback.</p>
                                <button
                                    onClick={handleCaptureAndAnalyze}
                                    disabled={!isCameraOn || isLoading}
                                    className="w-full bg-accent text-surface font-body font-semibold py-4 px-8 border-2 border-accent hover:bg-accent-hover transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
                                >
                                    <CaptureIcon className="w-6 h-6" />
                                    <span>Analyze My Look</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default VirtualMirror;
