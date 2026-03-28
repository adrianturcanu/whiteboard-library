import { generateStrokeId, createDefaultNotebook } from '../utils/page.js';
function updateNotebookTimestamp(notebook) {
    return { ...notebook, updatedAt: new Date().toISOString() };
}
export function whiteboardReducer(state, action) {
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
export const initialWhiteboardState = {
    notebook: createDefaultNotebook(),
    currentPageIndex: 0,
    tool: 'pen',
    color: '#000000',
    strokeWidth: 2,
};
//# sourceMappingURL=whiteboardReducer.js.map