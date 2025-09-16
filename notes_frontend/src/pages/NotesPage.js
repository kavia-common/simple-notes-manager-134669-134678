/**
 * NotesPage composes the notes UI: list, create/edit form, states.
 */
import React, { useCallback, useState } from 'react';
import { useNotes } from '../context/NotesContext';
import NotesList from '../components/NotesList';
import NoteForm from '../components/NoteForm';

function NotesPage() {
  const { notes, loading, error, selected, setSelected, add, save, remove, reload } = useNotes();
  const [submitting, setSubmitting] = useState(false);

  const onEdit = useCallback((note) => setSelected(note), [setSelected]);

  const onDelete = useCallback(
    async (id) => {
      // simple confirmation via window.confirm to avoid extra deps
      const ok = window.confirm('Delete this note? This action cannot be undone.');
      if (!ok) return;
      try {
        await remove(id);
      } catch (e) {
        // eslint-disable-next-line no-alert
        alert(e?.message || 'Failed to delete note');
      }
    },
    [remove]
  );

  const onSubmitNew = useCallback(
    async (payload) => {
      setSubmitting(true);
      try {
        await add(payload);
      } finally {
        setSubmitting(false);
      }
    },
    [add]
  );

  const onSubmitEdit = useCallback(
    async (payload) => {
      if (!selected) return;
      setSubmitting(true);
      try {
        await save(selected.id, payload);
        setSelected(null);
      } finally {
        setSubmitting(false);
      }
    },
    [save, selected, setSelected]
  );

  const cancelEdit = useCallback(() => setSelected(null), [setSelected]);

  return (
    <div>
      <div className="grid">
        <section>
          <div className="card">
            <div className="card-header">
              <h2 className="card-title" style={{ margin: 0 }}>Your Notes</h2>
              <div className="card-meta">{notes.length} item{notes.length === 1 ? '' : 's'}</div>
            </div>
            {loading && <div className="loading">Loading notes…</div>}
            {error && (
              <div className="error" role="alert">
                {error}{' '}
                <button className="btn secondary" onClick={reload} style={{ marginLeft: 8 }}>
                  Retry
                </button>
              </div>
            )}
            <NotesList notes={notes} onEdit={onEdit} onDelete={onDelete} />
          </div>
        </section>

        <aside>
          <NoteForm
            key={selected ? selected.id : 'new'}
            initial={selected || undefined}
            onSubmit={selected ? onSubmitEdit : onSubmitNew}
            onCancel={selected ? cancelEdit : undefined}
            submitting={submitting}
          />
          <div className="card" style={{ marginTop: 12 }}>
            <div className="help">
              Notes are saved to the server. Use the search box to quickly find content in titles and bodies.
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default NotesPage;
