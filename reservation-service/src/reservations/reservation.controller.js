import reservationService from './reservation.service.js';

export const getReservations = async (req, res) => {
  try {
    const reservations = await reservationService.fetchAllReservations();
    res.status(200).json({ success: true, data: reservations });
  } catch (error) {
    console.error('Error al obtener reservaciones:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

export const createReservation = async (req, res) => {
  try {
    const newReservation = await reservationService.createReservation(req.body);
    res.status(201).json({ success: true, data: newReservation });
  } catch (error) {
    console.error('Error al crear reservación:', error);
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: 'Datos inválidos', errors: error.errors });
    } else {
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }
};

export const getReservationById = async (req, res) => {
  try {
    const reservation = await reservationService.fetchReservationById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservación no encontrada' });
    }
    res.status(200).json({ success: true, data: reservation });
  } catch (error) {
    console.error('Error al obtener reservación:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

export const updateReservation = async (req, res) => {
  try {
    const reservation = await reservationService.updateReservationById(req.params.id, req.body);
    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservación no encontrada' });
    }
    res.status(200).json({ success: true, data: reservation });
  } catch (error) {
    console.error('Error al actualizar reservación:', error);
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: 'Datos inválidos', errors: error.errors });
    } else {
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }
};

export const deleteReservation = async (req, res) => {
  try {
    const deleted = await reservationService.deleteReservationById(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Reservación no encontrada' });
    }
    res.status(200).json({ success: true, data: deleted });
  } catch (error) {
    console.error('Error al eliminar reservación:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};
