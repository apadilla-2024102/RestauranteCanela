import menuService from './menu.service.js';

export const getMenuItems = async (req, res) => {
  try {
    const menuItems = await menuService.fetchAllMenuItems();
    res.status(200).json({ success: true, data: menuItems });
  } catch (error) {
    console.error('Error al obtener items del menú:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

export const createMenuItem = async (req, res) => {
  try {
    const newMenuItem = await menuService.createMenuItem(req.body);
    res.status(201).json({ success: true, data: newMenuItem });
  } catch (error) {
    console.error('Error al crear item del menú:', error);
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: 'Datos inválidos', errors: error.errors });
    } else {
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }
};

export const getMenuItemById = async (req, res) => {
  try {
    const menuItem = await menuService.fetchMenuItemById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ success: false, message: 'Item del menú no encontrado' });
    }
    res.status(200).json({ success: true, data: menuItem });
  } catch (error) {
    console.error('Error al obtener item del menú:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

export const updateMenuItem = async (req, res) => {
  try {
    const menuItem = await menuService.updateMenuItemById(req.params.id, req.body);
    if (!menuItem) {
      return res.status(404).json({ success: false, message: 'Item del menú no encontrado' });
    }
    res.status(200).json({ success: true, data: menuItem });
  } catch (error) {
    console.error('Error al actualizar item del menú:', error);
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: 'Datos inválidos', errors: error.errors });
    } else {
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }
};

export const deleteMenuItem = async (req, res) => {
  try {
    const deleted = await menuService.deleteMenuItemById(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Item del menú no encontrado' });
    }
    res.status(200).json({ success: true, data: deleted });
  } catch (error) {
    console.error('Error al eliminar item del menú:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};
