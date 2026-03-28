import type { Notebook, Stroke, WhiteboardTool, PageBackground } from '../types/whiteboard.js';
export interface WhiteboardState {
    notebook: Notebook;
    currentPageIndex: number;
    tool: WhiteboardTool;
    color: string;
    strokeWidth: number;
}
export type WhiteboardAction = {
    type: 'ADD_STROKE';
    stroke: Stroke;
} | {
    type: 'ADD_REMOTE_STROKE';
    stroke: Stroke;
} | {
    type: 'ERASE_STROKE';
    strokeId: string;
} | {
    type: 'CLEAR_PAGE';
} | {
    type: 'ADD_PAGE';
    background: PageBackground;
} | {
    type: 'DELETE_PAGE';
    index: number;
} | {
    type: 'NAVIGATE_PAGE';
    index: number;
} | {
    type: 'SET_TOOL';
    tool: WhiteboardTool;
} | {
    type: 'SET_COLOR';
    color: string;
} | {
    type: 'SET_WIDTH';
    width: number;
} | {
    type: 'SET_BACKGROUND';
    background: PageBackground;
} | {
    type: 'LOAD_NOTEBOOK';
    notebook: Notebook;
};
export declare function whiteboardReducer(state: WhiteboardState, action: WhiteboardAction): WhiteboardState;
export declare const initialWhiteboardState: WhiteboardState;
//# sourceMappingURL=whiteboardReducer.d.ts.map