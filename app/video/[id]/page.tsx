'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import VideoPlayer from '@/app/components/VideoPlayer';
import LoadingSpinner from '@/app/components/LoadingSpinner';

interface VideoData {
  id: string;
  url: string;
  prompt: string;
  createdAt: string;
}

export default function VideoPage() {
  const params = useParams();
  const videoId = params.id as string;
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await fetch(`/api/video/${videoId}`);
        if (!response.ok) {
          throw new Error('Video not found');
        }
        const data = await response.json();
        console.log('Video data received:', data);
        console.log('Video URL:', data.url);
        setVideoData(data);
      } catch (err) {
        console.error('Error fetching video:', err);
        setError(err instanceof Error ? err.message : 'Failed to load video');
      } finally {
        setLoading(false);
      }
    };

    if (videoId) {
      fetchVideo();
    }
  }, [videoId]);

  const copyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareToTwitter = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Check out my hilarious Christmas video! 🎄');
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const shareToFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 flex items-center justify-center p-4">
        <LoadingSpinner message="Loading your video..." />
      </main>
    );
  }

  if (error || !videoData) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center">
          <h1 className="text-3xl font-bold text-christmas-red mb-4">Oops! 🎄</h1>
          <p className="text-gray-700 mb-6">{error || 'Video not found'}</p>
          <a
            href="/"
            className="inline-block bg-christmas-green hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Create New Video
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-christmas-red to-christmas-green bg-clip-text text-transparent animate-pulse">
            🎄 Justin's Christmas Magic is Ready! 🎅
          </h1>
          <p className="text-xl text-gray-700 font-semibold">
            Your hilarious video is here! Share it with everyone! 🎬✨
          </p>
          <p className="text-sm text-gray-500 italic">
            - Created by Justin's AI magic 🪄
          </p>
        </div>

        {/* Video Player */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
          {videoData.url ? (
            <VideoPlayer videoUrl={videoData.url} />
          ) : (
            <div className="text-center py-8">
              <p className="text-red-500">Video URL not available</p>
            </div>
          )}
        </div>

        {/* Share Buttons */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Share Your Video
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={copyLink}
              className={`flex items-center justify-center gap-2 py-4 px-6 rounded-lg font-semibold transition-all ${
                copied
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
            >
              {copied ? '✓ Copied!' : '📋 Copy Link'}
            </button>
            <button
              onClick={shareToTwitter}
              className="flex items-center justify-center gap-2 bg-blue-400 hover:bg-blue-500 text-white py-4 px-6 rounded-lg font-semibold transition-colors"
            >
              🐦 Share on Twitter
            </button>
            <button
              onClick={shareToFacebook}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-lg font-semibold transition-colors"
            >
              📘 Share on Facebook
            </button>
          </div>
        </div>

        {/* Prompt Info */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            🎬 Video Prompt
          </h2>
          <p className="text-gray-700 italic">{videoData.prompt}</p>
        </div>

        {/* Create Another Button */}
        <div className="text-center">
          <a
            href="/"
            className="inline-block bg-gradient-to-r from-christmas-red to-christmas-green hover:from-red-700 hover:to-green-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-105 shadow-lg"
          >
            ✨ Create Another Video ✨
          </a>
        </div>
      </div>
    </main>
  );
}

