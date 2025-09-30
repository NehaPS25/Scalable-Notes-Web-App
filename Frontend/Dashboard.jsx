

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const nav = useNavigate();
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [editingNote, setEditingNote] = useState(null);
  const [q, setQ] = useState("");

  // Load notes from localStorage when component mounts
  useEffect(() => {
    const saved = localStorage.getItem("notes");
    if (saved) {
      setNotes(JSON.parse(saved));
    }
  }, []);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  // Create or update note
  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("Title required");

    if (editingNote) {
      // Update existing
      setNotes((prev) =>
        prev.map((n) =>
          n.id === editingNote.id ? { ...n, title, body } : n
        )
      );
    } else {
      // Create new
      const newNote = { id: Date.now(), title, body };
      setNotes((prev) => [newNote, ...prev]);
    }

    // Reset form
    setTitle("");
    setBody("");
    setEditingNote(null);
  };

  // Edit note
  const editNote = (note) => {
    setEditingNote(note);
    setTitle(note.title);
    setBody(note.body);
  };

  // Delete note
  const deleteNote = (id) => {
    if (!window.confirm("Delete this note?")) return;
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token"); // remove any saved token
    nav("/login"); // redirect to login page
  };

  // Search filter
  const filteredNotes = notes.filter((n) => {
    const title = (n.title || "").toLowerCase();
    const body = (n.body || "").toLowerCase();
    return (
      title.includes(q.toLowerCase()) || body.includes(q.toLowerCase())
    );
  });

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Local Notes</h1>
        <button onClick={logout} className="btn btn-danger btn-sm">
          Logout
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search notes..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="form-control mb-3"
      />

      {/* Create / Edit Form */}
      <form onSubmit={submit} className="card p-3 mb-4">
        <input
          className="form-control mb-2"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="form-control mb-2"
          placeholder="Body"
          rows={4}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <div>
          <button className="btn btn-primary">
            {editingNote ? "Update Note" : "Create Note"}
          </button>
          {editingNote && (
            <button
              type="button"
              className="btn btn-outline-secondary ms-2"
              onClick={() => {
                setEditingNote(null);
                setTitle("");
                setBody("");
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Notes List */}
      <h2>Your Notes</h2>
      {filteredNotes.length === 0 && (
        <p className="text-muted">No notes yet</p>
      )}
      <div className="row">
        {filteredNotes.map((n) => (
          <div key={n.id} className="col-md-6 mb-3">
            <div className="card h-100">
              <div className="card-body d-flex flex-column justify-content-between">
                <div>
                  <h5>{n.title}</h5>
                  <p>{n.body}</p>
                </div>
                <div className="d-flex gap-2 mt-2">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => editNote(n)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => deleteNote(n.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
