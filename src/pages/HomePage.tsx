import React, { useState, useEffect, useMemo } from 'react';
import InfographicCard from '../components/InfographicCard';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';
import { Infographic } from '../types';
import { getInfographics } from '../services/contentService';
import { ITEMS_PER_PAGE, MOCK_CATEGORIES, MOCK_TAGS } from '../constants';

const HomePage: React.FC = () => {
  const [allInfographics, setAllInfographics] = useState<Infographic[]>([]);
  const [filteredInfographics, setFilteredInfographics] = useState<Infographic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadInfographics = async () => {
      setIsLoading(true);
      try {
        const data = await getInfographics();
        setAllInfographics(data);
        setFilteredInfographics(data); // Initially show all
      } catch (err) {
        setError('เกิดข้อผิดพลาดในการโหลดข้อมูลอินโฟกราฟิก');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadInfographics();
  }, []);

  const handleSearch = (searchTerm: string, category: string, tag: string) => {
    setCurrentPage(1); // Reset to first page on new search
    let result = allInfographics;

    if (searchTerm) {
      result = result.filter(info => 
        info.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (info.summary && info.summary.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    if (category) {
      const categoryName = MOCK_CATEGORIES.find(c => c.id === category)?.name;
      if (categoryName) {
         result = result.filter(info => info.category === categoryName);
      }
    }
    if (tag) {
      const tagName = MOCK_TAGS.find(t => t.id === tag)?.name;
       if (tagName) {
        result = result.filter(info => info.tags.includes(tagName));
      }
    }
    setFilteredInfographics(result);
  };

  const paginatedInfographics = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredInfographics.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredInfographics, currentPage]);

  const totalPages = Math.ceil(filteredInfographics.length / ITEMS_PER_PAGE);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <p className="text-center text-red-500 text-xl">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">อินโฟกราฟิกเกษตรล่าสุด</h1>
      <p className="text-center text-gray-600 mb-8">ค้นหาและเรียนรู้เทคนิคการเกษตรผ่านอินโฟกราฟิกที่เข้าใจง่าย</p>
      
      <SearchBar onSearch={handleSearch} />

      {paginatedInfographics.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedInfographics.map(infographic => (
            <InfographicCard key={infographic.id} infographic={infographic} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 text-xl py-10">ไม่พบอินโฟกราฟิกที่ตรงกับการค้นหาของคุณ</p>
      )}
      
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default HomePage;
