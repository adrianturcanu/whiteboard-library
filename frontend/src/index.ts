// Types
export type {
  WhiteboardTool,
  BackgroundType,
  StrokePoint,
  Stroke,
  PageBackground,
  Page,
  Notebook,
  NotebookMode,
  WhiteboardState,
  WhiteboardAction,
  WeeklyPlannerData,
  WeeklyPlannerDay,
  WeeklyPlannerTrackerItem,
} from './types/index.js';
export { PLANNER_DAYS } from './types/index.js';

// Hooks
export { useWhiteboard } from './hooks/index.js';
export { useWhiteboardSocket } from './hooks/index.js';

// Components
export { WeeklyPlanner, createEmptyPlanner, createTrackerItem } from './components/WeeklyPlanner.js';
