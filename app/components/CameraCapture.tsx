'use client';

import { useRef, useState, useEffect } from 'react';

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  isProcessing: boolean;
}

export default function CameraCapture({ onCapture, isProcessing }: CameraCaptureProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      setError(null);
      setPreview(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      setIsCameraActive(true);
    } catch (err) {
      setError('Could not access camera. Please allow camera permissions and try again.');
      setIsCameraActive(false);
      console.error('Camera error:', err);
    }
  };

  // Effect to assign stream to video element when camera becomes active
  useEffect(() => {
    if (isCameraActive && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(err => {
        console.error('Error playing video:', err);
      });
    }
    return () => {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [isCameraActive]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0);
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });
        setPreview(URL.createObjectURL(blob));
        stopCamera();
        onCapture(file);
      }
    }, 'image/jpeg', 0.9);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {!preview && !isCameraActive && (
        <div className="space-y-4">
          <button
            onClick={startCamera}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-christmas-red to-christmas-green hover:from-red-700 hover:to-green-700 text-white font-bold py-6 px-8 rounded-xl text-2xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl animate-pulse"
          >
            📸 Take Your Selfie! 🎄
          </button>
          <p className="text-center text-gray-600 text-sm">
            Click to activate your camera and capture the perfect selfie!
          </p>
        </div>
      )}

      {isCameraActive && !preview && (
        <div className="space-y-4">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full rounded-lg shadow-lg"
            style={{ transform: 'scaleX(-1)' }}
          />
          <div className="flex gap-4">
            <button
              onClick={capturePhoto}
              className="flex-1 bg-christmas-red hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors shadow-lg"
            >
              📷 Capture
            </button>
            <button
              onClick={() => {
                stopCamera();
              }}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors shadow-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {preview && (
        <div className="space-y-4">
          <div className="relative w-full aspect-square rounded-lg overflow-hidden shadow-lg">
            <img
              src={preview}
              alt="Selfie preview"
              className="w-full h-full object-cover"
            />
          </div>
          <button
            onClick={() => {
              setPreview(null);
              stopCamera();
            }}
            disabled={isProcessing}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            📸 Take Another Selfie
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
    </div>
  );
}

