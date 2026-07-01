import type { CSSProperties } from 'react';
import {
  PLANNER_DAYS,
  type WeeklyPlannerData,
  type WeeklyPlannerTrackerItem,
} from '../types/index.js';

/**
 * Structured weekly practice planner (Iteration 5). A controlled component: it
 * renders `value` and emits the next value via `onChange`. Filled in by both
 * teacher and student; `readOnly` renders a non-editable view (used in the
 * student/parent portal). `editableSections` is reserved for future
 * student-editable sections — ignored while readOnly applies to everything.
 *
 * Styled entirely with inline styles so the shared component renders correctly
 * in any host (Fun4Strings, Maslin) WITHOUT needing a Tailwind safelist entry.
 * Sized for tablet/touch (large checkboxes, generous tap targets).
 */

let idCounter = 0;
function genId(): string {
  idCounter += 1;
  return `tk_${Date.now().toString(36)}_${idCounter}`;
}

/** A blank tracker row. */
export function createTrackerItem(label = ''): WeeklyPlannerTrackerItem {
  return { id: genId(), label, target: '', days: [false, false, false, false, false, false, false] };
}

/** Monday (local) of the week containing `d`. */
function startOfWeek(d: Date): Date {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const mondayOffset = (x.getDay() + 6) % 7; // 0 = Monday … 6 = Sunday
  x.setDate(x.getDate() - mondayOffset);
  return x;
}

