const Lead = require("../models/Lead");
const Order = require("../models/Order");
const Interaction = require("../models/Interaction");

class LeadService {
  // Get leads that need to be called today
  async getLeadsForToday(kamId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return await Lead.find({
      kam: kamId,
      nextCallDate: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
      status: { $ne: "INACTIVE" },
    }).populate("kam");
  }

  // Get lead performance metrics
  async getLeadPerformance(leadId, startDate, endDate) {
    const orders = await Order.find({
      lead: leadId,
      orderDate: { $gte: startDate, $lte: endDate },
    });

    const interactions = await Interaction.find({
      lead: leadId,
      interactionDate: { $gte: startDate, $lte: endDate },
    });

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
    const totalInteractions = interactions.length;

    const successfulInteractions = interactions.filter(
      (int) => int.outcome === "SUCCESSFUL"
    ).length;

    return {
      totalOrders,
      totalRevenue,
      totalInteractions,
      successRate: (successfulInteractions / totalInteractions) * 100,
      averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
    };
  }

  // Get high-value leads that haven't been contacted in the last week
  async getHighValueLeadsNeedingContact() {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return await Lead.find({
      potentialValue: "HIGH",
      lastCallDate: { $lt: oneWeekAgo },
      status: { $ne: "INACTIVE" },
    }).populate("kam");
  }

  // Get leads by status with their latest interaction
  async getLeadsByStatus(status, kamId) {
    const leads = await Lead.find({
      status,
      kam: kamId,
    });

    const leadsWithLatestInteraction = await Promise.all(
      leads.map(async (lead) => {
        const latestInteraction = await Interaction.findOne({
          lead: lead._id,
        })
          .sort({ interactionDate: -1 })
          .limit(1);

        return {
          ...lead.toObject(),
          latestInteraction,
        };
      })
    );

    return leadsWithLatestInteraction;
  }
}

module.exports = new LeadService();
