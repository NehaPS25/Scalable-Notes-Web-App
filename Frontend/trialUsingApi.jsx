// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function Dashboard() {
//   const nav = useNavigate();
//   const [notes, setNotes] = useState([]);
//   const [title, setTitle] = useState("");
//   const [body, setBody] = useState("");
//   const [q, setQ] = useState("");
//   const [editingNote, setEditingNote] = useState(null);

//   const token = localStorage.getItem("token");

//   // ---------------- Fetch notes from backend ----------------
//   // ---------------- Fetch notes from backend ----------------
// const fetchNotes = async () => {
//   try {
//     const res = await fetch("http://localhost:5000/api/notes", {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     const data = await res.json();

//     // Make sure we always set an array
//     if (Array.isArray(data)) {
//       setNotes(data);
//     } else if (Array.isArray(data.notes)) {
//       setNotes(data.notes);
//     } else if (Array.isArray(data.data)) {
//       setNotes(data.data);
//     } else {
//       setNotes([]); // fallback
//     }
//   } catch (err) {
//     console.error("Failed to load notes", err);
//     setNotes([]); // fallback to avoid crash
//   }
// };

//   // ---------------- Create or Update note ----------------
//   const submit = async (e) => {
//     e.preventDefault();
//     if (!title.trim()) return alert("Title is required");

//     try {
//       if (editingNote) {
//         // Update
//         await fetch(`http://localhost:5000/api/notes/${editingNote.id}`, {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ title, body }),
//         });
//       } else {
//         // Create
//         await fetch("http://localhost:5000/api/notes", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ title, body }),
//         });
//       }
//       setTitle("");
//       setBody("");
//       setEditingNote(null);
//       fetchNotes();
//     } catch (err) {
//       console.error("Error saving note", err);
//     }
//   };

//   // ---------------- Edit note ----------------
//   const editNote = (note) => {
//     setTitle(note.title);
//     setBody(note.body);
//     setEditingNote(note);
//   };

//   // ---------------- Delete note ----------------
//   const deleteNote = async (id) => {
//     if (!window.confirm("Delete this note?")) return;
//     try {
//       await fetch(`http://localhost:5000/api/notes/${id}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       fetchNotes();
//     } catch (err) {
//       console.error("Error deleting note", err);
//     }
//   };

//   // ---------------- Logout ----------------
//   const logout = () => {
//     localStorage.removeItem("token");
//     nav("/login");
//   };

//   // ---------------- Search filter ----------------
//   const filteredNotes = notes.filter(
//     (n) =>
//       n.title.toLowerCase().includes(q.toLowerCase()) ||
//       n.body.toLowerCase().includes(q.toLowerCase())
//   );

//   // ---------------- Render ----------------
//   return (
//     <div className="container mt-5">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h1>Dashboard</h1>
//         <button onClick={logout} className="btn btn-danger btn-sm">
//           Logout
//         </button>
//       </div>

//       {/* Search */}
//       <input
//         type="text"
//         placeholder="Search notes..."
//         value={q}
//         onChange={(e) => setQ(e.target.value)}
//         className="form-control mb-3"
//       />

//       {/* Create / Edit */}
//       <form onSubmit={submit} className="card p-3 mb-4">
//         <input
//           className="form-control mb-2"
//           placeholder="Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           required
//         />
//         <textarea
//           className="form-control mb-2"
//           placeholder="Body"
//           rows={4}
//           value={body}
//           onChange={(e) => setBody(e.target.value)}
//         />
//         <div>
//           <button className="btn btn-primary">
//             {editingNote ? "Update" : "Create"} Note
//           </button>
//           {editingNote && (
//             <button
//               type="button"
//               className="btn btn-outline-secondary ms-2"
//               onClick={() => {
//                 setEditingNote(null);
//                 setTitle("");
//                 setBody("");
//               }}
//             >
//               Cancel
//             </button>
//           )}
//         </div>
//       </form>

//       {/* Notes list */}
//       <h2>Your Notes</h2>
//       {filteredNotes.length === 0 && <p className="text-muted">No notes yet</p>}
//       <div className="row">
//         {filteredNotes.map((n) => (
//           <div key={n.id} className="col-md-6 mb-3">
//             <div className="card h-100">
//               <div className="card-body d-flex flex-column justify-content-between">
//                 <div>
//                   <h5>{n.title}</h5>
//                   <p>{n.body}</p>
//                 </div>
//                 <div className="d-flex gap-2 mt-2">
//                   <button
//                     className="btn btn-sm btn-outline-primary"
//                     onClick={() => editNote(n)}
//                   >
//                     Edit
//                   </button>
//                   <button
//                     className="btn btn-sm btn-outline-danger"
//                     onClick={() => deleteNote(n.id)}
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
// // python -m venv venv
// // venv\Scripts\activate
// // python app.py