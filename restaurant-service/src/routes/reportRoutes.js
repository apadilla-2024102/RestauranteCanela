const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.get('/sales/:restaurantId', reportController.getSalesReport);
router.get('/orders/:restaurantId', reportController.getOrderSummary);
router.get('/statistics/:restaurantId', reportController.getGeneralStatistics);

module.exports = router;