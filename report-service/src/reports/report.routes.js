import { Router } from 'express';
import { getReports, createReport, getReportById, updateReport, deleteReport } from './report.controller.js';

const router = Router();

router.get('/', getReports);
router.post('/', createReport);
router.get('/:id', getReportById);
router.put('/:id', updateReport);
router.delete('/:id', deleteReport);

export default router;
