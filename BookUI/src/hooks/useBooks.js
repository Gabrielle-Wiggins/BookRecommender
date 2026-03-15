import { useState, useEffect } from "react";

const API_BASE = "http://localhost:5213/api";

export function useBooks(genre) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const url = genre && genre !== "All"
      ? `${API_BASE}/books?genre=${encodeURIComponent(genre)}`
      : `${API_BASE}/books`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch books");
        return res.json();
      })
      .then((data) => {
        setBooks(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [genre]);

  return { books, loading, error };
}

export function useRecommendations(genre) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!genre || genre === "All") {
      setBooks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`${API_BASE}/books/recommend?genre=${encodeURIComponent(genre)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch recommendations");
        return res.json();
      })
      .then((data) => {
        setBooks(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [genre]);

  return { books, loading, error };
}
