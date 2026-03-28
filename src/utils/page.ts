import type { Page, PageBackground, Notebook } from '../types/whiteboard.js';

export function generateStrokeId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

export function createBlankPage(background?: PageBackground): Page {
  return {
    id: generateStrokeId(),
    background: background || { type: 'blank' },
    strokes: [],
  };
}

export function createDefaultNotebook(title?: string): Notebook {
  return {
    version: 1,
    title: title || `Notebook ${new Date().toISOString().split('T')[0]}`,
    pages: [createBlankPage()],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
