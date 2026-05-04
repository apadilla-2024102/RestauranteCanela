export const requestLogger = (req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[Menu Inventory] ${req.method} ${req.url}`);
  }
  next();
};

export const notFound = (req, res) => {
  res.status(404).json({ success: false, message: 'Ruta no encontrada' });
};

export const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: err.message || 'Error interno del servidor' });
};
