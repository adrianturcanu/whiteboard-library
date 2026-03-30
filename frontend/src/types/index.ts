export type WhiteboardTool = 'pen' | 'highlighter' | 'eraser' | 'text' | 'music-note' | 'grab';
export type BackgroundType = 'blank' | 'music-staff' | 'grid';
export type MusicSymbolType =
  | 'whole-note' | 'half-note' | 'quarter-note' | 'eighth-note'
  | 'sharp' | 'flat' | 'natural'
  | 'treble-clef' | 'bass-clef';

export interface StrokePoint { x: number; y: number; pressure?: number; }

export interface Stroke {
  id: string;
  path: StrokePoint[];
  color: string;
  width: number;
  tool: WhiteboardTool;
  userId: string;
  timestamp: number;
  // Text tool (when tool === 'text')
  text?: string;
  position?: { x: number; y: number };
  fontSize?: number;
  // Music notation (when tool === 'music-note')
  musicSymbol?: MusicSymbolType;
  staffLine?: number;
}

export interface PageBackground {
  type: BackgroundType;
  gridSize?: number;
}

export interface BackgroundZone {
  startY: number;
  background: PageBackground;
}

export interface Page {
  id: string;
  background: PageBackground;
  backgroundZones?: BackgroundZone[];
  strokes: Stroke[];
}

export interface Notebook {
  version: number;
  title: string;
  pages: Page[];
  createdAt: string;
  updatedAt: string;
}

export interface WhiteboardState {
  notebook: Notebook;
  currentPageIndex: number;
  tool: WhiteboardTool;
  color: string;
  strokeWidth: number;
}

export type WhiteboardAction =
  | { type: 'ADD_STROKE'; stroke: Stroke }
  | { type: 'ADD_REMOTE_STROKE'; stroke: Stroke }
  | { type: 'ERASE_STROKE'; strokeId: string }
  | { type: 'CLEAR_PAGE' }
  | { type: 'ADD_PAGE'; background: PageBackground }
  | { type: 'DELETE_PAGE'; index: number }
  | { type: 'NAVIGATE_PAGE'; index: number }
  | { type: 'SET_TOOL'; tool: WhiteboardTool }
  | { type: 'SET_COLOR'; color: string }
  | { type: 'SET_WIDTH'; width: number }
  | { type: 'SET_BACKGROUND'; background: PageBackground }
  | { type: 'LOAD_NOTEBOOK'; notebook: Notebook };
