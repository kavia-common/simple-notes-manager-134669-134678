import React, { useEffect, useMemo, useState } from 'react';

/**
 * NoteForm renders a form to create or edit a note.
 * Props:
 * - initial: { title, content } optional
 * - onSubmit: (payload) => Promise|void
 * - onCancel: () => void
 * - submitting: boolean
 */
function NoteForm({ initial, onSubmit, onCancel, submitting }) {
  const init = useMemo(() => initial || { title: '', content: '' }, [initial]);
  const [title, setTitle] = useState(init.title);
  const [content, setContent] = useState(init.content);
  const [error, setError] = useState('');

  useEffect(() => {
    setTitle(init.title);
    setContent(init.content);
  }, [init]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    try {
      await onSubmit({ title: title.trim(), content });
      setTitle('');
      setContent('');
    } catch (err) {
      setError(err?.message || 'Failed to save note.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h3 className="card-title" style={{ marginBottom: 8 }}>{initial ? 'Edit Note' : 'New Note'}</h3>
      {error ? <div className="error" role="alert">{error}</div> : null}
      <div className="form-row">
        <input
          className="text-input"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label="Note title"
        />
        <textarea
          className="textarea"
          placeholder="Write your note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          aria-label="Note content"
        />
      </div>
      <div className="form-actions">
        {onCancel ? (
          <button type="button" className="btn secondary" onClick={onCancel} disabled={submitting}>
            Cancel
          </button>
        ) : null}
        <button type="submit" className="btn" disabled={submitting}>
          {submitting ? 'Saving...' : initial ? 'Save Changes' : 'Add Note'}
        </button>
      </div>
      {!initial && <p className="help">Pro tip: Titles help you find notes faster.</p>}
    </form>
  );
}

export default NoteForm;
