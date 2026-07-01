export type WhiteboardTool = 'pen' | 'highlighter' | 'eraser' | 'text' | 'music-note' | 'grab';
export type BackgroundType = 'blank' | 'music-staff' | 'grid';
export type MusicSymbolType =
  | 'whole-note' | 'half-note' | 'quarter-note' | 'eighth-note'
  | 'sharp' | 'flat' | 'natural'
  | 'treble-clef' | 'bass-clef';

export interface StrokePoint { x: number; y: number; pressure?: number; }

export interface Stroke {
  id: string;
  path: StrokePoint[];
  color: string;
  width: number;
  tool: WhiteboardTool;
  userId: string;
  timestamp: number;
  // Text tool (when tool === 'text')
  text?: string;
  position?: { x: number; y: number };
  fontSize?: number;
  // Music notation (when tool === 'music-note')
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

/**
 * Weekly practice planner — a structured (non-freehand) note format filled in by
 * teacher and student. A 7-day grid of practice assignments, a per-item practice
 * tracker (items × Mon–Sun checkboxes with a per-day target), and a technique
 * notes box. Serialized as JSON inside a Notebook (notebook.planner) so a single
 * saved `.notebook` can be either freeform drawing OR a weekly planner.
 */
export const PLANNER_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

export interface WeeklyPlannerDay {
  /** One of PLANNER_DAYS. */
  day: string;
  /** The calendar date for that day, e.g. "Jun 22" (shown beside the day name). */
  date?: string;
  /** Free-text practice assignment(s) for that day. */
  assignments: string;
}

export interface WeeklyPlannerTrackerItem {
  id: string;
  /** What to practise, e.g. "G major scale". */
  label: string;
  /** Optional per-day target, e.g. "5/day". */
  target?: string;
  /** Seven booleans, Mon..Sun, marking the days it was practised. */
  days: boolean[];
}

export interface WeeklyPlannerData {
  version: 1;
  /** Free text for the week, e.g. "June 16–23". */
  weekOf?: string;
  /** Mon..Sun assignment cells (length 7). */
  days: WeeklyPlannerDay[];
  /** Practice tracker rows. */
  tracker: { items: WeeklyPlannerTrackerItem[] };
  /** Technique notes (e.g. LH/RH reminders). */
  notes: string;
  /** Section keys a student may edit in the portal (deferred; empty for now). */
  editableByStudent?: string[];
}

/** The note format a lesson workspace uses. */
export type NotebookMode = 'freeform' | 'weekly';

export interface Notebook {
  version: number;
  title: string;
  pages: Page[];
  createdAt: string;
  updatedAt: string;
  /** Which surface this notebook represents. Absent ⇒ 'freeform' (back-compat). */
  mode?: NotebookMode;
  /** Present when mode === 'weekly'. */
  planner?: WeeklyPlannerData;
}

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
  | { type: 'LOAD_NOTEBOOK'; notebook: Notebook }
  | { type: 'IMPORT_PAGES'; pages: Page[]; mode?: 'append' | 'replace' };
