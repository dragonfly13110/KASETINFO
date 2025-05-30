
import React, { useState } from 'react';
import { Category, Tag } from '../types';
import { MOCK_CATEGORIES, MOCK_TAGS } from '../constants'; // Using mock data for now

interface SearchBarProps {
  onSearch: (searchTerm: string, category: string, tag: string) => void;
  categories?: Category[]; // Optional: pass actual categories from CMS
  tags?: Tag[]; // Optional: pass actual tags from CMS
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  categories = MOCK_CATEGORIES, 
  tags = MOCK_TAGS 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm, selectedCategory, selectedTag);
  };

  return (
    <form onSubmit={handleSearch} className="bg-white p-6 rounded-lg shadow-md mb-8 space-y-4 md:space-y-0 md:flex md:space-x-4 md:items-end">
      <div className="flex-grow">
        <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700 mb-1">ค้นหา</label>
        <input
          type="text"
          id="searchTerm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="ชื่อเรื่อง, คำสำคัญ..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
        />
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">หมวดหมู่</label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 bg-white"
        >
          <option value="">ทั้งหมด</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="tag" className="block text-sm font-medium text-gray-700 mb-1">แท็ก</label>
        <select
          id="tag"
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 bg-white"
        >
          <option value="">ทั้งหมด</option>
          {tags.map(tag => (
            <option key={tag.id} value={tag.id}>{tag.name}</option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="w-full md:w-auto bg-green-600 text-white px-6 py-2 rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
      >
        ค้นหา
      </button>
    </form>
  );
};

export default SearchBar;
    