using RestaurantService.Application.DTOs;
using RestaurantService.Application.Interfaces;
using RestaurantService.Domain.Entities;
using RestaurantService.Domain.Interfaces;

namespace RestaurantService.Application.Services;

public class RestaurantService : IRestaurantService
{
    private readonly IRestaurantRepository _restaurantRepository;

    public RestaurantService(IRestaurantRepository restaurantRepository)
    {
        _restaurantRepository = restaurantRepository;
    }

    public async Task<IEnumerable<RestaurantDto>> GetAllRestaurantsAsync()
    {
        var restaurants = await _restaurantRepository.GetAllAsync();
        return restaurants.Select(r => new RestaurantDto
        {
            Id = r.Id,
            Name = r.Name,
            Description = r.Description,
            Address = r.Address,
            Phone = r.Phone,
            Email = r.Email,
            OpeningHours = r.OpeningHours,
            IsActive = r.IsActive,
            CreatedAt = r.CreatedAt,
            UpdatedAt = r.UpdatedAt
        });
    }

    public async Task<RestaurantDto?> GetRestaurantByIdAsync(int id)
    {
        var restaurant = await _restaurantRepository.GetByIdAsync(id);
        if (restaurant == null) return null;

        return new RestaurantDto
        {
            Id = restaurant.Id,
            Name = restaurant.Name,
            Description = restaurant.Description,
            Address = restaurant.Address,
            Phone = restaurant.Phone,
            Email = restaurant.Email,
            OpeningHours = restaurant.OpeningHours,
            IsActive = restaurant.IsActive,
            CreatedAt = restaurant.CreatedAt,
            UpdatedAt = restaurant.UpdatedAt
        };
    }

    public async Task<RestaurantDto> CreateRestaurantAsync(CreateRestaurantDto dto)
    {
        var restaurant = new Restaurant
        {
            Name = dto.Name,
            Description = dto.Description,
            Address = dto.Address,
            Phone = dto.Phone,
            Email = dto.Email,
            OpeningHours = dto.OpeningHours
        };

        var created = await _restaurantRepository.AddAsync(restaurant);

        return new RestaurantDto
        {
            Id = created.Id,
            Name = created.Name,
            Description = created.Description,
            Address = created.Address,
            Phone = created.Phone,
            Email = created.Email,
            OpeningHours = created.OpeningHours,
            IsActive = created.IsActive,
            CreatedAt = created.CreatedAt,
            UpdatedAt = created.UpdatedAt
        };
    }

    public async Task UpdateRestaurantAsync(int id, UpdateRestaurantDto dto)
    {
        var restaurant = await _restaurantRepository.GetByIdAsync(id);
        if (restaurant == null) throw new KeyNotFoundException("Restaurant not found");

        restaurant.Name = dto.Name;
        restaurant.Description = dto.Description;
        restaurant.Address = dto.Address;
        restaurant.Phone = dto.Phone;
        restaurant.Email = dto.Email;
        restaurant.OpeningHours = dto.OpeningHours;
        restaurant.IsActive = dto.IsActive;
        restaurant.UpdatedAt = DateTime.UtcNow;

        await _restaurantRepository.UpdateAsync(restaurant);
    }

    public async Task DeleteRestaurantAsync(int id)
    {
        await _restaurantRepository.DeleteAsync(id);
    }
}