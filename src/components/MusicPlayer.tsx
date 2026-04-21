import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, AlertCircle } from 'lucide-react';
import { Track } from '../types';
import { useRef, useState, useEffect } from 'react';

interface MusicPlayerProps {
  tracks: Track[];
}

export function MusicPlayer({ tracks }: MusicPlayerProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = tracks[currentTrackIndex];

  // Auto-play when track changes (if it was already playing)
  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => {
        console.error("Audio playback error:", e);
        setError("Playback restricted. Interact to play.");
        setIsPlaying(false);
      });
    }
  }, [currentTrackIndex]);

  const togglePlay = () => {
    setError(null);
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(e => {
          console.error("Playback failed", e);
          setError("Click anywhere in the app first.");
        });
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
  };

  const skipBack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleEnded = () => {
    skipForward();
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div id="music-player" className="h-[100px] bg-[#0c0c0e]/95 border-t border-white/10 flex items-center px-10 gap-8 justify-between rounded-[20px] shadow-[0_-10px_40px_rgba(0,0,0,0.5)] relative z-20 w-full mb-2">
      <audio
        id="audio-element"
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onLoadedMetadata={handleTimeUpdate}
      />

      <div className="flex items-center w-full">
        
        {/* Track Info */}
        <div id="track-info-container" className="flex items-center gap-4 min-w-[240px]">
          <div id="album-art" className="w-14 h-14 bg-gradient-to-tr from-[#222] to-[#444] rounded-lg shrink-0 relative overflow-hidden flex items-center justify-center">
            {/* Visualizer bars when playing */}
            {isPlaying && (
              <div className="flex items-end justify-center gap-1 w-full h-full p-3 opacity-80">
                <div className="w-1.5 bg-[#00f2ff] animate-[bounce_0.8s_infinite] h-full" />
                <div className="w-1.5 bg-[#ff00ff] animate-[bounce_1.2s_infinite] h-2/3" />
                <div className="w-1.5 bg-[#00f2ff] animate-[bounce_0.9s_infinite] h-4/5" />
              </div>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span id="track-title" className="font-semibold text-[14px] text-white flex items-center gap-2">
              {currentTrack.title}
              {error && <AlertCircle className="w-4 h-4 text-rose-500" title={error} />}
            </span>
            <span id="track-artist" className="text-[12px] opacity-60 text-white truncate">{currentTrack.artist}</span>
          </div>
        </div>

        {/* Progress */}
        <div id="progress-container" className="flex-grow mx-[60px] flex flex-col justify-center max-w-3xl">
          <div className="flex justify-between text-[10px] mb-2 opacity-40 font-mono text-white">
            <span id="time-current">{formatTime(progress)}</span>
            <span id="time-duration">{formatTime(duration)}</span>
          </div>
          <div id="progress-bar-bg" className="h-1 bg-white/10 rounded-sm w-full relative">
            <div 
              id="progress-bar-fill"
              className="h-full bg-[#00f2ff] shadow-[0_0_10px_#00f2ff] rounded-sm"
              style={{ width: duration ? `${(progress / duration) * 100}%` : '0%' }}
            />
          </div>
        </div>

        {/* Controls */}
        <div id="player-controls" className="flex items-center gap-[32px] shrink-0">
            <div id="btn-prev" className="opacity-50 text-[12px] font-bold tracking-wider cursor-pointer hover:opacity-100 transition-opacity text-white" onClick={skipBack}>PREV</div>
            <button 
              id="btn-play-pause"
              onClick={togglePlay}
              className="w-14 h-14 flex items-center justify-center rounded-full bg-white text-black hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause className="fill-current w-6 h-6" /> : <Play className="fill-current ml-1 w-6 h-6" />}
            </button>
            <div id="btn-skip" className="opacity-50 text-[12px] font-bold tracking-wider cursor-pointer hover:opacity-100 transition-opacity text-white" onClick={skipForward}>SKIP</div>
            <button 
              id="btn-mute"
              onClick={toggleMute}
              className="text-white hover:text-[#00f2ff] transition-colors ml-4"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
        </div>

      </div>
    </div>
  );
}
