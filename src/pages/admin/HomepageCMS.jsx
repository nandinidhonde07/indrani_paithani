import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import useAppStore from '../../store/useAppStore';
import { FaGripVertical, FaEye, FaEyeSlash } from 'react-icons/fa';

const HomepageCMS = () => {
  const { cmsContent, updateCMSSection } = useAppStore();
  const homeData = cmsContent?.home;
  
  const [sections, setSections] = useState([]);

  useEffect(() => {
    if (homeData?.sectionOrder) {
      setSections(homeData.sectionOrder);
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

  if (!homeData) return <div>Loading...</div>;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="border-b border-gold/20 pb-4">
        <h2 className="text-3xl font-heading text-maroon">Homepage Layout CMS</h2>
        <p className="text-sm text-gray-500 font-light mt-1">Drag and drop to reorder sections. Toggle visibility.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-premium border border-gold/10">
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
