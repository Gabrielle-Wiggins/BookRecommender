import "./BookCard.css";

const COVER_COLORS = [
  { bg: "#3C3489", text: "#CECBF6" },
  { bg: "#085041", text: "#9FE1CB" },
  { bg: "#712B13", text: "#F5C4B3" },
  { bg: "#0C447C", text: "#B5D4F4" },
  { bg: "#3B6D11", text: "#C0DD97" },
  { bg: "#633806", text: "#FAC775" },
];

function getCoverColor(id) {
  return COVER_COLORS[id % COVER_COLORS.length];
}

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(5 - full - (half ? 1 : 0));
}

export default function BookCard({ book, toggleSave, isSaved, onSelect, warnings = [], warningNames = {} }) {
  const color = getCoverColor(book.id);
  const saved = isSaved(book.id);
  const tags = book.tags ? book.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
  const isFlagged = warnings.length > 0;

  return (
    <div
      className={`book-card card ${isFlagged ? "book-card--flagged" : ""}`}
      onClick={() => onSelect && onSelect(book)}
      style={{ cursor: onSelect ? "pointer" : "default" }}
    >
      {book.coverImageUrl ? (
        <img
          className="book-cover book-cover--img"
          src={book.coverImageUrl}
          alt={book.title}
          onError={(e) => {
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
        />
      ) : null}
      <div
        className="book-cover"
        style={{
          background: color.bg,
          color: color.text,
          display: book.coverImageUrl ? "none" : "flex",
        }}
      >
        <span>{book.title}</span>
      </div>

      <div className="book-body">
        <div className="book-meta">
          <h3 className="book-title">{book.title}</h3>
          <p className="book-author">by {book.author}</p>
          <div className="book-tags">
            {book.genre && <span className="tag tag-genre">{book.genre}</span>}
            {tags.map((tag) => (
              <span key={tag} className="tag tag-warn">{tag}</span>
            ))}
          </div>
          {isFlagged && (
            <div className="content-flag">
              <span className="content-flag-icon">⚑</span>
              <span>Exceeds your filters: {warnings.map((w) => warningNames[w] || w).join(", ")}</span>
            </div>
          )}
          {!isFlagged && book.summary && (
            <p className="book-summary">{book.summary}</p>
          )}
          {isFlagged && book.summary && (
            <p className="book-summary book-summary--muted">{book.summary}</p>
          )}
        </div>

        <div className="book-actions">
          {book.rating && (
            <div className="book-rating">
              <span className="stars">{renderStars(book.rating)}</span>
              <span className="rating-num">{book.rating}</span>
            </div>
          )}
          <button
            className={`btn-secondary ${saved ? "btn-saved" : ""}`}
            onClick={(e) => { e.stopPropagation(); toggleSave(book); }}
          >
            {saved ? "✓ Saved" : "+ Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
