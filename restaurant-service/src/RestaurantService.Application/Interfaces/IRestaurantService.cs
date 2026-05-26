using RestaurantService.Application.DTOs;

namespace RestaurantService.Application.Interfaces;

public interface IRestaurantService
{
    Task<IEnumerable<RestaurantDto>> GetAllRestaurantsAsync();
    Task<RestaurantDto?> GetRestaurantByIdAsync(int id);
    Task<RestaurantDto> CreateRestaurantAsync(CreateRestaurantDto dto);
    Task UpdateRestaurantAsync(int id, UpdateRestaurantDto dto);
    Task DeleteRestaurantAsync(int id);
}