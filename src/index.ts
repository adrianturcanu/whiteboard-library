// Types
export type {
  WhiteboardTool,
  BackgroundType,
  StrokePoint,
  Stroke,
  PageBackground,
  Page,
  Notebook,
  WhiteboardConfig,
} from './types/index.js';

// State
export {
  whiteboardReducer,
  initialWhiteboardState,
} from './state/index.js';
export type { WhiteboardState, WhiteboardAction } from './state/index.js';

// Utils
export { generateStrokeId, createBlankPage, createDefaultNotebook } from './utils/index.js';

// Services
export { createWhiteboardSocket } from './services/index.js';
