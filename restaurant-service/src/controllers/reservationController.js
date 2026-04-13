const reservationService = require('../services/reservationService');

class ReservationController {
    async getReservations(req, res) {
        try {
            const { restaurantId } = req.params;
            const reservations = await reservationService.getReservations(restaurantId);
            res.json({
                success: true,
                message: 'Reservations retrieved successfully',
                data: reservations
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async getReservation(req, res) {
        try {
            const { id } = req.params;
            const reservation = await reservationService.getReservation(id);
            res.json({
                success: true,
                message: 'Reservation retrieved successfully',
                data: reservation
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    async createReservation(req, res) {
        try {
            const data = req.body;
            const reservation = await reservationService.createReservation(data);
            res.status(201).json({
                success: true,
                message: 'Reservation created successfully',
                data: reservation
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async updateReservation(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            const reservation = await reservationService.updateReservation(id, data);
            res.json({
                success: true,
                message: 'Reservation updated successfully',
                data: reservation
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async deleteReservation(req, res) {
        try {
            const { id } = req.params;
            const result = await reservationService.deleteReservation(id);
            res.json({
                success: true,
                message: result.message
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new ReservationController();