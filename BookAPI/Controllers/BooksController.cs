using BookAPI.Models;
using BookAPI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class BooksController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly RecommendationService _recommendationService;

    public BooksController(AppDbContext context, RecommendationService recommendationService)
    {
        _context = context;
        _recommendationService = recommendationService;
    }

    [HttpGet]
    public async Task<IEnumerable<Book>> GetBooks([FromQuery] string? genre, [FromQuery] string? title)
    {
        var query = _context.Books.AsQueryable();

        if (!string.IsNullOrEmpty(genre))
            query = query.Where(b => b.Genre == genre);

        if (!string.IsNullOrEmpty(title))
            query = query.Where(b => b.Title.ToLower().Contains(title.ToLower()));

        return await query.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Book>> GetBook(int id)
    {
        var book = await _context.Books
            .Include(b => b.Chapters)
            .ThenInclude(c => c.ContentWarnings)
            .FirstOrDefaultAsync(b => b.Id == id);

        if (book == null) return NotFound();
        return book;
    }

    [HttpPost]
    public async Task<Book> AddBook(Book book)
    {
        _context.Books.Add(book);
        await _context.SaveChangesAsync();
        return book;
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<Book>> DeleteBook(int id)
    {
        var book = await _context.Books.FindAsync(id);

        if (book == null) return NotFound();

        _context.Books.Remove(book);
        await _context.SaveChangesAsync();
        return book;
    }

    [HttpGet("recommend")]
    public async Task<IEnumerable<Book>> Recommend(string genre)
    {
        return await _recommendationService.Recommend(genre);
    }
}
