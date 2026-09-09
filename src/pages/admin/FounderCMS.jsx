import React, { useState, useEffect } from 'react';
import useAppStore from '../../store/useAppStore';
import MediaInput from '../../components/admin/MediaInput';

const FounderCMS = () => {
  const { cmsContent, updateCMSSection } = useAppStore();
  const [formData, setFormData] = useState(cmsContent?.home || {});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (cmsContent?.home) {
      setFormData(cmsContent.home);
    }
  }, [cmsContent]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    await updateCMSSection('home', formData);
    setIsSaving(false);
    alert('Founder details updated successfully!');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="border-b border-gold/20 pb-4 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-heading text-maroon">Founder CMS</h2>
          <p className="text-sm text-gray-500 font-light mt-1">Manage the Founder's section content and imagery.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="bg-maroon hover:bg-gold text-white font-semibold py-2 px-6 rounded-full transition shadow-md"
        >
          {isSaving ? 'Saving...' : 'Publish Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Form */}
        <form onSubmit={handleSave} className="space-y-6 bg-white p-6 rounded-2xl shadow-premium border border-gold/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MediaInput 
              label="Founder Photo" 
              value={formData.founderImage || ''} 
              onChange={(val) => handleChange('founderImage', val)} 
            />
            {/* Keeping signature for future expansion, though not natively in default JSON yet. I'll map it to founderSignature if provided */}
            <MediaInput 
              label="Signature Image (Optional)" 
              value={formData.founderSignature || ''} 
              onChange={(val) => handleChange('founderSignature', val)} 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Founder Name</label>
            <input
              type="text"
              value={formData.founderName || ''}
              onChange={(e) => handleChange('founderName', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold font-heading"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Designation / Title</label>
            <input
              type="text"
              value={formData.founderTitle || ''}
              onChange={(e) => handleChange('founderTitle', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Biography Paragraph 1</label>
            <textarea
              rows="4"
              value={formData.founderText1 || ''}
              onChange={(e) => handleChange('founderText1', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-sm"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Biography Paragraph 2</label>
            <textarea
              rows="4"
              value={formData.founderText2 || ''}
              onChange={(e) => handleChange('founderText2', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-sm"
            ></textarea>
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Quote</label>
            <input
              type="text"
              value={formData.founderQuote || ''}
              onChange={(e) => handleChange('founderQuote', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold italic"
            />
          </div>
        </form>

        {/* Live Preview */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4 tracking-widest">Live Preview</h3>
          <div className="border border-[#E5E5E5] rounded-3xl p-8 bg-white shadow-sm sticky top-6">
            <div className="relative mb-6">
              {formData.founderImage ? (
                <img
                  src={formData.founderImage}
                  alt={formData.founderName}
                  className="w-full max-w-[250px] mx-auto rounded-xl object-cover aspect-[4/5] shadow-md"
                />
              ) : (
                <div className="w-full max-w-[250px] mx-auto bg-gray-100 rounded-xl aspect-[4/5] flex items-center justify-center text-gray-400 text-xs">
                  No Image Selected
                </div>
              )}
            </div>
            <div className="space-y-4 text-center">
              <h2 className="text-[10px] tracking-[0.25em] text-[#111111] uppercase font-bold font-heading">About The Founder</h2>
              <h3 className="text-2xl font-heading font-bold text-[#111111]">{formData.founderName || 'Name'}</h3>
              <h4 className="text-[#666666] font-body tracking-wide font-medium text-sm">{formData.founderTitle || 'Title'}</h4>
              
              <div className="w-12 h-px bg-[#111111] mx-auto my-4"></div>
              
              {formData.founderQuote && (
                <p className="italic text-maroon text-sm font-semibold">"{formData.founderQuote}"</p>
              )}

              <p className="text-[#2B2B2B] font-body text-xs leading-[1.8] mt-4 text-left">
                {formData.founderText1}
              </p>
              
              <p className="text-[#2B2B2B] font-body text-xs leading-[1.8] mt-2 text-left">
                {formData.founderText2}
              </p>

              {formData.founderSignature && (
                <div className="flex justify-start mt-6">
                  <img src={formData.founderSignature} alt="Signature" className="h-12 object-contain opacity-80" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FounderCMS;
