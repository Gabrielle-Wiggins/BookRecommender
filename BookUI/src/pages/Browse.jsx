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

// Map tag keywords to filter categories
const TAG_FILTER_MAP = [
  { keywords: ["violence", "violent", "gore", "brutal"], key: "violence" },
  { keywords: ["sexual", "explicit", "mature", "adult", "romance"], key: "sexualContent" },
  { keywords: ["profanity", "language", "swearing", "crude"], key: "profanity" },
  { keywords: ["occult", "magic", "witchcraft", "demon", "dark arts"], key: "occult" },
  { keywords: ["faith", "christian", "religious", "spiritual", "biblical"], key: "faithBased" },
];

function getBookWarnings(book, filters) {
  const warnings = [];
  const tagStr = ((book.tags || "") + " " + (book.genre || "")).toLowerCase();

  // Check chapter-level warnings first
  const chapters = book.chapters || [];
  const warningMap = {};
  chapters.forEach((ch) => {
    (ch.contentWarnings || []).forEach((w) => {
      const key = w.type.charAt(0).toLowerCase() + w.type.slice(1);
      if (!warningMap[key] || warningMap[key] < w.level) {
        warningMap[key] = w.level;
      }
    });
  });

  // Check chapter warnings against filters
  for (const [key, level] of Object.entries(warningMap)) {
    if (filters[key] !== undefined && level > filters[key]) {
      warnings.push(key);
    }
  }

  // Fall back to tag-based detection if no chapter data
  if (chapters.length === 0) {
    TAG_FILTER_MAP.forEach(({ keywords, key }) => {
      if (keywords.some((kw) => tagStr.includes(kw))) {
        // Tags imply level 3 — flag if filter is set below 3
        if (filters[key] < 3) {
          warnings.push(key);
        }
      }
    });
  }

  return warnings;
}

const WARNING_NAMES = {
  violence: "Violence",
  sexualContent: "Sexual content",
  profanity: "Profanity",
  occult: "Occult themes",
  faithBased: "Faith-based",
};

export default function Browse({ toggleSave, isSaved, onSelect }) {
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
            {filtered.map((book, i) => {
              const warnings = getBookWarnings(book, filters);
              return (
                <div key={book.id} style={{ animationDelay: `${i * 0.05}s` }}>
                  <BookCard
                    book={book}
                    toggleSave={toggleSave}
                    isSaved={isSaved}
                    onSelect={onSelect}
                    warnings={warnings}
                    warningNames={WARNING_NAMES}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
