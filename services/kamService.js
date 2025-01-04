// services/kamService.js
const KAM = require("../models/KAM");
const Lead = require("../models/Lead");
const ErrorResponse = require("../utils/errorResponse");

class KAMService {
  async getPerformanceMetrics(kamId, startDate, endDate) {
    const leads = await Lead.find({ kam: kamId });
    const leadIds = leads.map((lead) => lead._id);

    const orders = await Order.find({
      lead: { $in: leadIds },
      orderDate: { $gte: startDate, $lte: endDate },
    });

    const interactions = await Interaction.find({
      kam: kamId,
      interactionDate: { $gte: startDate, $lte: endDate },
    });

    return {
      totalLeads: leads.length,
      activeLeads: leads.filter((l) => l.status === "ACTIVE").length,
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + order.amount, 0),
      totalInteractions: interactions.length,
      successfulInteractions: interactions.filter(
        (i) => i.outcome === "SUCCESSFUL"
      ).length,
    };
  }
}

module.exports = new KAMService();
