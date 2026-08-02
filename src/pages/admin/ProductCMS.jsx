import React, { useState, useEffect } from 'react';
import productsData from '../../data/products.json';
import MediaInput from '../../components/admin/MediaInput';
import { FaEdit, FaTrash, FaPlus, FaCopy } from 'react-icons/fa';

const ProductCMS = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const emptyForm = {
    id: '',
    name: '',
    category: 'Pure Silk Paithani',
    price: '',
    originalPrice: '',
    discount: '',
    description: '',
    fabric: 'Pure Silk',
    motif: '',
    stock: 5,
    sku: '',
    collection: '',
    bestSeller: false,
    newArrival: false,
    featuredProduct: false,
    images: ['', '', '', '', '', ''] // Main, Front, Back, Model, Border, Pallu
  };

  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    const localProds = localStorage.getItem('products');
    if (localProds) {
      setProducts(JSON.parse(localProds));
    } else {
      localStorage.setItem('products', JSON.stringify(productsData));
      setProducts(productsData);
    }
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    let updatedProducts = [...products];

    // Ensure images array has exactly 6 elements
    const formattedImages = [...formData.images];
    while(formattedImages.length < 6) formattedImages.push('');

    const productPayload = {
      ...formData,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
      stock: parseInt(formData.stock),
      images: formattedImages,
      image: formattedImages[0] || 'https://picsum.photos/seed/placeholder/500/700' // Fallback main image
    };

    if (editingProduct) {
      updatedProducts = updatedProducts.map(p => p.id === formData.id ? productPayload : p);
    } else {
      productPayload.id = `PROD_${Date.now()}`;
      productPayload.sku = productPayload.sku || `SKU-${Math.floor(Math.random() * 10000)}`;
      updatedProducts.unshift(productPayload);
    }

    localStorage.setItem('products', JSON.stringify(updatedProducts));
    setProducts(updatedProducts);
    setIsFormOpen(false);
    setEditingProduct(null);
    setFormData(emptyForm);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    const filledImages = [...(product.images || [product.image])];
    while (filledImages.length < 6) filledImages.push('');
    
    setFormData({
      ...emptyForm,
      ...product,
      images: filledImages
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this product permanently?')) {
      const updated = products.filter(p => p.id !== id);
      localStorage.setItem('products', JSON.stringify(updated));
      setProducts(updated);
    }
  };

  const handleDuplicate = (product) => {
    const duplicate = { ...product, id: `PROD_${Date.now()}`, name: `${product.name} (Copy)` };
    const updated = [duplicate, ...products];
    localStorage.setItem('products', JSON.stringify(updated));
    setProducts(updated);
  };

  const handleImageChange = (index, url) => {
    const newImages = [...formData.images];
    newImages[index] = url;
    setFormData({ ...formData, images: newImages });
  };

  const categories = ["Pure Silk Paithani", "Bridal Paithani", "Wedding Collection", "Heritage Collection", "Luxury Collection", "Paithani Dupattas"];
  const imageLabels = ["Main Image", "Front View", "Back View", "Model Wearing", "Border Close-up", "Pallu Close-up"];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="border-b border-gold/20 pb-4 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-heading text-maroon">Product CMS</h2>
          <p className="text-sm text-gray-500 font-light mt-1">Manage your entire inventory, pricing, and galleries.</p>
        </div>
        {!isFormOpen && (
          <button 
            onClick={() => { setFormData(emptyForm); setEditingProduct(null); setIsFormOpen(true); }}
            className="bg-maroon hover:bg-gold text-white font-semibold py-2 px-6 rounded-full transition flex items-center space-x-2"
          >
            <FaPlus size={12} />
            <span>Add New Product</span>
          </button>
        )}
      </div>

      {isFormOpen ? (
        <form onSubmit={handleSave} className="bg-white p-8 rounded-2xl shadow-premium border border-gold/10 space-y-8 relative">
          <div className="flex justify-between items-center border-b pb-4">
            <h3 className="text-xl font-heading text-maroon font-semibold">
              {editingProduct ? 'Edit Product: ' + formData.name : 'Create New Product'}
            </h3>
            <button type="button" onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-red-500">Cancel</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4 md:col-span-2 grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Product Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold outline-none" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Category</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold outline-none bg-white">
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">SKU</label>
                <input type="text" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold outline-none" placeholder="e.g. IND-001" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Sale Price (₹)</label>
                <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold outline-none" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Original Price (₹)</label>
                <input type="number" value={formData.originalPrice} onChange={e => setFormData({...formData, originalPrice: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold outline-none" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Stock</label>
                <input required type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold outline-none" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Fabric / Motif</label>
                <input type="text" value={formData.fabric} onChange={e => setFormData({...formData, fabric: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold outline-none" />
              </div>
              <div className="col-span-2">
                <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Description</label>
                <textarea rows="4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold outline-none"></textarea>
              </div>
            </div>

            {/* Tags/Toggles */}
            <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <h4 className="text-xs font-semibold uppercase text-gray-500 border-b pb-2">Visibility & Badges</h4>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" checked={formData.bestSeller} onChange={e => setFormData({...formData, bestSeller: e.target.checked})} className="w-4 h-4 text-maroon rounded focus:ring-gold" />
                <span className="text-sm font-medium text-gray-700">Best Seller</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" checked={formData.newArrival} onChange={e => setFormData({...formData, newArrival: e.target.checked})} className="w-4 h-4 text-maroon rounded focus:ring-gold" />
                <span className="text-sm font-medium text-gray-700">New Arrival</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" checked={formData.featuredProduct} onChange={e => setFormData({...formData, featuredProduct: e.target.checked})} className="w-4 h-4 text-maroon rounded focus:ring-gold" />
                <span className="text-sm font-medium text-gray-700">Featured on Homepage</span>
              </label>
            </div>
          </div>

          <div className="border-t pt-6">
            <h4 className="text-sm font-semibold uppercase text-gray-600 mb-4 tracking-widest">Product Gallery (Drag & Drop Supported)</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {imageLabels.map((label, idx) => (
                <MediaInput 
                  key={idx}
                  label={label}
                  value={formData.images[idx]}
                  onChange={(url) => handleImageChange(idx, url)}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t">
            <button type="button" onClick={() => setIsFormOpen(false)} className="px-6 py-2 border border-gray-300 rounded-full hover:bg-gray-50 font-medium">Cancel</button>
            <button type="submit" className="px-8 py-2 bg-maroon text-white rounded-full hover:bg-gold font-medium shadow-md transition">Save Product</button>
          </div>
        </form>
      ) : (
        <div className="bg-white rounded-2xl shadow-premium border border-gold/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold text-xs uppercase tracking-wider">
                  <th className="py-3 px-6">Product</th>
                  <th className="py-3 px-6">Category</th>
                  <th className="py-3 px-6">Price</th>
                  <th className="py-3 px-6">Stock</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-cream/10 transition group">
                    <td className="py-4 px-6 flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-lg border overflow-hidden bg-gray-50 flex-shrink-0">
                        <img src={p.images?.[0] || p.image} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-semibold text-maroon">{p.name}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{p.sku}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{p.category}</td>
                    <td className="py-4 px-6 font-medium">₹{p.price.toLocaleString('en-IN')}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${p.stock > 5 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {p.stock} IN STOCK
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(p)} className="text-gray-400 hover:text-gold transition" title="Edit"><FaEdit size={16}/></button>
                      <button onClick={() => handleDuplicate(p)} className="text-gray-400 hover:text-blue-500 transition" title="Duplicate"><FaCopy size={16}/></button>
                      <button onClick={() => handleDelete(p.id)} className="text-gray-400 hover:text-red-600 transition" title="Delete"><FaTrash size={16}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCMS;
