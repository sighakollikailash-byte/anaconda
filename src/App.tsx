import { MusicPlayer } from './components/MusicPlayer';
import { SnakeGame } from './components/SnakeGame';
import { TRACKS } from './constants';
import { motion } from 'motion/react';

export default function App() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col justify-between overflow-hidden relative bg-[#050505] text-white selection:bg-fuchsia-500/30"
      id="app-container"
    >
      
      {/* Header */}
      <header id="app-header" className="p-6 shrink-0 relative z-20 flex justify-between items-center border-b border-white/10 mx-6">
        <div className="flex flex-col">
          <h1 id="app-logo" className="text-[42px] font-black uppercase tracking-[-2px] italic bg-gradient-to-r from-[#00f2ff] to-[#ff00ff] bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(0,242,255,0.5)] leading-none">
            Neon Snake Radio
          </h1>
        </div>
        <div className="text-right">
          <div className="text-[11px] uppercase tracking-[2px] text-white/40 mb-1">DIFFICULTY</div>
          <div className="text-sm font-bold">OVERDRIVE</div>
        </div>
      </header>

      {/* Main Game Area */}
      <main id="app-main" className="flex-1 flex flex-col items-center justify-center p-4">
        <SnakeGame />
      </main>

      {/* Bottom Music Player */}
      <div id="app-footer" className="px-6 pb-6 w-full">
        <MusicPlayer tracks={TRACKS} />
      </div>
    </motion.div>
  );
}
