namespace BookAPI.Models;

public class Book
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public string Author { get; set; } = "";
    public string Genre { get; set; } = "";
    public string Tags { get; set; } = "";
    public string Summary { get; set; } = "";
    public string CoverImageUrl { get; set; } = "";
    public int ReviewCount { get; set; }

    public List<Chapter>? Chapters { get; set; }

    // Optional: quick access to highest content warning per category
    public int MaxViolenceLevel { get; set; } = 0;
    public int MaxSexualContentLevel { get; set; } = 0;
    public int MaxProfanityLevel { get; set; } = 0;
    public int MaxOccultLevel { get; set; } = 0;
    public int FaithElements { get; set; } = 0;
}