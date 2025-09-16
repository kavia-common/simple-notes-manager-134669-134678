import React from 'react';

/**
 * NoteItem displays a single note with title, content, meta, and action buttons.
 * Props:
 * - note: { id, title, content, updatedAt|createdAt }
 * - onEdit: (note) => void
 * - onDelete: (id) => void
 */
function NoteItem({ note, onEdit, onDelete }) {
  const { id, title, content } = note;
  const updated =
    note.updatedAt || note.updated_at || note.createdAt || note.created_at || null;
  const updatedStr = updated ? new Date(updated).toLocaleString() : null;

  return (
    <div className="card" data-note-id={id}>
      <div className="card-header">
        <div>
          <h4 className="card-title">{title || 'Untitled'}</h4>
          {updatedStr ? <div className="card-meta">Updated {updatedStr}</div> : null}
        </div>
      </div>
      {content ? <div className="note-content">{content}</div> : <div className="help">No content</div>}
      <div className="note-actions">
        <button className="btn muted" onClick={() => onEdit(note)} aria-label={`Edit ${title || 'note'}`}>
          Edit
        </button>
        <button
          className="btn danger"
          onClick={() => onDelete(id)}
          aria-label={`Delete ${title || 'note'}`}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default NoteItem;
