export type Point = { x: number; y: number };
export type GameStatus = 'idle' | 'playing' | 'gameover' | 'paused';

export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
}
