import BookCard from "../components/BookCard";
import "./MyShelf.css";

export default function MyShelf({ savedBooks, toggleSave, onSelect }) {
  const isSaved = (id) => savedBooks.some((b) => b.id === id);

  return (
    <div className="page-content">
      <div className="shelf-header">
        <p className="hero-eyebrow">Your collection</p>
        <h1 className="shelf-title">My Shelf</h1>
        <p className="shelf-sub">Books you've saved for later</p>
      </div>

      {savedBooks.length === 0 ? (
        <div className="empty-state">
          <div className="shelf-icon">📚</div>
          <h3>Your shelf is empty</h3>
          <p>Browse books and hit "+ Save" to add them here</p>
        </div>
      ) : (
        <>
          <div className="shelf-count">{savedBooks.length} book{savedBooks.length !== 1 ? "s" : ""} saved</div>
          <div className="book-list">
            {savedBooks.map((book, i) => (
              <div key={book.id} style={{ animationDelay: `${i * 0.05}s` }}>
                <BookCard book={book} toggleSave={toggleSave} isSaved={isSaved} onSelect={onSelect} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
