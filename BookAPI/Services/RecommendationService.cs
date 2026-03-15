using BookAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace BookAPI.Services;

public class RecommendationService
{
    private readonly AppDbContext _context;

    public RecommendationService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Book>> Recommend(string genre)
    {
        return await _context.Books
            .Where(b => b.Genre == genre)
            .OrderBy(b => b.ReviewCount < 5000 ? 0 : 1) // hidden gem boost
            .Take(10)
            .ToListAsync();
    }
}