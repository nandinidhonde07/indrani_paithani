import defaultSiteContent from '../data/defaultSiteContent.json';

class CMSService {
  static CMS_KEY = 'siteContent';

  static async getContent() {
    // In a real app, this would be an API call to PostgreSQL/Supabase
    return new Promise((resolve) => {
      const stored = localStorage.getItem(this.CMS_KEY);
      if (stored) {
        resolve(JSON.parse(stored));
      } else {
        localStorage.setItem(this.CMS_KEY, JSON.stringify(defaultSiteContent));
        resolve(defaultSiteContent);
      }
    });
  }

  static async updateContent(section, newContent) {
    return new Promise((resolve) => {
      const stored = JSON.parse(localStorage.getItem(this.CMS_KEY) || JSON.stringify(defaultSiteContent));
      stored[section] = { ...stored[section], ...newContent };
      localStorage.setItem(this.CMS_KEY, JSON.stringify(stored));
      resolve(stored);
    });
  }
}

export default CMSService;
