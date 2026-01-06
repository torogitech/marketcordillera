
import React, { useState } from 'react';
import { Product, Category } from '../types';
import { Search, Plus, Filter } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (id: string) => void;
  onAddToCart: (product: Product) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  categories, 
  activeCategory, 
  onCategoryChange,
  onAddToCart
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex-1 bg-gray-50 p-4 lg:p-6 lg:ml-64 min-h-screen">
      {/* Header Mobile - Now handled by App.tsx main layout */}
      <div className="lg:hidden mb-6 mt-4">
        <h1 className="text-2xl font-bold text-gray-900">Menu</h1>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu</h1>
          <p className="text-sm text-gray-500 mt-1">Dashboard • <span className="text-gray-900 font-medium">Menu</span></p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg shadow-lg shadow-orange-200 transition-all text-sm font-medium flex items-center">
            <Plus size={16} className="mr-2" /> New
          </button>
          <button className="bg-white border border-gray-200 text-gray-600 px-4 py-2.5 rounded-lg hover:bg-gray-50 text-sm font-medium transition-all">
            QR Menu Orders
          </button>
          <button className="bg-white border border-gray-200 text-gray-600 px-4 py-2.5 rounded-lg hover:bg-gray-50 text-sm font-medium transition-all">
            Draft List
          </button>
        </div>
      </div>

      {/* Controls & Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search in products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all text-sm"
            />
          </div>
          <div className="flex gap-3">
            <select className="flex-1 md:flex-none px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none focus:border-orange-500 cursor-pointer min-w-[120px]">
              <option>All Category</option>
              <option>Dine In</option>
            </select>
            <select className="flex-1 md:flex-none px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none focus:border-orange-500 cursor-pointer min-w-[120px]">
              <option>Select Brand</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`px-5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                activeCategory === cat.id 
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-200' 
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pb-20 lg:pb-0">
        {filteredProducts.map((product) => (
          <div 
            key={product.id} 
            className="group bg-white rounded-2xl p-4 border border-transparent hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300 cursor-pointer relative overflow-hidden"
            onClick={() => onAddToCart(product)}
          >
            <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-gray-100 relative">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <button className="absolute bottom-2 right-2 bg-orange-500 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                <Plus size={16} />
              </button>
            </div>
            <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-1">{product.name}</h3>
            <div className="flex justify-between items-center">
              <span className="text-orange-600 font-bold text-lg">₱{product.price.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
