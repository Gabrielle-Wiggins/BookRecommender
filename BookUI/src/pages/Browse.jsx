import { useState } from "react";
import ContentFilters from "../components/ContentFilters";
import BookCard from "../components/BookCard";
import { useBooks } from "../hooks/useBooks";
import "./Browse.css";

const DEFAULT_FILTERS = {
  violence: 3,
  sexualContent: 1,
  profanity: 3,
  occult: 1,
  faithBased: 5,
};

export default function Browse({ toggleSave, isSaved }) {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const { books, loading, error } = useBooks(genre);

  const filtered = books.filter((book) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      book.title?.toLowerCase().includes(q) ||
      book.author?.toLowerCase().includes(q) ||
      book.genre?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="page-content">
      <div className="browse-hero">
        <div className="hero-text">
          <p className="hero-eyebrow">Find your next read</p>
          <h1 className="hero-title">Books you'll love,<br />filtered for your values</h1>
          <p className="hero-sub">Browse with confidence — every book rated by chapter-level content</p>
        </div>
        <div className="search-row">
          <input
            className="search-input"
            type="text"
            placeholder="Search by title, author, or genre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn-primary" onClick={() => {}}>Search</button>
        </div>
      </div>

      <div className="browse-layout">
        <ContentFilters
          filters={filters}
          setFilters={setFilters}
          genre={genre}
          setGenre={setGenre}
        />

        <div className="browse-results">
          <div className="results-header">
            <span className="results-count">
              {loading ? "Loading..." : `${filtered.length} book${filtered.length !== 1 ? "s" : ""} found`}
            </span>
            <select className="sort-select">
              <option>Sort: Recommended</option>
              <option>Sort: Title A–Z</option>
              <option>Sort: Top rated</option>
            </select>
          </div>

          {error && (
            <div className="error-banner">
              Could not connect to the API at localhost:5213. Make sure your backend is running.
            </div>
          )}

          {loading && (
            <div className="loading-list">
              {[1, 2, 3].map((i) => <div key={i} className="skeleton-card card" />)}
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="empty-state">
              <h3>No books found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          )}

          <div className="book-list">
            {filtered.map((book, i) => (
              <div key={book.id} style={{ animationDelay: `${i * 0.05}s` }}>
                <BookCard book={book} toggleSave={toggleSave} isSaved={isSaved} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
