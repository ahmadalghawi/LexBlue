"use client";

import { useState, useEffect } from "react";
import { Play, Pause, Volume2, Settings, Maximize, Eye } from "lucide-react";

interface VideoPlayerProps {
  currentTime: string;
  totalTime: string;
  thumbnailUrl?: string;
  onProgressChange?: (progress: number) => void;
}

export function VideoPlayer({
  currentTime,
  totalTime,
  thumbnailUrl,
  onProgressChange,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // Calculate initial progress from time strings
  useEffect(() => {
    const parseTime = (time: string) => {
      const parts = time.split(":").map(Number);
      return parts.length === 2 ? parts[0] * 60 + parts[1] : 0;
    };
    const current = parseTime(currentTime);
    const total = parseTime(totalTime);
    if (total > 0) {
      setProgress((current / total) * 100);
    }
  }, [currentTime, totalTime]);

  // Simulate video progress when playing
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 0.1, 100));
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Notify parent of progress changes
  useEffect(() => {
    onProgressChange?.(progress);
  }, [progress, onProgressChange]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="relative w-full rounded-xl overflow-hidden bg-neutral-900 shadow-lg">
      {/* Video thumbnail / placeholder */}
      <div className="relative aspect-video bg-gradient-to-br from-slate-800 to-slate-900">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt="Video thumbnail"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Code editor simulation background */}
            <div className="absolute inset-0 opacity-60">
              <div className="h-full w-full bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 p-4">
                <div className="space-y-2 font-mono text-xs text-slate-400 opacity-40">
                  <div>const deploy = async () =&gt; {"{"}</div>
                  <div className="pl-4">await buildContainer();</div>
                  <div className="pl-4">await pushToRegistry();</div>
                  <div className="pl-4">await updateKubernetes();</div>
                  <div>{"}"}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Center play button */}
        <button
          onClick={togglePlay}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-primary flex items-center justify-center hover:scale-110 transition-transform shadow-xl"
        >
          {isPlaying ? (
            <Pause className="w-7 h-7 text-primary-foreground" />
          ) : (
            <Play className="w-7 h-7 text-primary-foreground ml-1" />
          )}
        </button>
      </div>

      {/* Video controls bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
        {/* Progress bar */}
        <div className="mb-3 group">
          <div
            className="h-1 bg-white/20 rounded-full cursor-pointer hover:h-1.5 transition-all"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const newProgress = (x / rect.width) * 100;
              setProgress(newProgress);
            }}
          >
            <div
              className="h-full bg-primary rounded-full relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md" />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlay}
              className="hover:text-primary transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </button>
            <button className="hover:text-primary transition-colors">
              <Volume2 className="w-5 h-5" />
            </button>
            <span className="text-sm font-medium">
              {currentTime} / {totalTime}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button className="hover:text-primary transition-colors flex items-center gap-1.5 text-sm">
              <Eye className="w-4 h-4" />
            </button>
            <button className="hover:text-primary transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <button className="hover:text-primary transition-colors">
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
