import { useEffect, useState } from "react";
import axios from "axios";
import "./Notes.css";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const token = localStorage.getItem("token");

  const fetchNotes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/notes", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setNotes(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to fetch notes");
    }
  };

 useEffect(() => {
  if (!token) {
    window.location.href = "/login";
    return;
  }
  fetchNotes();
}, []);


  const handleAddNote = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/notes",
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setTitle("");
      setContent("");
      fetchNotes();
    } catch (err) {
  alert(err.response?.data?.message || "Failed to add note");
}
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/notes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchNotes();
    } catch (err) {
  alert(err.response?.data?.message || "Failed to delete note");
}
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="notes-container">
      <div className="notes-header">
        <h2>Your Notes</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <form className="note-form" onSubmit={handleAddNote}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Write your note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit">Add Note</button>
      </form>

      <div className="notes-list">
        {notes.length === 0 && <p>No notes yet.</p>}
        {notes.map((note) => (
          <div className="note-card" key={note._id}>
            <h4>{note.title}</h4>
            <p>{note.content}</p>
            <button onClick={() => handleDelete(note._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notes;
