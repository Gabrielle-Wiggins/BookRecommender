import "./ContentFilters.css";

const FILTER_KEYS = ["violence", "sexualContent", "profanity", "occult", "faithBased"];
const FILTER_LABELS = {
  violence: "Violence",
  sexualContent: "Sexual content",
  profanity: "Profanity",
  occult: "Occult themes",
  faithBased: "Faith-based",
};

const GENRES = ["All", "Fantasy", "Historical Fiction", "Mystery", "Romance", "Non-Fiction", "Science Fiction", "Thriller"];

export default function ContentFilters({ filters, setFilters, genre, setGenre }) {
  const setFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <aside className="filters-sidebar">
      <section className="filter-section">
        <h4 className="filter-section-title">Content thresholds</h4>
        <p className="filter-hint">Books exceeding your level will be flagged</p>
        {FILTER_KEYS.map((key) => (
          <div key={key} className="filter-row">
            <span className="filter-name">{FILTER_LABELS[key]}</span>
            <div className="filter-dots">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  className={`dot ${filters[key] >= level ? "filled" : ""}`}
                  onClick={() => setFilter(key, level === filters[key] ? level - 1 : level)}
                  title={`Level ${level}`}
                />
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="filter-section">
        <h4 className="filter-section-title">Genre</h4>
        <div className="genre-list">
          {GENRES.map((g) => (
            <button
              key={g}
              className={`genre-item ${genre === g ? "active" : ""}`}
              onClick={() => setGenre(g)}
            >
              {g}
            </button>
          ))}
        </div>
      </section>
    </aside>
  );
}
