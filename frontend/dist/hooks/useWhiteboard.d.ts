import type { Notebook, Page, Stroke, WhiteboardTool, PageBackground } from '../types/index.js';
export declare function useWhiteboard(): {
    currentPage: Page;
    addStroke: (stroke: Stroke) => void;
    addRemoteStroke: (stroke: Stroke) => void;
    eraseStroke: (strokeId: string) => void;
    clearPage: () => void;
    addPage: (background: PageBackground) => void;
    deletePage: (index: number) => void;
    navigatePage: (index: number) => void;
    setTool: (tool: WhiteboardTool) => void;
    setColor: (color: string) => void;
    setStrokeWidth: (width: number) => void;
    setBackground: (background: PageBackground) => void;
    loadNotebook: (notebook: Notebook) => void;
    notebook: Notebook;
    currentPageIndex: number;
    tool: WhiteboardTool;
    color: string;
    strokeWidth: number;
};
//# sourceMappingURL=useWhiteboard.d.ts.map