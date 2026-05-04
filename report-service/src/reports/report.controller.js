import reportService from './report.service.js';

export const getReports = async (req, res) => {
  try {
    const reports = await reportService.fetchAllReports();
    res.status(200).json({ success: true, data: reports });
  } catch (error) {
    console.error('Error al obtener reportes:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

export const createReport = async (req, res) => {
  try {
    const newReport = await reportService.createReport(req.body);
    res.status(201).json({ success: true, data: newReport });
  } catch (error) {
    console.error('Error al crear reporte:', error);
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: 'Datos inválidos', errors: error.errors });
    } else {
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }
};

export const getReportById = async (req, res) => {
  try {
    const report = await reportService.fetchReportById(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Reporte no encontrado' });
    }
    res.status(200).json({ success: true, data: report });
  } catch (error) {
    console.error('Error al obtener reporte:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

export const updateReport = async (req, res) => {
  try {
    const report = await reportService.updateReportById(req.params.id, req.body);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Reporte no encontrado' });
    }
    res.status(200).json({ success: true, data: report });
  } catch (error) {
    console.error('Error al actualizar reporte:', error);
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: 'Datos inválidos', errors: error.errors });
    } else {
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }
};

export const deleteReport = async (req, res) => {
  try {
    const deleted = await reportService.deleteReportById(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Reporte no encontrado' });
    }
    res.status(200).json({ success: true, data: deleted });
  } catch (error) {
    console.error('Error al eliminar reporte:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};
