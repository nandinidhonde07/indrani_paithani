import React from 'react';
import { FiRotateCcw, FiFilter } from 'react-icons/fi';

const SidebarFilter = ({
  selectedVariety = [],
  setSelectedVariety,
  selectedColor = '',
  setSelectedColor,
  maxPrice = 400000,
  setMaxPrice,
  selectedMotif = '',
  setSelectedMotif,
  sortBy = 'popularity',
  setSortBy,
  onResetFilters
}) => {

  const varieties = [
    { id: 'pure-silk', label: 'Pure Silk', query: 'Pure Silk' },
    { id: 'yeola-paithani', label: 'Yeola Paithani', query: 'Yeola' },
    { id: 'semi-paithani', label: 'Semi-Paithani', query: 'Semi' },
    { id: 'maharani', label: 'Maharani', query: 'Maharani' }
  ];

  const colorSwatches = [
    { name: 'All', hex: 'conic-gradient(from 180deg, red, yellow, green, blue, purple, red)', border: '#ccc' },
    { name: 'Red-Orange', hex: '#C0392B' },
    { name: 'Saffron Orange', hex: '#E67E22' },
    { name: 'Purple', hex: '#8E44AD' },
    { name: 'Pink', hex: '#E84393' },
    { name: 'Multicolor', hex: 'linear-gradient(45deg, #e74c3c, #f1c40f, #2ecc71, #3498db)' },
    { name: 'Cream', hex: '#FFFDD0', border: '#ccc' },
    { name: 'Gold', hex: '#D4AF37' }
  ];

  const handleVarietyToggle = (varName) => {
    if (selectedVariety.includes(varName)) {
      setSelectedVariety(selectedVariety.filter(v => v !== varName));
    } else {
      setSelectedVariety([...selectedVariety, varName]);
    }
  };

  return (
    <aside className="bg-white p-6 rounded-2xl shadow-premium border border-gold/20 space-y-6 text-black">
      <div className="flex justify-between items-center border-b border-gold/20 pb-3">
        <h2 className="text-xl font-heading text-maroon font-bold flex items-center space-x-2">
          <FiFilter className="text-gold" />
          <span>Filter Boutique</span>
        </h2>
        <button
          onClick={onResetFilters}
          className="text-[11px] text-maroon hover:text-gold font-semibold flex items-center space-x-1 transition"
          title="Reset all filters"
        >
          <FiRotateCcw size={12} />
          <span>Reset</span>
        </button>
      </div>

      {/* 1. Variety Selection (Checkboxes) */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
          Saree Variety
        </label>
        <div className="space-y-2">
          {varieties.map((v) => {
            const isChecked = selectedVariety.includes(v.query);
            return (
              <label 
                key={v.id} 
                className="flex items-center space-x-3 cursor-pointer group text-xs text-gray-700 font-medium hover:text-maroon transition"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleVarietyToggle(v.query)}
                  className="rounded border-gray-300 text-maroon focus:ring-gold accent-maroon w-4 h-4"
                />
                <span className={isChecked ? 'font-bold text-maroon' : ''}>{v.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 2. Color Palette Swatches */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
            Color Palette
          </label>
          {selectedColor && (
            <span className="text-[10px] text-maroon font-semibold">{selectedColor}</span>
          )}
        </div>
        <div className="flex flex-wrap gap-2.5 pt-1">
          {colorSwatches.map((color) => {
            const isSelected = (color.name === 'All' && selectedColor === '') || selectedColor === color.name;
            return (
              <button
                key={color.name}
                type="button"
                onClick={() => setSelectedColor(color.name === 'All' ? '' : color.name)}
                title={color.name}
                className={`w-7 h-7 rounded-full transition-transform duration-200 relative flex items-center justify-center border-2 ${
                  isSelected ? 'scale-110 border-maroon shadow-md ring-2 ring-gold/50' : 'border-transparent hover:scale-105'
                }`}
                style={{
                  background: color.hex,
                  borderColor: color.border || (isSelected ? '#800020' : 'transparent')
                }}
              >
                {isSelected && (
                  <span className={`text-[10px] font-bold ${color.name === 'Cream' ? 'text-black' : 'text-white'}`}>
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Price Range Slider */}
      <div className="space-y-2 border-t border-gold/10 pt-4">
        <div className="flex justify-between items-center text-xs font-semibold">
          <span className="text-gray-700 uppercase tracking-wider">Max Budget</span>
          <span className="text-maroon font-bold">₹{maxPrice.toLocaleString('en-IN')}</span>
        </div>
        <input
          type="range"
          min="10000"
          max="400000"
          step="5000"
          value={maxPrice}
          onChange={(e) => setMaxPrice(parseInt(e.target.value))}
          className="w-full accent-maroon cursor-pointer h-2 bg-gray-200 rounded-lg"
        />
        <div className="flex justify-between text-[10px] text-gray-400">
          <span>₹10,000</span>
          <span>₹4,00,000</span>
        </div>
      </div>

      {/* 4. Motif Pattern Filter */}
      <div className="space-y-2 border-t border-gold/10 pt-4">
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
          Motif Weave Pattern
        </label>
        <select
          value={selectedMotif}
          onChange={(e) => setSelectedMotif(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-gold bg-cream/10"
        >
          <option value="">All Motifs</option>
          <option value="Parrot / Bird">Parrot / Bird</option>
          <option value="Peacock / Parrot">Peacock / Parrot</option>
          <option value="Swan / Lotus">Swan / Lotus</option>
          <option value="Peacock">Peacock</option>
        </select>
      </div>

      {/* 5. Sort Options */}
      <div className="space-y-2 border-t border-gold/10 pt-4">
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
          Sort By
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-gold bg-cream/10"
        >
          <option value="popularity">Popularity</option>
          <option value="newest">Newest Arrivals</option>
          <option value="best-selling">Best Selling (Rating)</option>
          <option value="low-to-high">Price: Low to High</option>
          <option value="high-to-low">Price: High to Low</option>
        </select>
      </div>

      {/* Reset Button */}
      <button
        onClick={onResetFilters}
        className="w-full bg-cream text-maroon border border-gold/30 text-xs py-2.5 rounded-xl font-bold hover:bg-maroon hover:text-white transition shadow-sm"
      >
        Reset All Filters
      </button>
    </aside>
  );
};

export default SidebarFilter;
