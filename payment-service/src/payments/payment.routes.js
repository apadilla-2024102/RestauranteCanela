import { Router } from 'express';
import { getPayments, createPayment, getPaymentById, updatePayment, deletePayment } from './payment.controller.js';

const router = Router();

router.get('/', getPayments);
router.post('/', createPayment);
router.get('/:id', getPaymentById);
router.put('/:id', updatePayment);
router.delete('/:id', deletePayment);

export default router;
