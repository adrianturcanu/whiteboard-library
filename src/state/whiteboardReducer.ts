import type { Notebook, Page, Stroke, WhiteboardTool, PageBackground } from '../types/whiteboard.js';
import { generateStrokeId, createDefaultNotebook } from '../utils/page.js';

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

function updateNotebookTimestamp(notebook: Notebook): Notebook {
  return { ...notebook, updatedAt: new Date().toISOString() };
}

export function whiteboardReducer(state: WhiteboardState, action: WhiteboardAction): WhiteboardState {
  switch (action.type) {
    case 'ADD_STROKE': {
      const pages = [...state.notebook.pages];
      const page = { ...pages[state.currentPageIndex] };
      page.strokes = [...page.strokes, action.stroke];
      pages[state.currentPageIndex] = page;
      return { ...state, notebook: updateNotebookTimestamp({ ...state.notebook, pages }) };
    }
    case 'ADD_REMOTE_STROKE': {
      const pages = [...state.notebook.pages];
      const page = { ...pages[state.currentPageIndex] };
      if (page.strokes.some((s) => s.id === action.stroke.id)) return state;
      page.strokes = [...page.strokes, action.stroke];
      pages[state.currentPageIndex] = page;
      return { ...state, notebook: updateNotebookTimestamp({ ...state.notebook, pages }) };
    }
    case 'ERASE_STROKE': {
      const pages = [...state.notebook.pages];
      const page = { ...pages[state.currentPageIndex] };
      page.strokes = page.strokes.filter((s) => s.id !== action.strokeId);
      pages[state.currentPageIndex] = page;
      return { ...state, notebook: updateNotebookTimestamp({ ...state.notebook, pages }) };
    }
    case 'CLEAR_PAGE': {
      const pages = [...state.notebook.pages];
      const page = { ...pages[state.currentPageIndex] };
      page.strokes = [];
      pages[state.currentPageIndex] = page;
      return { ...state, notebook: updateNotebookTimestamp({ ...state.notebook, pages }) };
    }
    case 'ADD_PAGE': {
      const newPage: Page = {
        id: generateStrokeId(),
        background: action.background,
        strokes: [],
      };
      const pages = [...state.notebook.pages, newPage];
      return {
        ...state,
        notebook: updateNotebookTimestamp({ ...state.notebook, pages }),
        currentPageIndex: pages.length - 1,
      };
    }
    case 'DELETE_PAGE': {
      if (state.notebook.pages.length <= 1) return state;
      const pages = state.notebook.pages.filter((_, i) => i !== action.index);
      const newIndex = Math.min(state.currentPageIndex, pages.length - 1);
      return {
        ...state,
        notebook: updateNotebookTimestamp({ ...state.notebook, pages }),
        currentPageIndex: newIndex,
      };
    }
    case 'NAVIGATE_PAGE':
      return { ...state, currentPageIndex: Math.max(0, Math.min(action.index, state.notebook.pages.length - 1)) };
    case 'SET_TOOL':
      return { ...state, tool: action.tool };
    case 'SET_COLOR':
      return { ...state, color: action.color };
    case 'SET_WIDTH':
      return { ...state, strokeWidth: action.width };
    case 'SET_BACKGROUND': {
      const pages = [...state.notebook.pages];
      const page = { ...pages[state.currentPageIndex] };
      page.background = action.background;
      pages[state.currentPageIndex] = page;
      return { ...state, notebook: updateNotebookTimestamp({ ...state.notebook, pages }) };
    }
    case 'LOAD_NOTEBOOK':
      return { ...state, notebook: action.notebook, currentPageIndex: 0 };
    default:
      return state;
  }
}

export const initialWhiteboardState: WhiteboardState = {
  notebook: createDefaultNotebook(),
  currentPageIndex: 0,
  tool: 'pen',
  color: '#000000',
  strokeWidth: 2,
};
