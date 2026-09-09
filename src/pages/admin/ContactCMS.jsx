import React, { useState, useEffect } from 'react';
import useAppStore from '../../store/useAppStore';

const ContactCMS = () => {
  const { cmsContent, updateCMSSection } = useAppStore();
  const [formData, setFormData] = useState(cmsContent?.contact || {});
  const [footerData, setFooterData] = useState(cmsContent?.footer || {});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (cmsContent?.contact) setFormData(cmsContent.contact);
    if (cmsContent?.footer) setFooterData(cmsContent.footer);
  }, [cmsContent]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    await updateCMSSection('contact', formData);
    await updateCMSSection('footer', footerData);
    setIsSaving(false);
    alert('Contact & Footer info updated successfully!');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="border-b border-gold/20 pb-4 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-heading text-maroon">Contact & Footer CMS</h2>
          <p className="text-sm text-gray-500 font-light mt-1">Manage global contact information and footer links.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="bg-maroon hover:bg-gold text-white font-semibold py-2 px-6 rounded-full transition shadow-md"
        >
          {isSaving ? 'Saving...' : 'Publish Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-premium border border-gold/10 space-y-6">
          <h3 className="text-xl font-heading text-maroon border-b pb-2">Contact Details</h3>
          
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Email Address</label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold outline-none"
            />
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Phone Number</label>
            <input
              type="text"
              value={formData.phone || ''}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Physical Address</label>
            <textarea
              rows="3"
              value={formData.address || ''}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold outline-none"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">WhatsApp Greeting Text</label>
            <input
              type="text"
              value={formData.whatsappText || ''}
              onChange={(e) => setFormData({...formData, whatsappText: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold outline-none text-sm"
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-premium border border-gold/10 space-y-6">
          <h3 className="text-xl font-heading text-maroon border-b pb-2">Footer Setup</h3>
          
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Brand Description (Footer)</label>
            <textarea
              rows="3"
              value={footerData.description || ''}
              onChange={(e) => setFooterData({...footerData, description: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold outline-none text-sm"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Facebook URL</label>
            <input
              type="text"
              value={footerData.facebookUrl || ''}
              onChange={(e) => setFooterData({...footerData, facebookUrl: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Instagram URL</label>
            <input
              type="text"
              value={footerData.instagramUrl || ''}
              onChange={(e) => setFooterData({...footerData, instagramUrl: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">YouTube URL</label>
            <input
              type="text"
              value={footerData.youtubeUrl || ''}
              onChange={(e) => setFooterData({...footerData, youtubeUrl: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactCMS;
