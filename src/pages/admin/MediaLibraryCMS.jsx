import React, { useEffect, useState } from 'react';
import MediaService from '../../services/MediaService';
import { FaTrash, FaCopy, FaCheck, FaImage } from 'react-icons/fa';

const MediaLibraryCMS = () => {
  const [media, setMedia] = useState([]);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    try {
      const data = await MediaService.getAllMedia();
      setMedia(data);
    } catch (error) {
      console.error('Failed to load media', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this image permanently? This might break pages where it is used.')) {
      await MediaService.deleteMedia(id);
      loadMedia();
    }
  };

  const handleCopy = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-end border-b border-gold/20 pb-4">
        <div>
          <h2 className="text-3xl font-heading text-maroon">Media Library</h2>
          <p className="text-sm text-gray-500 font-light mt-1">Manage all uploaded images across your website</p>
        </div>
      </div>

      {media.length === 0 ? (
        <div className="bg-white p-16 flex flex-col items-center text-center rounded-2xl shadow-premium border border-gold/10 text-gray-400">
          <FaImage size={48} className="mb-4 text-gray-200" />
          <h3 className="text-lg font-heading text-maroon mb-2">Your library is empty</h3>
          <p className="text-sm">Upload images directly through the CMS editors to populate your media library.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {media.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group">
              <div className="aspect-square bg-gray-50 relative">
                <img src={item.url} alt={item.name} className="w-full h-full object-contain" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center space-x-3">
                  <button onClick={() => handleCopy(item.url, item.id)} className="bg-white p-3 rounded-full text-black hover:bg-gold transition shadow-lg" title="Copy Internal URL">
                    {copiedId === item.id ? <FaCheck className="text-green-600" /> : <FaCopy />}
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="bg-red-500 p-3 rounded-full text-white hover:bg-red-600 transition shadow-lg" title="Delete Forever">
                    <FaTrash />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs font-semibold text-gray-700 truncate" title={item.name}>{item.name}</p>
                <div className="flex justify-between text-[10px] text-gray-400 mt-2 uppercase tracking-wider">
                  <span>{(item.size / 1024).toFixed(1)} KB</span>
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaLibraryCMS;
