import orderService from './order.service.js';

export const getOrders = async (req, res) => {
  try {
    const orders = await orderService.fetchAllOrders();
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error('Error al obtener órdenes:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

export const createOrder = async (req, res) => {
  try {
    const newOrder = await orderService.createOrder(req.body);
    res.status(201).json({ success: true, data: newOrder });
  } catch (error) {
    console.error('Error al crear orden:', error);
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: 'Datos inválidos', errors: error.errors });
    } else {
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await orderService.fetchOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Orden no encontrada' });
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error('Error al obtener orden:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const order = await orderService.updateOrderById(req.params.id, req.body);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Orden no encontrada' });
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error('Error al actualizar orden:', error);
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: 'Datos inválidos', errors: error.errors });
    } else {
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const deleted = await orderService.deleteOrderById(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Orden no encontrada' });
    }
    res.status(200).json({ success: true, data: deleted });
  } catch (error) {
    console.error('Error al eliminar orden:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};
