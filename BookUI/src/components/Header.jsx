import "./Header.css";

export default function Header({ page, setPage }) {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo">
          <div className="logo-icon">
            <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="6" height="14" rx="1" fill="currentColor" opacity="0.9"/>
              <rect x="11" y="3" width="6" height="14" rx="1" fill="currentColor" opacity="0.6"/>
              <rect x="7" y="5" width="6" height="12" rx="1" fill="currentColor" opacity="0.75"/>
            </svg>
          </div>
          <div>
            <div className="logo-name">Faithful Reads</div>
            <div className="logo-tagline">Christian-friendly book discovery</div>
          </div>
        </div>

        <nav className="nav">
          {[
            { id: "browse", label: "Browse" },
            { id: "recommendations", label: "Recommendations" },
            { id: "shelf", label: "My Shelf" },
          ].map(({ id, label }) => (
            <button
              key={id}
              className={`nav-btn ${page === id ? "active" : ""}`}
              onClick={() => setPage(id)}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
