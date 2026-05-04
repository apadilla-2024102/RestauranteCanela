import paymentService from './payment.service.js';

export const getPayments = async (req, res) => {
  try {
    const payments = await paymentService.fetchAllPayments();
    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    console.error('Error al obtener pagos:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

export const createPayment = async (req, res) => {
  try {
    const newPayment = await paymentService.createPayment(req.body);
    res.status(201).json({ success: true, data: newPayment });
  } catch (error) {
    console.error('Error al crear pago:', error);
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: 'Datos inválidos', errors: error.errors });
    } else {
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }
};

export const getPaymentById = async (req, res) => {
  try {
    const payment = await paymentService.fetchPaymentById(req.params.id);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Pago no encontrado' });
    }
    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    console.error('Error al obtener pago:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

export const updatePayment = async (req, res) => {
  try {
    const payment = await paymentService.updatePaymentById(req.params.id, req.body);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Pago no encontrado' });
    }
    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    console.error('Error al actualizar pago:', error);
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: 'Datos inválidos', errors: error.errors });
    } else {
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }
};

export const deletePayment = async (req, res) => {
  try {
    const deleted = await paymentService.deletePaymentById(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Pago no encontrado' });
    }
    res.status(200).json({ success: true, data: deleted });
  } catch (error) {
    console.error('Error al eliminar pago:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};
