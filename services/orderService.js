const Order = require("../models/Order");
const Lead = require("../models/Lead");

class OrderService {
  async createOrder(orderData) {
    const order = await Order.create(orderData);

    // Update lead status if it's their first order
    const lead = await Lead.findById(order.lead);
    if (lead.status === "CONVERTING") {
      lead.status = "ACTIVE";
      await lead.save();
    }

    return order;
  }

  async getLeadOrders(leadId, startDate, endDate) {
    return await Order.find({
      lead: leadId,
      orderDate: { $gte: startDate, $lte: endDate },
    }).sort({ orderDate: -1 });
  }
}

module.exports = new OrderService();
