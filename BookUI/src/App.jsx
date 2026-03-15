import { useState } from "react";
import Browse from "./pages/Browse";
import Recommendations from "./pages/Recommendations";
import MyShelf from "./pages/MyShelf";
import Header from "./components/Header";
import "./App.css";

export default function App() {
  const [page, setPage] = useState("browse");
  const [savedBooks, setSavedBooks] = useState([]);

  const toggleSave = (book) => {
    setSavedBooks((prev) =>
      prev.find((b) => b.id === book.id)
        ? prev.filter((b) => b.id !== book.id)
        : [...prev, book]
    );
  };

  const isSaved = (id) => savedBooks.some((b) => b.id === id);

  return (
    <div className="app">
      <Header page={page} setPage={setPage} />
      {page === "browse" && <Browse toggleSave={toggleSave} isSaved={isSaved} />}
      {page === "recommendations" && <Recommendations toggleSave={toggleSave} isSaved={isSaved} />}
      {page === "shelf" && <MyShelf savedBooks={savedBooks} toggleSave={toggleSave} />}
    </div>
  );
}
