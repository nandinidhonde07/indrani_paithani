import defaultSiteContent from '../data/defaultSiteContent.json';

class CMSService {
  static CMS_KEY = 'siteContent';

  static async getContent() {
    return new Promise((resolve) => {
      const storedStr = localStorage.getItem(this.CMS_KEY);
      if (storedStr) {
        const stored = JSON.parse(storedStr);
        // Shallow merge top-level sections to ensure new fields in defaultSiteContent are available
        const merged = { ...defaultSiteContent };
        for (const key in stored) {
          if (merged[key]) {
            merged[key] = { ...merged[key], ...stored[key] };
          } else {
            merged[key] = stored[key];
          }
        }
        
        // Ensure new hero fields are populated if they were missing or undefined in the old storage
        if (!stored.home?.heroTitle || stored.home?.heroTitle === "INDRANI PAITHANI") {
           merged.home.heroTitle = defaultSiteContent.home.heroTitle;
           merged.home.heroSubtitle = defaultSiteContent.home.heroSubtitle;
           merged.home.heroBadge = defaultSiteContent.home.heroBadge;
           merged.home.heroLabel = defaultSiteContent.home.heroLabel;
        }

        resolve(merged);
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
