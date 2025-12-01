
export enum PlantStage {
  SEED = 'SEED',
  SPROUT = 'SPROUT',
  SAPLING = 'SAPLING',
  BUD = 'BUD',
  BLOOM = 'BLOOM'
}

export interface VocabularyWord {
  word: string;
  definition: string;
  hint: string;
  example: string;
  difficulty: string;
  category?: string;
}

export interface WordPair {
  id: string;
  finnish: string;
  match: string; // Emoji
  type: 'text' | 'emoji';
}

export interface LevelData {
  level: number;
  timeLimit: number; // seconds
  pairs: Array<{finnish: string, emoji: string}>;
}

export interface PodcastEpisode {
  id: string;
  title: string;
  topic: string;
  level: string;
  transcript: Array<{speaker: string, text: string}>;
  audioData?: ArrayBuffer; // Raw PCM data
}

export enum GameState {
  LOADING = 'LOADING',
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  SUCCESS = 'SUCCESS',
  GAMEOVER = 'GAMEOVER',
  ERROR = 'ERROR'
}
