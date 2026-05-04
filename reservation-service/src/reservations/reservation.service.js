import Reservation from './reservation.model.js';

class ReservationService {
  async createReservation(reservationData) {
    const reservation = new Reservation(reservationData);
    await reservation.save();
    return reservation;
  }

  async fetchAllReservations() {
    return Reservation.find().populate('restaurantId', 'name');
  }

  async fetchReservationById(id) {
    return Reservation.findById(id).populate('restaurantId', 'name');
  }

  async updateReservationById(id, updateData) {
    const reservation = await Reservation.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate('restaurantId', 'name');
    return reservation;
  }

  async deleteReservationById(id) {
    return Reservation.findByIdAndDelete(id);
  }

  async fetchReservationsByRestaurant(restaurantId) {
    return Reservation.find({ restaurantId }).populate('restaurantId', 'name');
  }

  async fetchReservationsByStatus(status) {
    return Reservation.find({ status }).populate('restaurantId', 'name');
  }
}

export default new ReservationService();