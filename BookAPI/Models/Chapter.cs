namespace BookAPI.Models;

public class Chapter
{
    public int Id { get; set; }
    public int BookId { get; set; }
    public int ChapterNumber { get; set; }

    public string AlternativeSummary { get; set; } = "";

    // New: list of warnings
    public List<ContentWarning>? ContentWarnings { get; set; }
}