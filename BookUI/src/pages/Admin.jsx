import { useState, useEffect } from "react";
import "./Admin.css";

const API_BASE = "http://localhost:5213/api";
const OL_SEARCH = "https://openlibrary.org/search.json";
const OL_COVER = "https://covers.openlibrary.org/b/id";

const WARNING_TYPES = ["Violence", "SexualContent", "Profanity", "Occult", "FaithBased"];
const WARNING_LABELS = {
  Violence: "Violence",
  SexualContent: "Sexual content",
  Profanity: "Profanity",
  Occult: "Occult themes",
  FaithBased: "Faith-based",
};

function getCoverUrl(coverId) {
  return coverId ? `${OL_COVER}/${coverId}-M.jpg` : null;
}

function extractGenre(subjects) {
  if (!subjects || subjects.length === 0) return "";
  const genreMap = {
    fiction: "Fiction", fantasy: "Fantasy", romance: "Romance",
    mystery: "Mystery", thriller: "Thriller", "science fiction": "Science Fiction",
    "historical fiction": "Historical Fiction", biography: "Non-Fiction",
    history: "Non-Fiction", "self-help": "Non-Fiction",
    christian: "Non-Fiction", religion: "Non-Fiction",
  };
  const lower = subjects.map((s) => s.toLowerCase());
  for (const [key, value] of Object.entries(genreMap)) {
    if (lower.some((s) => s.includes(key))) return value;
  }
  return subjects[0] || "";
}

function extractTags(subjects) {
  if (!subjects || subjects.length === 0) return "";
  return subjects.filter((s) => s.length < 40).slice(0, 5).join(", ");
}

// ─── Import Tab ───────────────────────────────────────────────────────────────

