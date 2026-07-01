import { useReducer, useMemo, useCallback } from 'react';
import type {
  Notebook,
  Page,
  Stroke,
  WhiteboardTool,
  PageBackground,
  WhiteboardState,
  WhiteboardAction,
} from '../types/index.js';

function generateStrokeId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

function createBlankPage(background?: PageBackground): Page {
  return {
    id: generateStrokeId(),
    background: background || { type: 'blank' },
    strokes: [],
  };
}

function createDefaultNotebook(title?: string): Notebook {
  return {
    version: 1,
    title: title || `Notebook ${new Date().toISOString().split('T')[0]}`,
    pages: [createBlankPage()],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function updateNotebookTimestamp(notebook: Notebook): Notebook {
  return { ...notebook, updatedAt: new Date().toISOString() };
}

function whiteboardReducer(state: WhiteboardState, action: WhiteboardAction): WhiteboardState {
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
    case 'IMPORT_PAGES': {
      // Bring pages in from another (e.g. a previous lesson's) notebook. Clone
      // with fresh page + stroke ids so they never collide with existing ids.
      const cloned: Page[] = action.pages.map((p) => ({
        ...p,
        id: generateStrokeId(),
        strokes: p.strokes.map((s) => ({ ...s, id: generateStrokeId() })),
      }));
      if (cloned.length === 0) return state;
      const replace = action.mode === 'replace';
      const pages = replace ? cloned : [...state.notebook.pages, ...cloned];
      // Land on the first imported page so the teacher sees what they brought in.
      const currentPageIndex = replace ? 0 : state.notebook.pages.length;
      return {
        ...state,
        notebook: updateNotebookTimestamp({ ...state.notebook, pages }),
        currentPageIndex,
      };
    }
    default:
      return state;
  }
}

const initialWhiteboardState: WhiteboardState = {
  notebook: createDefaultNotebook(),
  currentPageIndex: 0,
  tool: 'pen',
  color: '#000000',
  strokeWidth: 2,
};

export function useWhiteboard() {
  const [state, dispatch] = useReducer(whiteboardReducer, initialWhiteboardState);

  const addStroke = useCallback((stroke: Stroke) => dispatch({ type: 'ADD_STROKE', stroke }), []);
  const addRemoteStroke = useCallback((stroke: Stroke) => dispatch({ type: 'ADD_REMOTE_STROKE', stroke }), []);
  const eraseStroke = useCallback((strokeId: string) => dispatch({ type: 'ERASE_STROKE', strokeId }), []);
  const clearPage = useCallback(() => dispatch({ type: 'CLEAR_PAGE' }), []);
  const addPage = useCallback((background: PageBackground) => dispatch({ type: 'ADD_PAGE', background }), []);
  const deletePage = useCallback((index: number) => dispatch({ type: 'DELETE_PAGE', index }), []);
  const navigatePage = useCallback((index: number) => dispatch({ type: 'NAVIGATE_PAGE', index }), []);
  const setTool = useCallback((tool: WhiteboardTool) => dispatch({ type: 'SET_TOOL', tool }), []);
  const setColor = useCallback((color: string) => dispatch({ type: 'SET_COLOR', color }), []);
  const setStrokeWidth = useCallback((width: number) => dispatch({ type: 'SET_WIDTH', width }), []);
  const setBackground = useCallback((background: PageBackground) => dispatch({ type: 'SET_BACKGROUND', background }), []);
  const loadNotebook = useCallback((notebook: Notebook) => dispatch({ type: 'LOAD_NOTEBOOK', notebook }), []);
  const importPages = useCallback(
    (pages: Page[], mode: 'append' | 'replace' = 'append') => dispatch({ type: 'IMPORT_PAGES', pages, mode }),
    [],
  );

  const currentPage = useMemo(
    () => state.notebook.pages[state.currentPageIndex],
    [state.notebook.pages, state.currentPageIndex],
  );

  return {
    ...state,
    currentPage,
    addStroke,
    addRemoteStroke,
    eraseStroke,
    clearPage,
    addPage,
    deletePage,
    navigatePage,
    setTool,
    setColor,
    setStrokeWidth,
    setBackground,
    loadNotebook,
    importPages,
  };
}
