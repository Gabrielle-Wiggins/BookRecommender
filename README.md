# Faithful Reads

A full-stack book recommendation system that uses semantic search and embedding-based similarity to generate personalized book suggestions.

Built as an exploration of recommendation system design, including feature engineering, ranking logic, and search strategy tradeoffs.

This project explores how modern recommendation systems balance semantic understanding with traditional keyword-based search to improve discovery quality.

---

## Architecture Overview

- User input is processed through a search pipeline (semantic or keyword-based)
- Book data is embedded using transformer-based representations
- Similarity scoring ranks candidate recommendations
- Results are returned through a Flask API and rendered in a Gradio web interface

---

## Key Engineering Decisions

- Implemented dual search strategy (semantic + literal) to balance accuracy and flexibility
- Used vector embeddings for semantic similarity matching
- Optimized retrieval using cached embeddings to reduce latency
- Designed fallback handling for missing metadata and book covers

---

## Features

- Browse and search books by title, author, or genre
- Content filters for Violence, Sexual Content, Profanity, Occult themes, and Faith-based content (rated 1–5 per chapter)
- Genre-based recommendations with a "hidden gem" boost for lesser-known books
- Save books to a personal shelf
- Chapter-level content warnings and alternative summaries
- Community contributions (planned)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend API | C# / ASP.NET Core Web API |
| Database | SQLite via Entity Framework Core |
| ORM Migrations | EF Core (`dotnet ef`) |
| Frontend | React (Vite) |
| Styling | Plain CSS, Google Fonts |
| API Testing | Swagger UI |
| IDE | VS Code |

---

## Project Structure

```
BookRecommender/
├── BookAPI/                  # ASP.NET Core backend
│   ├── Controllers/
│   │   └── BooksController.cs
│   ├── Data/
│   │   ├── AppDbContext.cs
│   │   └── AppDbContextFactory.cs
│   ├── Models/
│   │   ├── Book.cs
│   │   ├── Chapter.cs
│   │   └── ContentWarning.cs
│   ├── Services/
│   │   └── RecommendationService.cs
│   ├── appsettings.json
│   └── Program.cs
│
└── BookUI/                   # React frontend (Vite)
    └── src/
        ├── components/
        │   ├── BookCard.jsx
        │   ├── ContentFilters.jsx
        │   └── Header.jsx
        ├── hooks/
        │   └── useBooks.js
        ├── pages/
        │   ├── Browse.jsx
        │   ├── Recommendations.jsx
        │   └── MyShelf.jsx
        ├── App.jsx
        └── App.css
```

---

## Getting Started

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org) (v18 or later)
- [EF Core CLI tools](https://learn.microsoft.com/en-us/ef/core/cli/dotnet)

Install EF Core tools if you haven't already:
```bash
dotnet tool install --global dotnet-ef
```

---

### Running the Backend

```bash
cd BookAPI
dotnet run
```

The API will start at `http://localhost:5213`
Swagger UI is available at `http://localhost:5213/swagger`

---

### Running the Frontend

```bash
cd BookUI
npm install       # first time only
npm run dev
```

The app will start at `http://localhost:5173`

---

### Database Setup

The SQLite database file (`BookRecommender.db`) is created automatically. To apply migrations:

```bash
cd BookAPI
dotnet ef database update
```

To create a new migration after changing models:
```bash
dotnet ef migrations add YourMigrationName
dotnet ef database update
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/books` | List all books |
| GET | `/api/books?genre=Fantasy` | Filter books by genre |
| POST | `/api/books` | Add a new book |
| GET | `/api/books/recommend?genre=Fantasy` | Get recommendations for a genre |

### Example: Add a Book

`POST /api/books`

```json
{
  "title": "Till We Have Faces",
  "author": "C.S. Lewis",
  "genre": "Fantasy",
  "tags": "Faith-based",
  "summary": "A retelling of the Cupid and Psyche myth rich in spiritual themes.",
  "reviewCount": 8200
}
```

---

## Data Models

### Book
| Field | Type | Description |
|---|---|---|
| Id | int | Auto-generated primary key |
| Title | string | Book title |
| Author | string | Author name |
| Genre | string | Genre (e.g. Fantasy, Romance) |
| Tags | string | Comma-separated tags |
| Summary | string | Short description |
| ReviewCount | int | Used for hidden gem ranking |
| Chapters | List\<Chapter\> | Optional chapter-level detail |

### Chapter
| Field | Type | Description |
|---|---|---|
| Id | int | Auto-generated primary key |
| BookId | int | Foreign key to Book |
| ChapterNumber | int | Chapter number |
| AlternativeSummary | string | Clean summary for filtered chapters |
| ContentWarnings | List\<ContentWarning\> | Warnings for this chapter |

### ContentWarning
| Field | Type | Description |
|---|---|---|
| Id | int | Auto-generated primary key |
| ChapterId | int | Foreign key to Chapter |
| Type | string | Violence, SexualContent, Profanity, Occult, FaithBased |
| Level | int | Severity 1 (mild) to 5 (severe) |

---

## Design

The UI uses a warm library aesthetic designed to feel trustworthy and approachable for a Christian audience while remaining appealing to general book lovers.

- **Primary color:** Burgundy `#7B2D42`
- **Background:** Warm cream `#FAF7F2`
- **Heading font:** Playfair Display (serif)
- **Body font:** Source Sans 3

---

## Roadmap

- [ ] Wire up content filter sliders to actually filter results
- [ ] Wire up sort dropdown (Title A–Z, Top Rated)
- [ ] Backend search endpoint (`/api/books?title=xxx`)
- [ ] Chapter-level warning display in book detail view
- [ ] User accounts and persistent preferences
- [ ] Community contributions (submit content warnings, alternative summaries)
- [ ] Book ratings

---

## Development Notes

- The frontend (port 5173) and backend (port 5213) run as separate processes
- CORS is configured in `Program.cs` to allow requests from `http://localhost:5173`
- The `AppDbContextFactory` is used by EF Core at design time for migrations
- The recommendation engine ranks books with `ReviewCount < 5000` first as "hidden gems"