function ImportTab() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imported, setImported] = useState({});
  const [importing, setImporting] = useState({});

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true); setError(null); setResults([]);
    try {
      const url = `${OL_SEARCH}?q=${encodeURIComponent(query)}&fields=key,title,author_name,cover_i,subject,first_sentence,description&limit=15`;
      const res = await fetch(url);
      const data = await res.json();
      setResults(data.docs || []);
    } catch {
      setError("Could not reach Open Library. Check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (book) => {
    const key = book.key;
    setImporting((prev) => ({ ...prev, [key]: true }));
    let summary = "";
    if (book.first_sentence) {
      summary = Array.isArray(book.first_sentence)
        ? book.first_sentence[0]
        : book.first_sentence?.value || book.first_sentence;
    }
    const payload = {
      title: book.title || "",
      author: book.author_name?.[0] || "Unknown",
      genre: extractGenre(book.subject),
      tags: extractTags(book.subject),
      summary, coverImageUrl: getCoverUrl(book.cover_i) || "",
      reviewCount: 0,
    };
    try {
      const res = await fetch(`${API_BASE}/books`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Import failed");
      setImported((prev) => ({ ...prev, [key]: true }));
    } catch {
      alert("Failed to import book. Make sure your backend is running.");
    } finally {
      setImporting((prev) => ({ ...prev, [key]: false }));
    }
  };

  return (
    <>
      <div className="search-bar">
        <input
          className="admin-search-input" type="text"
          placeholder="Search by title, author, or subject..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
        />
        <button className="btn-primary" onClick={search} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {!loading && results.length === 0 && !query && (
        <div className="admin-hint">
          <div className="hint-grid">
            {["C.S. Lewis", "Francine Rivers", "Frank Peretti", "Max Lucado", "Tolkien", "Andrew Peterson"].map((name) => (
              <button key={name} className="hint-chip" onClick={() => setQuery(name)}>{name}</button>
            ))}
          </div>
          <p className="hint-label">Try searching for a popular Christian or fantasy author</p>
        </div>
      )}

      {!loading && results.length === 0 && query && !error && (
        <div className="empty-state"><h3>No results found</h3><p>Try a different title or author name</p></div>
      )}

      <div className="results-grid">
        {results.map((book) => {
          const cover = getCoverUrl(book.cover_i);
          const genre = extractGenre(book.subject);
          const isImported = imported[book.key];
          const isImporting = importing[book.key];
          return (
            <div key={book.key} className={`result-card ${isImported ? "result-card--imported" : ""}`}>
              <div className="result-cover">
                {cover ? <img src={cover} alt={book.title} /> : <div className="cover-placeholder"><span>{book.title?.charAt(0)}</span></div>}
              </div>
              <div className="result-info">
                <h3 className="result-title">{book.title}</h3>
                <p className="result-author">{book.author_name?.[0] || "Unknown author"}</p>
                {genre && <span className="tag tag-genre">{genre}</span>}
                {book.first_sentence && (
                  <p className="result-summary">
                    {typeof book.first_sentence === "string" ? book.first_sentence : book.first_sentence?.value || ""}
                  </p>
                )}
              </div>
              <div className="result-action">
                <button
                  className={`import-btn ${isImported ? "import-btn--done" : ""}`}
                  onClick={() => !isImported && handleImport(book)}
                  disabled={isImporting || isImported}
                >
                  {isImported ? "✓ Imported" : isImporting ? "Importing..." : "Import"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// ─── Manage Warnings Tab ──────────────────────────────────────────────────────

function ManageWarningsTab() {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [newChapterNum, setNewChapterNum] = useState("");
  const [newChapterSummary, setNewChapterSummary] = useState("");
  const [addingChapter, setAddingChapter] = useState(false);
  const [warningChapterId, setWarningChapterId] = useState(null);
  const [newWarnType, setNewWarnType] = useState("Violence");
  const [newWarnLevel, setNewWarnLevel] = useState(1);
  const [addingWarning, setAddingWarning] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/books`)
      .then((r) => r.json())
      .then(setBooks)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedBook) return;
    fetch(`${API_BASE}/books/${selectedBook.id}`)
      .then((r) => r.json())
      .then((data) => setChapters(data.chapters || []))
      .catch(() => setChapters([]));
  }, [selectedBook]);

  const handleSelectBook = (e) => {
    const book = books.find((b) => b.id === parseInt(e.target.value));
    setSelectedBook(book || null);
    setChapters([]);
    setWarningChapterId(null);
  };

  const handleAddChapter = async () => {
    if (!newChapterNum) return;
    setAddingChapter(true);
    try {
      const res = await fetch(`${API_BASE}/books/${selectedBook.id}/chapters`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chapterNumber: parseInt(newChapterNum),
          alternativeSummary: newChapterSummary,
        }),
      });
      if (!res.ok) throw new Error();
      const chapter = await res.json();
      setChapters((prev) => [...prev, { ...chapter, contentWarnings: [] }]);
      setNewChapterNum("");
      setNewChapterSummary("");
    } catch {
      alert("Failed to add chapter.");
    } finally {
      setAddingChapter(false);
    }
  };

  const handleAddWarning = async (chapterId) => {
    setAddingWarning(true);
    try {
      const res = await fetch(`${API_BASE}/chapters/${chapterId}/warnings`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: newWarnType, level: newWarnLevel }),
      });
      if (!res.ok) throw new Error();
      const warning = await res.json();
      setChapters((prev) => prev.map((ch) =>
        ch.id === chapterId
          ? { ...ch, contentWarnings: [...(ch.contentWarnings || []), warning] }
          : ch
      ));
      setWarningChapterId(null);
    } catch {
      alert("Failed to add warning.");
    } finally {
      setAddingWarning(false);
    }
  };

  return (
    <div className="warnings-tab">
      <div className="warn-section">
        <label className="warn-label">Select a book to edit</label>
        <select className="book-select" onChange={handleSelectBook} defaultValue="">
          <option value="" disabled>Choose a book...</option>
          {books.map((b) => (
            <option key={b.id} value={b.id}>{b.title} — {b.author}</option>
          ))}
        </select>
      </div>

      {selectedBook && (
        <>
          <div className="selected-book-card">
            {selectedBook.coverImageUrl && (
              <img className="selected-book-cover" src={selectedBook.coverImageUrl} alt={selectedBook.title}
                onError={(e) => { e.target.style.display = "none"; }} />
            )}
            <div>
              <p className="selected-book-title">{selectedBook.title}</p>
              <p className="selected-book-author">{selectedBook.author}</p>
            </div>
          </div>

          <div className="warn-section">
            <label className="warn-label">Add a chapter</label>
            <div className="chapter-form">
              <input
                className="admin-search-input chapter-num-input"
                type="number" min="1" placeholder="Ch #"
                value={newChapterNum}
                onChange={(e) => setNewChapterNum(e.target.value)}
              />
              <input
                className="admin-search-input" type="text"
                placeholder="Alternative summary (optional)"
                value={newChapterSummary}
                onChange={(e) => setNewChapterSummary(e.target.value)}
                style={{ flex: 1 }}
              />
              <button className="btn-primary" onClick={handleAddChapter} disabled={addingChapter || !newChapterNum}>
                {addingChapter ? "Adding..." : "Add chapter"}
              </button>
            </div>
          </div>

          {chapters.length > 0 && (
            <div className="warn-section">
              <label className="warn-label">Chapters ({chapters.length})</label>
              <div className="chapter-warning-list">
                {[...chapters].sort((a, b) => a.chapterNumber - b.chapterNumber).map((ch) => (
                  <div key={ch.id} className="chapter-warning-card">
                    <div className="chapter-warning-header">
                      <span className="chapter-warning-num">Chapter {ch.chapterNumber}</span>
                      {ch.alternativeSummary && (
                        <span className="chapter-alt-label">{ch.alternativeSummary}</span>
                      )}
                    </div>

                    <div className="existing-warnings">
                      {(ch.contentWarnings || []).length === 0 && (
                        <span className="no-warnings">No warnings yet</span>
                      )}
                      {(ch.contentWarnings || []).map((w) => (
                        <span key={w.id} className="warning-pill">
                          {WARNING_LABELS[w.type] || w.type} — Level {w.level}
                        </span>
                      ))}
                    </div>

                    {warningChapterId === ch.id ? (
                      <div className="add-warning-form">
                        <select className="sort-select" value={newWarnType} onChange={(e) => setNewWarnType(e.target.value)}>
                          {WARNING_TYPES.map((t) => (
                            <option key={t} value={t}>{WARNING_LABELS[t]}</option>
                          ))}
                        </select>
                        <div className="level-picker">
                          {[1, 2, 3, 4, 5].map((l) => (
                            <button key={l} className={`level-btn ${newWarnLevel === l ? "active" : ""}`} onClick={() => setNewWarnLevel(l)}>{l}</button>
                          ))}
                        </div>
                        <button className="btn-primary" onClick={() => handleAddWarning(ch.id)} disabled={addingWarning}>
                          {addingWarning ? "Saving..." : "Save"}
                        </button>
                        <button className="btn-secondary" onClick={() => setWarningChapterId(null)}>Cancel</button>
                      </div>
                    ) : (
                      <button className="add-warning-btn" onClick={() => { setWarningChapterId(ch.id); setNewWarnType("Violence"); setNewWarnLevel(1); }}>
                        + Add warning
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {chapters.length === 0 && (
            <div className="empty-section" style={{ marginTop: "1rem" }}>
              <p>No chapters yet — add one above.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────

export default function Admin() {
  const [tab, setTab] = useState("import");

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="admin-badge">Admin</div>
        <h1 className="admin-title">Admin Panel</h1>
        <p className="admin-sub">Import books and manage content warnings</p>
      </div>

      <div className="admin-tabs">
        <button className={`admin-tab ${tab === "import" ? "active" : ""}`} onClick={() => setTab("import")}>
          Import books
        </button>
        <button className={`admin-tab ${tab === "warnings" ? "active" : ""}`} onClick={() => setTab("warnings")}>
          Manage warnings
        </button>
      </div>

      {tab === "import" && <ImportTab />}
      {tab === "warnings" && <ManageWarningsTab />}
    </div>
  );
}
