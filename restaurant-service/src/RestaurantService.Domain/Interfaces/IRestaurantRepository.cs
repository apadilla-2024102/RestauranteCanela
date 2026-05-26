using RestaurantService.Domain.Entities;

namespace RestaurantService.Domain.Interfaces;

public interface IRestaurantRepository : IRepository<Restaurant>
{
    Task<IEnumerable<Restaurant>> GetActiveRestaurantsAsync();
    Task<Restaurant?> GetByNameAsync(string name);
}