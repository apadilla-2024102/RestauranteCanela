const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

router.get('/restaurant/:restaurantId', reservationController.getReservations);
router.get('/:id', reservationController.getReservation);
router.post('/', reservationController.createReservation);
router.put('/:id', reservationController.updateReservation);
router.delete('/:id', reservationController.deleteReservation);

module.exports = router;