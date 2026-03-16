import { useState } from "react";
import Browse from "./pages/Browse";
import Recommendations from "./pages/Recommendations";
import MyShelf from "./pages/MyShelf";
import Admin from "./pages/Admin";
import Header from "./components/Header";
import BookDetail from "./components/BookDetail";
import "./App.css";

export default function App() {
  const [page, setPage] = useState(
    window.location.pathname === "/admin" ? "admin" : "browse"
  );
  const [savedBooks, setSavedBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);

  const toggleSave = (book) => {
    setSavedBooks((prev) =>
      prev.find((b) => b.id === book.id)
        ? prev.filter((b) => b.id !== book.id)
        : [...prev, book]
    );
  };

  const isSaved = (id) => savedBooks.some((b) => b.id === id);

  if (page === "admin") {
    return (
      <div className="app">
        <div className="admin-nav">
          <button className="admin-back-btn" onClick={() => setPage("browse")}>
            ← Back to app
          </button>
        </div>
        <Admin />
      </div>
    );
  }

  return (
    <div className="app">
      <Header page={page} setPage={setPage} />
      {page === "browse" && (
        <Browse toggleSave={toggleSave} isSaved={isSaved} onSelect={setSelectedBook} />
      )}
      {page === "recommendations" && (
        <Recommendations toggleSave={toggleSave} isSaved={isSaved} onSelect={setSelectedBook} />
      )}
      {page === "shelf" && (
        <MyShelf savedBooks={savedBooks} toggleSave={toggleSave} onSelect={setSelectedBook} />
      )}
      {selectedBook && (
        <BookDetail
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          toggleSave={toggleSave}
          isSaved={isSaved}
        />
      )}
    </div>
  );
}
