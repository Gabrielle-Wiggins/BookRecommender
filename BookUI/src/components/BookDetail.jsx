import { useEffect, useState } from "react";
import "./BookDetail.css";

const API_BASE = "http://localhost:5213/api";

const WARNING_LABELS = {
  Violence: "Violence",
  SexualContent: "Sexual content",
  Profanity: "Profanity",
  Occult: "Occult themes",
  FaithBased: "Faith-based",
};

const WARNING_COLORS = {
  Violence: "warn",
  SexualContent: "warn",
  Profanity: "warn",
  Occult: "warn",
  FaithBased: "safe",
};

function LevelDots({ level, max = 5, type }) {
  return (
    <div className="level-dots">
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          className={`level-dot level-dot--${type} ${i < level ? "filled" : ""}`}
        />
      ))}
    </div>
  );
}

export default function BookDetail({ book, onClose, toggleSave, isSaved }) {
  const [detail, setDetail] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!book) return;
    setLoading(true);
    setDetail(null);
    setSimilar([]);

    // Fetch full book detail (with chapters)
    fetch(`${API_BASE}/books/${book.id}`)
      .then((r) => r.json())
      .then((data) => {
        setDetail(data);
        setLoading(false);
      })
      .catch(() => {
        setDetail(book);
        setLoading(false);
      });

    // Fetch similar books by genre
    if (book.genre) {
      fetch(`${API_BASE}/books/recommend?genre=${encodeURIComponent(book.genre)}`)
        .then((r) => r.json())
        .then((data) => setSimilar(data.filter((b) => b.id !== book.id).slice(0, 3)))
        .catch(() => {});
    }
  }, [book?.id]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Prevent background scroll when open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const saved = isSaved(book.id);
  const data = detail || book;
  const chapters = data.chapters || [];

  // Group warnings across all chapters by type
  const warningMap = {};
  chapters.forEach((ch) => {
    (ch.contentWarnings || []).forEach((w) => {
      if (!warningMap[w.type] || warningMap[w.type] < w.level) {
        warningMap[w.type] = w.level;
      }
    });
  });

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <div className="drawer" role="dialog" aria-modal="true">
        <div className="drawer-inner">

          {/* Header */}
          <div className="drawer-topbar">
            <button className="drawer-close" onClick={onClose} aria-label="Close">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 4L4 12M4 4l8 8"/>
              </svg>
            </button>
          </div>

          {loading ? (
            <div className="drawer-loading">
              <div className="skeleton skeleton--cover" />
              <div className="skeleton skeleton--title" />
              <div className="skeleton skeleton--text" />
              <div className="skeleton skeleton--text short" />
            </div>
          ) : (
            <div className="drawer-content">

              {/* Hero section */}
              <div className="detail-hero">
                <div className="detail-cover-wrap">
                  {data.coverImageUrl ? (
                    <img
                      className="detail-cover"
                      src={data.coverImageUrl}
                      alt={data.title}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className="detail-cover detail-cover--placeholder"
                    style={{ display: data.coverImageUrl ? "none" : "flex" }}
                  >
                    <span>{data.title?.charAt(0)}</span>
                  </div>
                </div>
                <div className="detail-hero-info">
                  <h2 className="detail-title">{data.title}</h2>
                  <p className="detail-author">by {data.author}</p>
                  <div className="detail-tags">
                    {data.genre && <span className="tag tag-genre">{data.genre}</span>}
                    {data.tags && data.tags.split(",").filter(Boolean).slice(0, 3).map((t) => (
                      <span key={t} className="tag tag-warn">{t.trim()}</span>
                    ))}
                  </div>
                  <button
                    className={`save-btn ${saved ? "save-btn--saved" : ""}`}
                    onClick={() => toggleSave(data)}
                  >
                    {saved ? "✓ On your shelf" : "+ Save to shelf"}
                  </button>
                </div>
              </div>

              {/* Summary */}
              {data.summary && (
                <section className="detail-section">
                  <h3 className="section-title">About this book</h3>
                  <p className="detail-summary">{data.summary}</p>
                </section>
              )}

              {/* Content warnings overview */}
              <section className="detail-section">
                <h3 className="section-title">Content overview</h3>
                {Object.keys(warningMap).length > 0 ? (
                  <div className="warning-grid">
                    {Object.entries(warningMap).map(([type, level]) => (
                      <div key={type} className="warning-row">
                        <span className="warning-label">{WARNING_LABELS[type] || type}</span>
                        <LevelDots level={level} type={WARNING_COLORS[type] || "warn"} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-section">
                    <p>No content warnings have been added yet.</p>
                    <p className="empty-hint">Chapter-level warnings can be added via the admin panel.</p>
                  </div>
                )}
              </section>

              {/* Chapter list */}
              <section className="detail-section">
                <h3 className="section-title">Chapters</h3>
                {chapters.length > 0 ? (
                  <div className="chapter-list">
                    {chapters.map((ch) => (
                      <div key={ch.id} className="chapter-row">
                        <div className="chapter-header">
                          <span className="chapter-num">Chapter {ch.chapterNumber}</span>
                          <div className="chapter-badges">
                            {(ch.contentWarnings || []).map((w) => (
                              <span key={w.id} className={`tag tag-${WARNING_COLORS[w.type] || "warn"}`}>
                                {WARNING_LABELS[w.type] || w.type} {w.level}
                              </span>
                            ))}
                          </div>
                        </div>
                        {ch.alternativeSummary && (
                          <p className="chapter-alt-summary">
                            <span className="alt-label">Alt summary:</span> {ch.alternativeSummary}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-section">
                    <p>No chapter details have been added yet.</p>
                    <p className="empty-hint">Chapter breakdowns can be added via the admin panel.</p>
                  </div>
                )}
              </section>

              {/* Similar books */}
              {similar.length > 0 && (
                <section className="detail-section">
                  <h3 className="section-title">More in {data.genre}</h3>
                  <div className="similar-list">
                    {similar.map((b) => (
                      <div key={b.id} className="similar-card">
                        {b.coverImageUrl ? (
                          <img className="similar-cover" src={b.coverImageUrl} alt={b.title} />
                        ) : (
                          <div className="similar-cover similar-cover--placeholder">
                            <span>{b.title?.charAt(0)}</span>
                          </div>
                        )}
                        <div className="similar-info">
                          <p className="similar-title">{b.title}</p>
                          <p className="similar-author">{b.author}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

            </div>
          )}
        </div>
      </div>
    </>
  );
}