/** "Jun 22"-style short date. */
function fmtMonthDay(d: Date): string {
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

/**
 * An empty planner pre-populated with the CURRENT week: `weekOf` is the Mon–Sun
 * range and each day cell carries its calendar date (e.g. "Mon" + "Jun 22").
 */
export function createEmptyPlanner(now: Date = new Date()): WeeklyPlannerData {
  const monday = startOfWeek(now);
  const dates = PLANNER_DAYS.map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
  return {
    version: 1,
    weekOf: `${fmtMonthDay(dates[0])} – ${fmtMonthDay(dates[6])}`,
    days: PLANNER_DAYS.map((day, i) => ({ day, date: fmtMonthDay(dates[i]), assignments: '' })),
    tracker: { items: [createTrackerItem()] },
    notes: '',
    editableByStudent: [],
  };
}

const COLORS = {
  border: '#e7ddd0',
  headerBg: '#faf6ef',
  label: '#8a7866',
  text: '#5c4a3a',
  accent: '#800020',
};

const cellInput: CSSProperties = {
  width: '100%',
  border: 'none',
  outline: 'none',
  resize: 'vertical',
  font: 'inherit',
  color: COLORS.text,
  background: 'transparent',
};

interface WeeklyPlannerProps {
  value: WeeklyPlannerData;
  onChange?: (next: WeeklyPlannerData) => void;
  readOnly?: boolean;
  editableSections?: string[];
}

export function WeeklyPlanner({ value, onChange, readOnly = false }: WeeklyPlannerProps) {
  const emit = (next: WeeklyPlannerData) => {
    if (!readOnly && onChange) onChange(next);
  };

  const setWeekOf = (weekOf: string) => emit({ ...value, weekOf });
  const setNotes = (notes: string) => emit({ ...value, notes });

  const setDayAssignment = (index: number, assignments: string) => {
    const days = value.days.map((d, i) => (i === index ? { ...d, assignments } : d));
    emit({ ...value, days });
  };

  const setItem = (id: string, patch: Partial<WeeklyPlannerTrackerItem>) => {
    const items = value.tracker.items.map((it) => (it.id === id ? { ...it, ...patch } : it));
    emit({ ...value, tracker: { items } });
  };

  const toggleDay = (id: string, dayIndex: number) => {
    const items = value.tracker.items.map((it) =>
      it.id === id ? { ...it, days: it.days.map((v, i) => (i === dayIndex ? !v : v)) } : it,
    );
    emit({ ...value, tracker: { items } });
  };

  const addItem = () => emit({ ...value, tracker: { items: [...value.tracker.items, createTrackerItem()] } });
  const removeItem = (id: string) =>
    emit({ ...value, tracker: { items: value.tracker.items.filter((it) => it.id !== id) } });

  const labelStyle: CSSProperties = {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: COLORS.label,
    fontWeight: 600,
  };

  return (
    <div data-testid="weekly-planner" style={{ color: COLORS.text, fontSize: 14 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: COLORS.text }}>Weekly planner</h3>
        <input
          aria-label="Week of"
          placeholder="Week of…"
          value={value.weekOf ?? ''}
          onChange={(e) => setWeekOf(e.target.value)}
          readOnly={readOnly}
          style={{
            flex: 1,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 8,
            padding: '6px 10px',
            font: 'inherit',
            color: COLORS.text,
            background: readOnly ? COLORS.headerBg : '#fff',
          }}
        />
      </div>

      {/* 7-day assignment grid — ~3 large cells per row (1 column on narrow screens) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: 12,
          marginBottom: 16,
        }}
      >
        {value.days.map((d, i) => (
          <div
            key={d.day}
            style={{ border: `1px solid ${COLORS.border}`, borderRadius: 8, overflow: 'hidden' }}
          >
            <div style={{ ...labelStyle, fontSize: 13, padding: '10px 12px', background: COLORS.headerBg }}>
              {d.day}
              {d.date ? <span style={{ color: COLORS.text, marginLeft: 6 }}>{d.date}</span> : null}
            </div>
            <textarea
              aria-label={`${d.day} assignments`}
              value={d.assignments}
              onChange={(e) => setDayAssignment(i, e.target.value)}
              readOnly={readOnly}
              rows={12}
              style={{ ...cellInput, padding: 12, minHeight: 260, fontSize: 15, lineHeight: 1.5 }}
            />
          </div>
        ))}
      </div>

      {/* Practice tracker */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ ...labelStyle, marginBottom: 6 }}>Practice tracker</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 520 }}>
            <thead>
              <tr>
                <th style={{ ...labelStyle, textAlign: 'left', padding: 6 }}>Item</th>
                <th style={{ ...labelStyle, textAlign: 'left', padding: 6, width: 80 }}>Target</th>
                {PLANNER_DAYS.map((day) => (
                  <th key={day} style={{ ...labelStyle, textAlign: 'center', padding: 6, width: 40 }}>
                    {day[0]}
                  </th>
                ))}
                {!readOnly && <th style={{ width: 32 }} />}
              </tr>
            </thead>
            <tbody>
              {value.tracker.items.map((it) => (
                <tr key={it.id} style={{ borderTop: `1px solid ${COLORS.border}` }}>
                  <td style={{ padding: 6 }}>
                    <input
                      aria-label="Tracker item"
                      value={it.label}
                      onChange={(e) => setItem(it.id, { label: e.target.value })}
                      readOnly={readOnly}
                      placeholder="What to practise…"
                      style={{ ...cellInput, padding: 4 }}
                    />
                  </td>
                  <td style={{ padding: 6 }}>
                    <input
                      aria-label="Target"
                      value={it.target ?? ''}
                      onChange={(e) => setItem(it.id, { target: e.target.value })}
                      readOnly={readOnly}
                      placeholder="e.g. 5/day"
                      style={{ ...cellInput, padding: 4 }}
                    />
                  </td>
                  {PLANNER_DAYS.map((day, di) => (
                    <td key={day} style={{ padding: 6, textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        aria-label={`${it.label || 'item'} ${day}`}
                        checked={!!it.days[di]}
                        onChange={() => toggleDay(it.id, di)}
                        disabled={readOnly}
                        style={{ width: 22, height: 22, accentColor: COLORS.accent, cursor: readOnly ? 'default' : 'pointer' }}
                      />
                    </td>
                  ))}
                  {!readOnly && (
                    <td style={{ padding: 6, textAlign: 'center' }}>
                      <button
                        type="button"
                        aria-label="Remove item"
                        onClick={() => removeItem(it.id)}
                        style={{
                          border: 'none', background: 'transparent', color: COLORS.label,
                          cursor: 'pointer', fontSize: 18, lineHeight: 1,
                        }}
                      >
                        ×
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!readOnly && (
          <button
            type="button"
            onClick={addItem}
            style={{
              marginTop: 8, border: `1px solid ${COLORS.border}`, borderRadius: 8,
              padding: '8px 12px', background: '#fff', color: COLORS.accent, cursor: 'pointer', fontWeight: 600,
            }}
          >
            + Add item
          </button>
        )}
      </div>

      {/* Technique notes */}
      <div>
        <div style={{ ...labelStyle, marginBottom: 6 }}>Notes</div>
        <textarea
          aria-label="Notes"
          value={value.notes}
          onChange={(e) => setNotes(e.target.value)}
          readOnly={readOnly}
          rows={3}
          placeholder="Technique reminders (e.g. LH: thumb to ceiling; RH: relaxed pinky)…"
          style={{
            ...cellInput,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 8,
            padding: 8,
            minHeight: 64,
            background: readOnly ? COLORS.headerBg : '#fff',
          }}
        />
      </div>
    </div>
  );
}

export default WeeklyPlanner;
