const { Order, Payment, Review, MenuItem } = require('../models');
const { Op, fn, col, literal } = require('sequelize');

class ReportService {
    async getSalesReport(restaurantId, startDate, endDate) {
        const orders = await Order.findAll({
            where: {
                restaurantId,
                createdAt: {
                    [Op.between]: [startDate, endDate]
                }
            },
            include: [{ model: Payment, as: 'payments' }]
        });

        const totalSales = orders.reduce((sum, order) => sum + parseFloat(order.total), 0);
        const totalOrders = orders.length;
        const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

        return {
            totalSales,
            totalOrders,
            averageOrderValue,
            orders
        };
    }

    async getOrderSummary(restaurantId) {
        const orders = await Order.findAll({
            where: { restaurantId },
            attributes: [
                'status',
                [fn('COUNT', col('id')), 'count']
            ],
            group: ['status']
        });

        return orders.map(order => ({
            status: order.status,
            count: order.dataValues.count
        }));
    }

    async getGeneralStatistics(restaurantId) {
        const totalReviews = await Review.count({ where: { restaurantId } });
        const averageRating = await Review.findAll({
            where: { restaurantId },
            attributes: [[fn('AVG', col('rating')), 'avgRating']]
        });

        const totalMenuItems = await MenuItem.count({ where: { restaurantId } });

        return {
            totalReviews,
            averageRating: averageRating[0].dataValues.avgRating || 0,
            totalMenuItems
        };
    }
}

module.exports = new ReportService();