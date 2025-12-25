'use client';

import { useState, useEffect } from 'react';
import CameraCapture from './components/CameraCapture';
import LoadingSpinner from './components/LoadingSpinner';
import VideoPlayer from './components/VideoPlayer';

interface VideoData {
  videoId: string;
  videoUrl: string;
  prompt: string;
}

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentVideo, setCurrentVideo] = useState<VideoData | null>(null);
  const [showReset, setShowReset] = useState(false);
  const [resetPassword, setResetPassword] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [expectedVideoId, setExpectedVideoId] = useState<string | null>(null);
  const [processingStartTime, setProcessingStartTime] = useState<number | null>(null);

  // Check if a video already exists on load
  useEffect(() => {
    const checkVideo = async () => {
      try {
        const response = await fetch('/api/upload-selfie');
        if (response.ok) {
          const data = await response.json();
          if (data.videoId) {
            setCurrentVideo(data);
          }
        }
      } catch (err) {
        console.error('Error checking for existing video:', err);
      }
    };
    checkVideo();
  }, []);

  const handleCapture = (file: File) => {
    setSelectedFile(file);
    setError(null);
  };

  // Countdown timer effect
  useEffect(() => {
    if (countdown === null || countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  // Poll for video when processing
  useEffect(() => {
    if (!isProcessing || !processingStartTime) return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch('/api/upload-selfie');
        if (response.ok) {
          const data = await response.json();
          if (data.videoId && data.videoUrl) {
            // Only accept the video if:
            // 1. It matches the expected video ID, OR
            // 2. It was created after we started processing (newer video)
            const videoCreatedAt = data.createdAt ? new Date(data.createdAt).getTime() : 0;
            const isExpectedVideo = expectedVideoId === data.videoId;
            const isNewVideo = videoCreatedAt > processingStartTime;

            if (isExpectedVideo || isNewVideo) {
              // Video is ready!
              setCurrentVideo({
                videoId: data.videoId,
                videoUrl: data.videoUrl,
                prompt: data.prompt || 'A Christmas video created with Justin\'s AI magic!',
              });
              setIsProcessing(false);
              setCountdown(null);
              setExpectedVideoId(null);
              setProcessingStartTime(null);
              clearInterval(pollInterval);
            }
          }
        }
      } catch (err) {
        console.error('Error polling for video:', err);
      }
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(pollInterval);
  }, [isProcessing, expectedVideoId, processingStartTime]);

  const handleSubmit = async () => {
    if (!selectedFile) return;

    // Clear any existing video and start fresh
    setCurrentVideo(null);
    setIsProcessing(true);
    setError(null);
    setCountdown(120); // Start 2-minute countdown
    setProcessingStartTime(Date.now()); // Track when we started processing

    try {
      const formData = new FormData();
      formData.append('selfie', selectedFile);

      // Start the video generation (this will take time)
      const response = await fetch('/api/upload-selfie', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to generate video');
      }

      const data = await response.json();
      
      if (data.videoId && data.videoUrl) {
        // Video is ready immediately (unlikely but possible)
        setCurrentVideo({
          videoId: data.videoId,
          videoUrl: data.videoUrl,
          prompt: data.prompt,
        });
        setIsProcessing(false);
        setCountdown(null);
        setExpectedVideoId(null);
        setProcessingStartTime(null);
      } else if (data.videoId) {
        // Video ID returned but video still processing - store it and let polling handle it
        setExpectedVideoId(data.videoId);
        // Keep isProcessing true so polling continues
      } else {
        throw new Error('No video ID returned');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsProcessing(false);
      setCountdown(null);
      setExpectedVideoId(null);
      setProcessingStartTime(null);
    }
  };

  const handleReset = async () => {
    if (resetPassword !== 'merry') {
      setError('Invalid password');
      return;
    }

    setIsResetting(true);
    try {
      const response = await fetch('/api/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: resetPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to reset');
      }

      // Clear the current video and reset form
      setCurrentVideo(null);
      setShowReset(false);
      setResetPassword('');
      setSelectedFile(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-100 via-pink-50 to-green-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-6xl animate-bounce" style={{ animationDuration: '3s' }}>🎄</div>
        <div className="absolute top-20 right-20 text-5xl animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}>❄️</div>
        <div className="absolute bottom-20 left-20 text-6xl animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '1s' }}>🎅</div>
        <div className="absolute bottom-10 right-10 text-5xl animate-bounce" style={{ animationDuration: '2s', animationDelay: '1.5s' }}>✨</div>
      </div>
      <div className="w-full max-w-2xl mx-auto text-center space-y-8 relative z-10">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-christmas-red to-christmas-green bg-clip-text text-transparent animate-pulse">
            🎄 Justin's Christmas Selfie Magic 🎅
          </h1>
          <p className="text-2xl md:text-3xl font-semibold text-gray-800">
            Watch your face become the star of a Christmas video! 🎬✨
          </p>
          <p className="text-lg text-gray-600 italic">
            - Created by Justin with AI magic 🪄
          </p>
        </div>

        {/* Main Content */}
        {currentVideo ? (
          // Show video if it exists
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-10 space-y-6 border-4 border-christmas-red">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-gray-800">🎄 Your Christmas Video is Ready! 🎅</h2>
              <VideoPlayer videoUrl={currentVideo.videoUrl} />
            </div>
            
            {/* Reset Button */}
            <div className="space-y-4">
              {!showReset ? (
                <button
                  onClick={() => setShowReset(true)}
                  className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  🔄 Reset (Admin Only)
                </button>
              ) : (
                <div className="space-y-3">
                  <input
                    type="password"
                    value={resetPassword}
                    onChange={(e) => setResetPassword(e.target.value)}
                    placeholder="Enter password to reset"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-christmas-red focus:outline-none"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleReset();
                      }
                    }}
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={handleReset}
                      disabled={isResetting}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isResetting ? 'Resetting...' : 'Reset Video'}
                    </button>
                    <button
                      onClick={() => {
                        setShowReset(false);
                        setResetPassword('');
                      }}
                      className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : !isProcessing ? (
          // Show upload form if no video exists
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-10 space-y-6 border-4 border-christmas-red">
            <CameraCapture onCapture={handleCapture} isProcessing={isProcessing} />
            
            {selectedFile && (
              <button
                onClick={handleSubmit}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-christmas-red to-christmas-green hover:from-red-700 hover:to-green-700 text-white font-bold py-5 px-8 rounded-lg text-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg animate-bounce"
              >
                🎅 Let Justin's Magic Create Your Video! ✨
              </button>
            )}

            {error && (
              <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-lg">
                <p className="font-semibold">Error:</p>
                <p>{error}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-12 border-4 border-christmas-red">
            <LoadingSpinner message="Creating your Christmas video..." />
            {countdown !== null && (
              <div className="mt-6 space-y-4">
                <div className="text-center">
                  <div className="text-6xl font-bold text-christmas-red mb-2">
                    {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
                  </div>
                  <p className="text-lg text-gray-600">
                    Estimated time remaining
                  </p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-christmas-red to-christmas-green h-4 rounded-full transition-all duration-1000"
                    style={{ width: `${((120 - countdown) / 120) * 100}%` }}
                  />
                </div>
              </div>
            )}
            <p className="mt-6 text-gray-600 text-lg">
              Justin's AI elves are crafting your Christmas masterpiece! 🎅✨
            </p>
          </div>
        )}

        {/* Footer */}
        <p className="text-sm text-gray-500">
          Powered by Justin's AI magic ✨ | Your Christmas video will be ready in about 2 minutes
        </p>
      </div>
    </main>
  );
}

