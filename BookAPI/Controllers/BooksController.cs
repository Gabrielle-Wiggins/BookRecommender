using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BookAPI.Services;
using BookAPI.Models;

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
    public async Task<IEnumerable<Book>> GetBooks()
    {
        return await _context.Books.ToListAsync();
    }

    [HttpPost]
    public async Task<Book> AddBook(Book book)
    {
        _context.Books.Add(book);
        await _context.SaveChangesAsync();
        return book;
    }

    [HttpGet("recommend")]
    public async Task<IEnumerable<Book>> Recommend(string genre)
    {
        return await _recommendationService.Recommend(genre);
    }
}