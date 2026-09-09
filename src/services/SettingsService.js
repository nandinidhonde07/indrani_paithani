class SettingsService {
  static SETTINGS_KEY = 'indrani_settings';
  static MEDIA_KEY = 'indrani_media_library';

  static async getSettings() {
    return new Promise((resolve) => {
      const stored = localStorage.getItem(this.SETTINGS_KEY);
      resolve(stored ? JSON.parse(stored) : {
        shippingCharge: 150,
        freeShippingThreshold: 5000,
        packagingCharge: 0,
        taxPercent: 5
      });
    });
  }

  static async updateSettings(newSettings) {
    const current = await this.getSettings();
    const updated = { ...current, ...newSettings };
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(updated));
    return updated;
  }

  static async getMediaLibrary() {
    return new Promise((resolve) => {
      const stored = localStorage.getItem(this.MEDIA_KEY);
      resolve(stored ? JSON.parse(stored) : [
        { id: '1', url: '/assets/homepage_bg.jpg', type: 'image', name: 'homepage_bg.jpg' },
        { id: '2', url: '/assets/founder_home.jpg', type: 'image', name: 'founder_home.jpg' },
        { id: '3', url: '/assets/founder_about.jpg', type: 'image', name: 'founder_about.jpg' }
      ]);
    });
  }

  static async addMedia(fileObject) {
    const media = await this.getMediaLibrary();
    const updated = [{
      id: String(Date.now()),
      url: fileObject.url,
      type: fileObject.type,
      name: fileObject.name
    }, ...media];
    localStorage.setItem(this.MEDIA_KEY, JSON.stringify(updated));
    return updated;
  }
}

export default SettingsService;
