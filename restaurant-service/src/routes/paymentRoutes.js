const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.get('/order/:orderId', paymentController.getPayments);
router.get('/:id', paymentController.getPayment);
router.post('/', paymentController.createPayment);
router.put('/:id/status', paymentController.updatePaymentStatus);

module.exports = router;