import { useReducer, useMemo, useCallback } from 'react';
function generateStrokeId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}
function createBlankPage(background) {
    return {
        id: generateStrokeId(),
        background: background || { type: 'blank' },
        strokes: [],
    };
}
function createDefaultNotebook(title) {
    return {
        version: 1,
        title: title || `Notebook ${new Date().toISOString().split('T')[0]}`,
        pages: [createBlankPage()],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
}
function updateNotebookTimestamp(notebook) {
    return { ...notebook, updatedAt: new Date().toISOString() };
}
function whiteboardReducer(state, action) {
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
            if (page.strokes.some((s) => s.id === action.stroke.id))
                return state;
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
            const newPage = {
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
            if (state.notebook.pages.length <= 1)
                return state;
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
const initialWhiteboardState = {
    notebook: createDefaultNotebook(),
    currentPageIndex: 0,
    tool: 'pen',
    color: '#000000',
    strokeWidth: 2,
};
export function useWhiteboard() {
    const [state, dispatch] = useReducer(whiteboardReducer, initialWhiteboardState);
    const addStroke = useCallback((stroke) => dispatch({ type: 'ADD_STROKE', stroke }), []);
    const addRemoteStroke = useCallback((stroke) => dispatch({ type: 'ADD_REMOTE_STROKE', stroke }), []);
    const eraseStroke = useCallback((strokeId) => dispatch({ type: 'ERASE_STROKE', strokeId }), []);
    const clearPage = useCallback(() => dispatch({ type: 'CLEAR_PAGE' }), []);
    const addPage = useCallback((background) => dispatch({ type: 'ADD_PAGE', background }), []);
    const deletePage = useCallback((index) => dispatch({ type: 'DELETE_PAGE', index }), []);
    const navigatePage = useCallback((index) => dispatch({ type: 'NAVIGATE_PAGE', index }), []);
    const setTool = useCallback((tool) => dispatch({ type: 'SET_TOOL', tool }), []);
    const setColor = useCallback((color) => dispatch({ type: 'SET_COLOR', color }), []);
    const setStrokeWidth = useCallback((width) => dispatch({ type: 'SET_WIDTH', width }), []);
    const setBackground = useCallback((background) => dispatch({ type: 'SET_BACKGROUND', background }), []);
    const loadNotebook = useCallback((notebook) => dispatch({ type: 'LOAD_NOTEBOOK', notebook }), []);
    const currentPage = useMemo(() => state.notebook.pages[state.currentPageIndex], [state.notebook.pages, state.currentPageIndex]);
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
    };
}
//# sourceMappingURL=useWhiteboard.js.map