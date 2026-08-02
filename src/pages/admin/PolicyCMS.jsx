import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import useAppStore from '../../store/useAppStore';

const PolicyCMS = () => {
  const { cmsContent, updateCMSSection } = useAppStore();
  
  // We'll manage policy content in cmsContent.policies
  const initialPolicies = cmsContent?.policies || {
    privacy: '<p>Privacy policy content goes here...</p>',
    shipping: '<p>Shipping policy content goes here...</p>',
    refund: '<p>Refund policy content goes here...</p>',
    terms: '<p>Terms and conditions go here...</p>',
    accessibility: '<p>Accessibility statement goes here...</p>'
  };

  const [policies, setPolicies] = useState(initialPolicies);
  const [activePolicy, setActivePolicy] = useState('privacy');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (cmsContent?.policies) {
      setPolicies(cmsContent.policies);
    }
  }, [cmsContent]);

  const handleEditorChange = (content) => {
    setPolicies(prev => ({ ...prev, [activePolicy]: content }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await updateCMSSection('policies', policies);
    setIsSaving(false);
    alert('Policies updated successfully!');
  };

  const policyTabs = [
    { id: 'privacy', label: 'Privacy Policy' },
    { id: 'shipping', label: 'Shipping Policy' },
    { id: 'refund', label: 'Refund Policy' },
    { id: 'terms', label: 'Terms & Conditions' },
    { id: 'accessibility', label: 'Accessibility' }
  ];

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link'],
      ['clean']
    ],
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="border-b border-gold/20 pb-4 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-heading text-maroon">Policy Pages CMS</h2>
          <p className="text-sm text-gray-500 font-light mt-1">Edit legal and policy pages using the rich text editor.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="bg-maroon hover:bg-gold text-white font-semibold py-2 px-6 rounded-full transition shadow-md"
        >
          {isSaving ? 'Saving...' : 'Publish Policies'}
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-premium border border-gold/10 flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 space-y-2 border-r border-gray-100 pr-4">
          {policyTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActivePolicy(tab.id)}
              className={`w-full text-left py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                activePolicy === tab.id 
                  ? 'bg-gold/10 text-maroon border-l-4 border-maroon' 
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Editor Area */}
        <div className="flex-1 space-y-4">
          <h3 className="text-xl font-heading text-maroon">
            {policyTabs.find(t => t.id === activePolicy)?.label}
          </h3>
          <div className="bg-white rounded-lg">
            <ReactQuill 
              theme="snow" 
              value={policies[activePolicy]} 
              onChange={handleEditorChange} 
              modules={modules}
              className="h-[400px] mb-12"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyCMS;
