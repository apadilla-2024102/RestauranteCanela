import restaurantService from './restaurant.service.js';

// Crear un restaurante
export const addRestaurant = async (req, res) => {
  try {
    const restaurant = await restaurantService.createRestaurant(req.body);
    res.status(201).json({
      success: true,
      data: restaurant,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear el restaurante',
      error: error.message,
    });
  }
};

// Obtener todos los restaurantes
export const getRestaurants = async (req, res) => {
  try {
    const restaurants = await restaurantService.fetchAllRestaurants();
    res.status(200).json({
      success: true,
      data: restaurants,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener los restaurantes',
      error: error.message,
    });
  }
};

// Obtener restaurante por ID
export const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await restaurantService.fetchRestaurantById(id);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurante no encontrado',
      });
    }

    res.status(200).json({
      success: true,
      data: restaurant,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener el restaurante',
      error: error.message,
    });
  }
};

// Actualizar restaurante
export const updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await restaurantService.updateRestaurantById(id, req.body);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Restaurante no encontrado',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Restaurante actualizado exitosamente',
      data: updated,
    });
  } catch (error) {
    if (error.message.includes('inactivo')) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el restaurante',
      error: error.message,
    });
  }
};

// Eliminar (soft delete) restaurante
export const deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await restaurantService.deactivateRestaurantById(id);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurante no encontrado',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Restaurante desactivado exitosamente',
      data: restaurant,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al desactivar el restaurante',
      error: error.message,
    });
  }
};