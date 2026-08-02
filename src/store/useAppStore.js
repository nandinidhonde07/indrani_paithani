import { create } from 'zustand';
import CMSService from '../services/CMSService';

const useAppStore = create((set, get) => ({
  cmsContent: null,
  isCMSLoading: true,
  isInitialized: false,

  initStore: async () => {
    if (get().isInitialized) return;
    
    // Initial fetch
    await get().fetchCMSContent();
    
    // Listen for storage changes across tabs (Real-Time Sync simulation)
    window.addEventListener('storage', async (e) => {
      if (e.key === CMSService.CMS_KEY) {
        set({ cmsContent: JSON.parse(e.newValue) });
      }
    });

    set({ isInitialized: true });
  },

  fetchCMSContent: async () => {
    set({ isCMSLoading: true });
    const content = await CMSService.getContent();
    set({ cmsContent: content, isCMSLoading: false });
  },

  updateCMSSection: async (section, newContent) => {
    const updated = await CMSService.updateContent(section, newContent);
    set({ cmsContent: updated });
  }
}));

export default useAppStore;
