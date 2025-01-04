// services/interactionService.js
const Interaction = require("../models/Interaction");
const Lead = require("../models/Lead");

class InteractionService {
  async createInteraction(interactionData) {
    const interaction = await Interaction.create(interactionData);

    // Update lead's last call date and next call date
    if (interaction.type === "CALL") {
      const lead = await Lead.findById(interaction.lead);
      lead.lastCallDate = interaction.interactionDate;
      lead.nextCallDate = new Date(
        interaction.interactionDate.getTime() +
          lead.callFrequency * 24 * 60 * 60 * 1000
      );
      await lead.save();
    }

    return interaction;
  }

  async getLeadInteractionHistory(leadId) {
    return await Interaction.find({ lead: leadId })
      .sort({ interactionDate: -1 })
      .populate("kam", "name email");
  }
}

module.exports = new LeadService();
