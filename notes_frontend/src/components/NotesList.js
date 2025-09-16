import React, { useMemo, useState } from 'react';
import NoteItem from './NoteItem';

/**
 * NotesList renders a searchable list of notes using NoteItem.
 * Props:
 * - notes: array
 * - onEdit: (note)=>void
 * - onDelete: (id)=>void
 */
function NotesList({ notes, onEdit, onDelete }) {
  const [q, setQ] = useState('');
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return notes;
    return notes.filter((n) => {
      const t = (n.title || '').toLowerCase();
      const c = (n.content || '').toLowerCase();
      return t.includes(query) || c.includes(query);
    });
  }, [q, notes]);

  return (
    <div>
      <div className="toolbar">
        <input
          className="search-input"
          placeholder="Search notes..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search notes"
        />
      </div>
      {filtered.length === 0 ? (
        <div className="empty">No notes found.</div>
      ) : (
        filtered.map((n) => (
          <NoteItem key={n.id} note={n} onEdit={onEdit} onDelete={onDelete} />
        ))
      )}
    </div>
  );
}

export default NotesList;
