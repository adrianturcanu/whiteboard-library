export type WhiteboardTool = 'pen' | 'highlighter' | 'eraser' | 'text' | 'music-note' | 'grab';
export type BackgroundType = 'blank' | 'music-staff' | 'grid';
export type MusicSymbolType = 'whole-note' | 'half-note' | 'quarter-note' | 'eighth-note' | 'sharp' | 'flat' | 'natural' | 'treble-clef' | 'bass-clef';
export interface StrokePoint {
    x: number;
    y: number;
    pressure?: number;
}
export interface Stroke {
    id: string;
    path: StrokePoint[];
    color: string;
    width: number;
    tool: WhiteboardTool;
    userId: string;
    timestamp: number;
    text?: string;
    position?: {
        x: number;
        y: number;
    };
    fontSize?: number;
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
export interface WhiteboardConfig {
    session: {
        adminSessionKey: string;
        portalSessionKey: string;
    };
    jwt?: {
        verifyAccessToken: (token: string) => {
            sub: number;
            userType: string;
            [key: string]: unknown;
        } | null;
    };
}
//# sourceMappingURL=whiteboard.d.ts.map