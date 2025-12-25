'use client';

import { useState, useEffect } from 'react';
import CameraCapture from './components/CameraCapture';
import LoadingSpinner from './components/LoadingSpinner';
import VideoPlayer from './components/VideoPlayer';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

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

  const handleSubmit = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('selfie', selectedFile);

      const response = await fetch('/api/upload-selfie', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to generate video');
      }

      const data = await response.json();
      
      if (data.videoId) {
        // Set the current video and stay on home page
        setCurrentVideo({
          videoId: data.videoId,
          videoUrl: data.videoUrl,
          prompt: data.prompt,
        });
        setIsProcessing(false);
      } else {
        throw new Error('No video ID returned');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsProcessing(false);
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
            <LoadingSpinner message="Creating your Christmas video... This may take a minute!" />
            <p className="mt-6 text-gray-600 text-lg">
              Justin's AI elves are crafting your Christmas masterpiece! 🎅✨
            </p>
          </div>
        )}

        {/* Footer */}
        <p className="text-sm text-gray-500">
          Powered by Justin's AI magic ✨ | Your Christmas video will be ready in about 30-60 seconds
        </p>
      </div>
    </main>
  );
}

