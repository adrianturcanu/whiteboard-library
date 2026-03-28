export type WhiteboardTool = 'pen' | 'highlighter' | 'eraser';
export type BackgroundType = 'blank' | 'music-staff' | 'grid';

export interface StrokePoint { x: number; y: number; pressure?: number; }

export interface Stroke {
  id: string;
  path: StrokePoint[];
  color: string;
  width: number;
  tool: WhiteboardTool;
  userId: string;
  timestamp: number;
}

export interface PageBackground {
  type: BackgroundType;
  gridSize?: number;
}

export interface Page {
  id: string;
  background: PageBackground;
  strokes: Stroke[];
}

export interface Notebook {
  version: number;
  title: string;
  pages: Page[];
  createdAt: string;
  updatedAt: string;
}

export interface WhiteboardConfig {
  session: { adminSessionKey: string; portalSessionKey: string };
  jwt?: {
    verifyAccessToken: (token: string) => { sub: number; userType: string; [key: string]: unknown } | null;
  };
}
