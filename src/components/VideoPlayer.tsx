"use client";
import { useState } from "react";
import { Video } from "../features/movies/moviesSlice";

interface VideoPlayerProps {
  videos: Video[];
}

export default function VideoPlayer({ videos }: VideoPlayerProps) {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  // Filter for YouTube trailers and teasers
  const trailers = videos.filter(
    (video) => 
      video.site === "YouTube" && 
      (video.type === "Trailer" || video.type === "Teaser") &&
      video.official
  );

  if (trailers.length === 0) {
    return null;
  }

  const mainTrailer = selectedVideo || trailers[0];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Trailers & Videos</h3>
      
      {/* Main Video Player */}
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
        <iframe
          src={`https://www.youtube.com/embed/${mainTrailer.key}?rel=0&modestbranding=1`}
          title={mainTrailer.name}
          className="w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Video Thumbnails */}
      {trailers.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {trailers.map((video) => (
            <button
              key={video.id}
              onClick={() => setSelectedVideo(video)}
              className={`flex-shrink-0 relative group ${
                selectedVideo?.id === video.id || (!selectedVideo && video.id === trailers[0].id)
                  ? "ring-2 ring-blue-500"
                  : ""
              }`}
            >
              <div className="relative w-32 aspect-video bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                <img
                  src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
                  alt={video.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center group-hover:bg-opacity-30 transition-colors">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate max-w-32">
                {video.name}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}