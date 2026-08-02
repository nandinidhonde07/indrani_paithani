import React, { useState, useRef } from 'react';
import { FaUpload, FaTrash, FaImage } from 'react-icons/fa';
import MediaService from '../../services/MediaService';

const MediaInput = ({ value, onChange, label, className = '' }) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const media = await MediaService.uploadFile(file);
      onChange(media.url);
    } catch (error) {
      alert('Upload failed: ' + error.message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const media = await MediaService.uploadFile(file);
      onChange(media.url);
    } catch (error) {
      alert('Upload failed: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="block text-[10px] text-gray-500 font-semibold uppercase tracking-wider">{label}</label>}
      
      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-video bg-gray-50 flex items-center justify-center">
          <img src={value} alt="Preview" className="max-w-full max-h-full object-contain" />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center space-x-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-white text-black p-3 rounded-full hover:bg-gold transition shadow-lg"
              title="Replace Image"
            >
              <FaUpload size={14} />
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition shadow-lg"
              title="Remove Image"
            >
              <FaTrash size={14} />
            </button>
          </div>
        </div>
      ) : (
        <div 
          className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-gray-400 hover:border-gold hover:bg-gold/5 transition duration-300 cursor-pointer h-full min-h-[140px]"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          {isUploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-maroon mb-2"></div>
              <span className="text-xs">Processing...</span>
            </div>
          ) : (
            <>
              <FaImage size={28} className="mb-3 text-gray-300" />
              <p className="text-sm text-center font-medium text-gray-600">Click or drag image here</p>
              <p className="text-[10px] text-center mt-1 uppercase tracking-widest">PNG, JPG, WEBP</p>
            </>
          )}
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};

export default MediaInput;
