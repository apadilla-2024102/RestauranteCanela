import Report from './report.model.js';

class ReportService {
  async createReport(reportData) {
    const report = new Report(reportData);
    await report.save();
    return report;
  }

  async fetchAllReports() {
    return Report.find().populate('restaurantId', 'name');
  }

  async fetchReportById(id) {
    return Report.findById(id).populate('restaurantId', 'name');
  }

  async updateReportById(id, updateData) {
    const report = await Report.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate('restaurantId', 'name');
    return report;
  }

  async deleteReportById(id) {
    return Report.findByIdAndDelete(id);
  }

  async fetchReportsByRestaurant(restaurantId) {
    return Report.find({ restaurantId }).populate('restaurantId', 'name');
  }

  async fetchReportsByType(type) {
    return Report.find({ type }).populate('restaurantId', 'name');
  }

  async fetchReportsByStatus(status) {
    return Report.find({ status }).populate('restaurantId', 'name');
  }
}

export default new ReportService();