namespace BookAPI.Models;

public class ContentWarning
{
    public int Id { get; set; }

    // Type of warning
    public string Type { get; set; } = ""; // e.g., "Violence", "SexualContent", "Profanity", "Occult", "FaithBased"

    // Level of severity (optional)
    public int Level { get; set; } = 1;

    // Foreign key to chapter
    public int ChapterId { get; set; }
    public Chapter? Chapter { get; set; }
}