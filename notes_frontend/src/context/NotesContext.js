/**
 * NotesContext provides state and actions for notes across the app.
 * It encapsulates loading, error, list, and selected note for editing.
 */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { fetchNotes, createNote, updateNote, deleteNote } from '../services/api';

const NotesContext = createContext(null);

// PUBLIC_INTERFACE
export function NotesProvider({ children }) {
  /** Provider component for notes state and CRUD actions. */
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);

  const abortRef = useRef(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    if (abortRef.current) abortRef.current.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      const data = await fetchNotes(ctrl.signal);
      // Normalize and sort by updatedAt desc if available
      const normalized = Array.isArray(data) ? data.slice() : [];
      normalized.sort((a, b) => {
        const au = a.updatedAt || a.updated_at || a.createdAt || a.created_at || 0;
        const bu = b.updatedAt || b.updated_at || b.createdAt || b.created_at || 0;
        return new Date(bu) - new Date(au);
      });
      setNotes(normalized);
    } catch (e) {
      if (e.name !== 'AbortError') setError(e.message || 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, [load]);

  const add = useCallback(async (payload) => {
    setError('');
    const created = await createNote(payload);
    setNotes((prev) => [created, ...prev]);
    return created;
  }, []);

  const save = useCallback(async (id, payload) => {
    setError('');
    const updated = await updateNote(id, payload);
    setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
    return updated;
  }, []);

  const remove = useCallback(async (id) => {
    setError('');
    await deleteNote(id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (selected && selected.id === id) setSelected(null);
  }, [selected]);

  const value = useMemo(
    () => ({
      notes,
      loading,
      error,
      selected,
      setSelected,
      reload: load,
      add,
      save,
      remove,
    }),
    [notes, loading, error, selected, load, add, save, remove]
  );

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}

// PUBLIC_INTERFACE
export function useNotes() {
  /** Hook to access notes context. Throws if used outside provider. */
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error('useNotes must be used within NotesProvider');
  return ctx;
}
