import { useState } from "react";
import BookCard from "../components/BookCard";
import { useRecommendations } from "../hooks/useBooks";
import "./Recommendations.css";

const GENRES = ["Fantasy", "Historical Fiction", "Mystery", "Romance", "Non-Fiction", "Science Fiction", "Thriller"];

export default function Recommendations({ toggleSave, isSaved }) {
  const [selectedGenre, setSelectedGenre] = useState("");

  const { books, loading, error } = useRecommendations(selectedGenre);

  return (
    <div className="page-content">
      <div className="rec-header">
        <p className="hero-eyebrow">Tailored for you</p>
        <h1 className="rec-title">Recommendations</h1>
        <p className="rec-sub">Pick a genre and we'll surface the best matches — including hidden gems</p>
      </div>

      <div className="genre-picker">
        {GENRES.map((g) => (
          <button
            key={g}
            className={`genre-pill ${selectedGenre === g ? "active" : ""}`}
            onClick={() => setSelectedGenre(g)}
          >
            {g}
          </button>
        ))}
      </div>

      {!selectedGenre && (
        <div className="empty-state">
          <h3>Choose a genre to get started</h3>
          <p>Select one above and we'll find books that match your preferences</p>
        </div>
      )}

      {error && (
        <div className="error-banner">
          Could not connect to the API. Make sure your backend is running at localhost:5213.
        </div>
      )}

      {loading && selectedGenre && (
        <div className="rec-loading">Finding your next great read...</div>
      )}

      {!loading && books.length > 0 && (
        <>
          <div className="rec-results-header">
            <span>{books.length} recommendation{books.length !== 1 ? "s" : ""} for <strong>{selectedGenre}</strong></span>
          </div>
          <div className="book-list">
            {books.map((book, i) => (
              <div key={book.id} style={{ animationDelay: `${i * 0.06}s` }}>
                <BookCard book={book} toggleSave={toggleSave} isSaved={isSaved} />
              </div>
            ))}
          </div>
        </>
      )}

      {!loading && selectedGenre && books.length === 0 && !error && (
        <div className="empty-state">
          <h3>No recommendations yet</h3>
          <p>Add some books via the API to see them appear here</p>
        </div>
      )}
    </div>
  );
}
