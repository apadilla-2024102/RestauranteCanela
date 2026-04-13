const reportService = require('../services/reportService');

class ReportController {
    async getSalesReport(req, res) {
        try {
            const { restaurantId } = req.params;
            const { startDate, endDate } = req.query;
            const report = await reportService.getSalesReport(restaurantId, startDate, endDate);
            res.json({
                success: true,
                message: 'Sales report retrieved successfully',
                data: report
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async getOrderSummary(req, res) {
        try {
            const { restaurantId } = req.params;
            const summary = await reportService.getOrderSummary(restaurantId);
            res.json({
                success: true,
                message: 'Order summary retrieved successfully',
                data: summary
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async getGeneralStatistics(req, res) {
        try {
            const { restaurantId } = req.params;
            const stats = await reportService.getGeneralStatistics(restaurantId);
            res.json({
                success: true,
                message: 'General statistics retrieved successfully',
                data: stats
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new ReportController();