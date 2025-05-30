import React, { useState, useEffect, useMemo } from 'react';
// import { Link } from 'react-router-dom'; // Link might not be used if no article detail page
import { Article } from '../types';
import { getArticles } from '../services/contentService';
import LoadingSpinner from '../components/LoadingSpinner';
import SearchBar from '../components/SearchBar'; // Re-use SearchBar for articles too
import Pagination from '../components/Pagination';
import { ITEMS_PER_PAGE } from '../constants';

const ArticleCard: React.FC<{ article: Article }> = ({ article }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-shadow hover:shadow-xl">
      <div className="p-6">
         <span className="inline-block bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full uppercase font-semibold tracking-wide">
          {article.category || 'ทั่วไป'}
        </span>
        <h3 className="mt-2 text-xl font-semibold text-gray-800 hover:text-blue-600 transition-colors">
            {article.title}
        </h3>
        <p className="mt-2 text-gray-600 text-sm h-24 overflow-hidden text-ellipsis">
          {article.excerpt}
        </p>
        <div className="mt-4 text-xs text-gray-500">
          เผยแพร่: {new Date(article.published_date).toLocaleDateString('th-TH')}
        </div>
      </div>
    </div>
  );
};


const ArticlesPage: React.FC = () => {
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadArticles = async () => {
      setIsLoading(true);
      try {
        const data = await getArticles();
        setAllArticles(data);
        setFilteredArticles(data);
      } catch (err) {
        setError('เกิดข้อผิดพลาดในการโหลดบทความ');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadArticles();
  }, []);

  const handleSearch = (searchTerm: string, category: string, tag: string) => {
    setCurrentPage(1);
    let result = allArticles;
    if (searchTerm) {
      result = result.filter(article => 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (article.excerpt && article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    // TODO: Implement category and tag filtering for articles if MOCK_CATEGORIES/TAGS are applicable or new ones are defined
    console.log('Search for articles:', searchTerm, category, tag);
    setFilteredArticles(result);
  };
  
  const paginatedArticles = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredArticles.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredArticles, currentPage]);

  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);


  if (isLoading) return <LoadingSpinner />;
  if (error) return <p className="text-center text-red-500 text-xl">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">บทความและเทคโนโลยีการเกษตร</h1>
      <p className="text-center text-gray-600 mb-8">แหล่งรวมความรู้ ข่าวสาร และนวัตกรรมใหม่ๆ เพื่อเกษตรกรไทย</p>
      
      <SearchBar onSearch={handleSearch} /> {/* Categories/Tags for articles might be different */}

      {paginatedArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedArticles.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 text-xl py-10">ไม่พบบทความที่ตรงกับการค้นหาของคุณ</p>
      )}

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default ArticlesPage;
