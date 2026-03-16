using BookAPI.Models;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/books")]

public class ChaptersController : ControllerBase
{
    private readonly AppDbContext _context;

    public ChaptersController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("{id}/chapters")]
    public async Task<ActionResult<Chapter>> AddChapter(int id, Chapter chapter)
    {
        var book = await _context.Books.FindAsync(id);

        if (book == null) return NotFound();

        chapter.BookId = id;
        _context.Chapters.Add(chapter);
        await _context.SaveChangesAsync();
        return chapter;
    }
}