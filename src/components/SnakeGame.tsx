import { useSnakeLogic } from '../hooks/useSnakeLogic';
import { Trophy, Play, RotateCcw } from 'lucide-react';

export function SnakeGame() {
  const { snake, food, status, score, highScore, resetGame, setStatus, GRID_SIZE } = useSnakeLogic();

  // Create grid cells
  const cells = Array.from({ length: GRID_SIZE * GRID_SIZE });

  return (
    <div id="snake-game-container" className="flex flex-col items-center justify-center gap-6 w-full max-w-2xl mx-auto z-10 relative">
      
      {/* Score Header */}
      <div id="snake-score-header" className="flex items-center justify-center gap-12 w-full px-4 mb-8">
        <div className="flex flex-col" id="current-score-container">
          <span className="text-[11px] uppercase tracking-[2px] text-white/40 mb-1">CURRENT SCORE</span>
          <span id="current-score" className="text-[32px] font-bold font-mono text-[#00f2ff] leading-none">
            {score.toString().padStart(6, '0')}
          </span>
        </div>
        <div className="flex flex-col" id="high-score-container">
          <span className="text-[11px] uppercase tracking-[2px] text-white/40 mb-1">HIGH SCORE</span>
          <span id="high-score" className="text-[32px] font-bold font-mono text-[#00f2ff] leading-none">
            {highScore.toString().padStart(6, '0')}
          </span>
        </div>
      </div>

      {/* Game Board Container */}
      <div id="snake-board-container" className="relative group flex justify-center w-full">
        
        {/* The Grid Canvas */}
        <div 
          id="snake-grid"
          className="grid bg-[#0c0c0e] border-4 border-[#00f2ff] shadow-[0_0_30px_rgba(0,242,255,0.2),inset_0_0_15px_rgba(0,242,255,0.1)] relative"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            width: 'min(80vw, 55vh)',
            height: 'min(80vw, 55vh)',
          }}
        >
          {cells.map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isHead = snake[0].x === x && snake[0].y === y;
            const isBody = !isHead && snake.some(s => s.x === x && s.y === y);
            const isFood = food.x === x && food.y === y;

            if (isHead) {
              return (
                <div key={i} className="flex items-center justify-center p-[1px]">
                  <div className="w-full h-full bg-white shadow-[0_0_12px_#fff] rounded-[2px] z-10" />
                </div>
              );
            }
            if (isBody) {
              return (
                <div key={i} className="flex items-center justify-center p-[1px]">
                  <div className="w-full h-full bg-[#00f2ff] shadow-[0_0_8px_#00f2ff] rounded-[2px]" />
                </div>
              );
            }
            if (isFood) {
              return (
                <div key={i} className="flex items-center justify-center p-[1px]">
                   <div className="w-full h-full bg-[#ff00ff] rounded-full shadow-[0_0_12px_#ff00ff] animate-pulse" />
                </div>
              );
            }

            // Empty tile subtly visible
            return (
              <div key={i} />
            );
          })}

          {/* Overlays */}
          {status === 'idle' && (
            <div id="overlay-idle" className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-20">
              <button 
                id="btn-start-game"
                onClick={resetGame}
                className="group flex flex-col items-center gap-4 transition-transform hover:scale-105"
              >
                <div className="w-16 h-16 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center ring-1 ring-cyan-400 group-hover:bg-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.4)]">
                  <Play className="w-8 h-8 ml-1 fill-current" />
                </div>
                <span className="font-mono text-cyan-50 tracking-widest text-lg font-bold">START GAME</span>
              </button>
            </div>
          )}

          {status === 'gameover' && (
            <div id="overlay-gameover" className="absolute inset-0 bg-rose-950/80 backdrop-blur-sm flex flex-col items-center justify-center z-20 gap-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-rose-500 font-mono tracking-widest drop-shadow-[0_0_10px_rgba(244,63,94,0.8)]">GAME OVER</h2>
                <p className="text-rose-200/60 mt-2 font-mono">Score: {score}</p>
              </div>
              <button 
                id="btn-retry-game"
                onClick={resetGame}
                className="group flex items-center gap-2 px-6 py-3 rounded-full bg-rose-500/20 text-rose-400 ring-1 ring-rose-400 hover:bg-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.4)] transition-all"
              >
                <RotateCcw className="w-5 h-5" />
                <span className="font-mono tracking-widest font-bold">TRY AGAIN</span>
              </button>
            </div>
          )}

          {status === 'paused' && (
            <div id="overlay-paused" className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center z-20">
              <span className="text-4xl font-bold font-mono tracking-widest text-white/90 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">PAUSED</span>
              <button 
                id="btn-resume-game"
                onClick={() => setStatus('playing')}
                className="mt-6 px-6 py-2 rounded border border-white/20 text-white/70 hover:bg-white/10 hover:text-white font-mono transition-colors"
              >
                Resume (Space)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div id="game-instructions" className="flex gap-8 text-neutral-500 font-mono text-xs opacity-70">
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-neutral-900 rounded border border-neutral-800 text-neutral-300 shadow-[0_4px_4px_-2px_rgba(0,0,0,0.5)]">W A S D</span>
          <span>to move</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-neutral-900 rounded border border-neutral-800 text-neutral-300 shadow-[0_4px_4px_-2px_rgba(0,0,0,0.5)]">SPACE</span>
          <span>to pause</span>
        </div>
      </div>

    </div>
  );
}
