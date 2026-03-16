using BookAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/chapters")]

public class WarningsController : ControllerBase
{
    private readonly AppDbContext _context;

    public WarningsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("{id}/warnings")]
    public async Task<ActionResult<ContentWarning>> AddContentWarning(int id, ContentWarning contentWarning)
    {
        var chapter = await _context.Chapters.FindAsync(id);
        if (chapter == null) return NotFound();
        contentWarning.ChapterId = id;

        _context.ContentWarnings.Add(contentWarning);
        await _context.SaveChangesAsync();
        return contentWarning;
    }
}