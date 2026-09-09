import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import useAppStore from '../../store/useAppStore';
import { FaGripVertical, FaEye, FaEyeSlash } from 'react-icons/fa';

const HomepageCMS = () => {
  const { cmsContent, updateCMSSection } = useAppStore();
  const homeData = cmsContent?.home;
  
  const [sections, setSections] = useState([]);
  const [heroForm, setHeroForm] = useState({
    heroImage: '',
    heroBadge: '',
    heroLabel: '',
    heroTitle: '',
    heroSubtitle: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (homeData) {
      if (homeData.sectionOrder) setSections(homeData.sectionOrder);
      setHeroForm({
        heroImage: homeData.heroImage || '',
        heroBadge: homeData.heroBadge || '',
        heroLabel: homeData.heroLabel || '',
        heroTitle: homeData.heroTitle || '',
        heroSubtitle: homeData.heroSubtitle || ''
      });
    }
  }, [homeData]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setSections(items);
    updateCMSSection('home', { sectionOrder: items });
  };

  const toggleVisibility = (id) => {
    const updated = sections.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s);
    setSections(updated);
    updateCMSSection('home', { sectionOrder: updated });
  };

  const handleHeroChange = (field, value) => {
    setHeroForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveHero = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    await updateCMSSection('home', { ...homeData, ...heroForm });
    setIsSaving(false);
    alert('Hero section updated successfully!');
  };

  if (!homeData) return <div>Loading...</div>;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="border-b border-gold/20 pb-4 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-heading text-maroon">Homepage CMS</h2>
          <p className="text-sm text-gray-500 font-light mt-1">Manage the hero content and section order.</p>
        </div>
      </div>

      {/* Hero Content Editor */}
      <form onSubmit={handleSaveHero} className="bg-white p-6 rounded-2xl shadow-premium border border-gold/10 space-y-6">
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h3 className="text-xl font-heading text-maroon">Hero Content</h3>
          <button 
            type="submit" 
            disabled={isSaving}
            className="bg-maroon hover:bg-gold text-white font-semibold py-2 px-6 rounded-full transition shadow-sm text-sm"
          >
            {isSaving ? 'Saving...' : 'Save Hero'}
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Hero Image URL</label>
            <input
              type="text"
              value={heroForm.heroImage}
              onChange={(e) => handleHeroChange('heroImage', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Luxury Badge (Left | Right)</label>
            <input
              type="text"
              value={heroForm.heroBadge}
              onChange={(e) => handleHeroChange('heroBadge', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold outline-none"
              placeholder="e.g. 64+ Years | Yeola Paithani"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Small Label</label>
            <input
              type="text"
              value={heroForm.heroLabel}
              onChange={(e) => handleHeroChange('heroLabel', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Main Heading</label>
            <textarea
              rows="2"
              value={heroForm.heroTitle}
              onChange={(e) => handleHeroChange('heroTitle', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold outline-none font-heading"
            ></textarea>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Description Subtitle</label>
            <textarea
              rows="3"
              value={heroForm.heroSubtitle}
              onChange={(e) => handleHeroChange('heroSubtitle', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold outline-none"
            ></textarea>
          </div>
        </div>
      </form>

      {/* Drag & Drop Reorder */}
      <div className="bg-white p-6 rounded-2xl shadow-premium border border-gold/10">
        <h3 className="text-xl font-heading text-maroon mb-6 border-b pb-4">Section Reordering</h3>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="homepage-sections">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                {sections.map((section, index) => (
                  <Draggable key={section.id} draggableId={section.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`flex items-center justify-between p-4 border rounded-xl bg-white ${snapshot.isDragging ? 'shadow-lg border-gold' : ''} ${
                          section.enabled ? 'border-gray-200 shadow-sm' : 'border-gray-100 opacity-50 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div {...provided.dragHandleProps} className="cursor-grab text-gray-400 hover:text-gold transition">
                            <FaGripVertical />
                          </div>
                          <span className={`font-medium ${section.enabled ? 'text-maroon' : 'text-gray-400'}`}>
                            {section.name}
                          </span>
                        </div>
                        <button
                          onClick={() => toggleVisibility(section.id)}
                          className={`p-2 rounded-full transition ${section.enabled ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-200'}`}
                          title={section.enabled ? 'Disable Section' : 'Enable Section'}
                        >
                          {section.enabled ? <FaEye size={18} /> : <FaEyeSlash size={18} />}
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

export default HomepageCMS;
