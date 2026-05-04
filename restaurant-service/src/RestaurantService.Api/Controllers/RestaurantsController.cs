using Microsoft.AspNetCore.Mvc;
using RestaurantService.Application.DTOs;
using RestaurantService.Application.Interfaces;

namespace RestaurantService.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RestaurantsController : ControllerBase
{
    private readonly IRestaurantService _restaurantService;

    public RestaurantsController(IRestaurantService restaurantService)
    {
        _restaurantService = restaurantService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var restaurants = await _restaurantService.GetAllRestaurantsAsync();
        return Ok(restaurants);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var restaurant = await _restaurantService.GetRestaurantByIdAsync(id);
        if (restaurant == null) return NotFound();
        return Ok(restaurant);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateRestaurantDto dto)
    {
        var restaurant = await _restaurantService.CreateRestaurantAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = restaurant.Id }, restaurant);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateRestaurantDto dto)
    {
        try
        {
            await _restaurantService.UpdateRestaurantAsync(id, dto);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _restaurantService.DeleteRestaurantAsync(id);
        return NoContent();
    }
}