class ContactService {
  static INQUIRIES_KEY = 'contact_inquiries';

  static async getAllInquiries() {
    return new Promise((resolve) => {
      const inquiries = JSON.parse(localStorage.getItem(this.INQUIRIES_KEY) || '[]');
      resolve(inquiries);
    });
  }

  static async saveInquiries(inquiries) {
    return new Promise((resolve) => {
      localStorage.setItem(this.INQUIRIES_KEY, JSON.stringify(inquiries));
      resolve(inquiries);
    });
  }

  static async submitInquiry(inquiryData) {
    return new Promise(async (resolve) => {
      const inquiries = await this.getAllInquiries();
      const newInquiry = {
        id: 'INQ' + Date.now(),
        ...inquiryData,
        status: 'unread', // unread | read | replied
        date: new Date().toISOString()
      };
      inquiries.push(newInquiry);
      await this.saveInquiries(inquiries);
      resolve(newInquiry);
    });
  }

  static async updateInquiryStatus(inquiryId, status) {
    return new Promise(async (resolve) => {
      const inquiries = await this.getAllInquiries();
      const updated = inquiries.map(inq => inq.id === inquiryId ? { ...inq, status } : inq);
      await this.saveInquiries(updated);
      resolve(updated);
    });
  }

  static async deleteInquiry(inquiryId) {
    return new Promise(async (resolve) => {
      const inquiries = await this.getAllInquiries();
      const updated = inquiries.filter(inq => inq.id !== inquiryId);
      await this.saveInquiries(updated);
      resolve(updated);
    });
  }
}

export default ContactService;
