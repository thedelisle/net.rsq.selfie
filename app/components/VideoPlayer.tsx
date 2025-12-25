'use client';

import { useState, useRef, useEffect } from 'react';

interface VideoPlayerProps {
  videoUrl: string;
  title?: string;
}

export default function VideoPlayer({ videoUrl, title }: VideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      
      const handleLoadedData = () => {
        setIsLoading(false);
        setHasError(false);
      };
      
      const handleError = () => {
        setIsLoading(false);
        setHasError(true);
        console.error('Video load error:', videoUrl);
      };
      
      video.addEventListener('loadeddata', handleLoadedData);
      video.addEventListener('error', handleError);
      
      // Try to load the video
      video.load();
      
      return () => {
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('error', handleError);
      };
    }
  }, [videoUrl]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p>Loading video...</p>
            </div>
          </div>
        )}
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-white text-center p-4">
              <p className="text-red-400 mb-2">⚠️ Video failed to load</p>
              <p className="text-sm text-gray-400">URL: {videoUrl.substring(0, 50)}...</p>
              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Open Video Directly
              </a>
            </div>
          </div>
        )}
        <video
          ref={videoRef}
          src={videoUrl}
          controls
          autoPlay
          loop
          muted={false}
          className="w-full h-full object-contain"
          playsInline
          preload="auto"
          onError={() => {
            setHasError(true);
            setIsLoading(false);
          }}
          onLoadedData={() => {
            setIsLoading(false);
            setHasError(false);
          }}
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
          <a href={videoUrl} download>Download the video</a>
        </video>
      </div>
      {title && (
        <h2 className="mt-4 text-2xl font-bold text-center text-gray-800">
          {title}
        </h2>
      )}
    </div>
  );
}

