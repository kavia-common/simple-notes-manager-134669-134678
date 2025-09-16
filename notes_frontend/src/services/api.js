/**
 * Simple API client for notes CRUD operations.
 * Uses fetch and returns JSON. Throws on non-OK responses with message.
 */

const BASE_URL = '/api/notes';

async function handleResponse(res) {
  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await res.json().catch(() => ({})) : await res.text().catch(() => '');
  if (!res.ok) {
    const message = (isJson && data && (data.error || data.message)) || res.statusText || 'Request failed';
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

// PUBLIC_INTERFACE
export async function fetchNotes(signal) {
  /** Fetch list of notes.
   * Returns array of notes: [{id, title, content, updatedAt, createdAt}]
   */
  const res = await fetch(BASE_URL, { signal });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function createNote(payload) {
  /** Create a note with payload {title, content}. Returns created note. */
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function updateNote(id, payload) {
  /** Update note by id with payload {title, content}. Returns updated note. */
  const res = await fetch(`${BASE_URL}/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function deleteNote(id) {
  /** Delete note by id. Returns {success:true} or similar. */
  const res = await fetch(`${BASE_URL}/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  return handleResponse(res);
}
