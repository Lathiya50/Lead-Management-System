// services/contactService.js
const Contact = require("../models/Contact");

class ContactService {
  async createContact(contactData) {
    // If this is marked as primary contact, remove primary status from other contacts
    if (contactData.isPrimary) {
      await Contact.updateMany(
        { lead: contactData.lead },
        { isPrimary: false }
      );
    }

    return await Contact.create(contactData);
  }

  async getLeadContacts(leadId) {
    return await Contact.find({ lead: leadId }).sort({
      isPrimary: -1,
      createdAt: -1,
    });
  }
}

module.exports = new ContactService();
