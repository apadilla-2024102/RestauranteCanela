const { Reservation, Table } = require('../models');
const { Op } = require('sequelize');

class ReservationService {
    async getReservations(restaurantId) {
        return await Reservation.findAll({
            where: { restaurantId },
            include: [{ model: Table, as: 'table' }]
        });
    }

    async getReservation(id) {
        const reservation = await Reservation.findByPk(id, {
            include: [{ model: Table, as: 'table' }]
        });
        if (!reservation) {
            throw new Error('Reservation not found');
        }
        return reservation;
    }

    async createReservation(data) {
        // Check table availability
        const existingReservation = await Reservation.findOne({
            where: {
                tableId: data.tableId,
                date: data.date,
                time: data.time,
                status: { [Op.ne]: 'cancelled' }
            }
        });
        if (existingReservation) {
            throw new Error('Table is not available at this time');
        }
        return await Reservation.create(data);
    }

    async updateReservation(id, data) {
        const reservation = await this.getReservation(id);
        await reservation.update(data);
        return reservation;
    }

    async deleteReservation(id) {
        const reservation = await this.getReservation(id);
        await reservation.destroy();
        return { message: 'Reservation deleted successfully' };
    }
}

module.exports = new ReservationService();