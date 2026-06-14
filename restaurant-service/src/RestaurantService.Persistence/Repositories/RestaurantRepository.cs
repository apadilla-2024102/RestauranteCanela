using RestaurantService.Domain.Entities;
using RestaurantService.Domain.Interfaces;
using RestaurantService.Persistence.Data;
using Microsoft.EntityFrameworkCore;

namespace RestaurantService.Persistence.Repositories;

public class RestaurantRepository : IRestaurantRepository
{
    private readonly ApplicationDbContext _context;

    public RestaurantRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Restaurant?> GetByIdAsync(int id)
    {
        return await _context.Restaurants.FindAsync(id);
    }

    public async Task<IEnumerable<Restaurant>> GetAllAsync()
    {
        return await _context.Restaurants.ToListAsync();
    }

    public async Task<Restaurant> AddAsync(Restaurant entity)
    {
        _context.Restaurants.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task UpdateAsync(Restaurant entity)
    {
        _context.Restaurants.Update(entity);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var restaurant = await GetByIdAsync(id);
        if (restaurant != null)
        {
            _context.Restaurants.Remove(restaurant);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<IEnumerable<Restaurant>> GetActiveRestaurantsAsync()
    {
        return await _context.Restaurants.Where(r => r.IsActive).ToListAsync();
    }

    public async Task<Restaurant?> GetByNameAsync(string name)
    {
        return await _context.Restaurants.FirstOrDefaultAsync(r => r.Name == name);
    }
}