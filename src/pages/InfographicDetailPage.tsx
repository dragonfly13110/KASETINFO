import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Infographic } from '../types';
import { getInfographicById } from '../services/contentService';
import LoadingSpinner from '../components/LoadingSpinner';

const InfographicDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [infographic, setInfographic] = useState<Infographic | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const loadInfographicDetail = async () => {
        setIsLoading(true);
        try {
          const decodedId = decodeURIComponent(id);
          const data = await getInfographicById(decodedId);
          if (data) {
            setInfographic(data);
          } else {
            setError('ไม่พบข้อมูลอินโฟกราฟิกนี้');
          }
        } catch (err) {
          setError('เกิดข้อผิดพลาดในการโหลดรายละเอียดอินโฟกราฟิก');
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      loadInfographicDetail();
    } else {
      setError('ไม่พบรหัสอินโฟกราฟิก');
      setIsLoading(false);
    }
  }, [id]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <p className="text-center text-red-500 text-xl">{error} <Link to="/" className="text-green-600 hover:underline">กลับหน้าหลัก</Link></p>;
  if (!infographic) return <p className="text-center text-gray-500 text-xl">ไม่พบข้อมูลอินโฟกราฟิก</p>;

  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl max-w-4xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">{infographic.title}</h1>
      
      <div className="mb-6">
        <img 
          src={infographic.image || `https://picsum.photos/seed/${infographic.id}/800/600`} 
          alt={infographic.title} 
          className="w-full max-h-[70vh] object-contain rounded-md shadow-md"
        />
      </div>

      <div className="mb-6 prose prose-lg max-w-none">
        <h2 className="text-2xl font-semibold text-gray-700 mb-3">สรุปเนื้อหา</h2>
        <p className="text-gray-700 leading-relaxed">{infographic.summary || 'ไม่มีข้อมูลสรุป'}</p>
      </div>

      {infographic.full_text_from_ocr && (
        <div className="mb-6 p-4 bg-gray-50 rounded-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">ข้อความจากภาพ (OCR)</h3>
          <p className="text-gray-600 text-sm whitespace-pre-wrap">{infographic.full_text_from_ocr}</p>
        </div>
      )}

      <div className="flex flex-wrap items-center text-sm text-gray-600 mb-6">
        <div className="mr-6 mb-2">
          <span className="font-semibold">หมวดหมู่:</span> 
          <span className="ml-1 px-3 py-1 bg-green-100 text-green-700 rounded-full">{infographic.category}</span>
        </div>
        <div className="mb-2">
          <span className="font-semibold">แท็ก:</span>
          {infographic.tags.map(tag => (
            <span key={tag} className="ml-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full">{tag}</span>
          ))}
        </div>
      </div>

      <p className="text-sm text-gray-500">เผยแพร่เมื่อ: {new Date(infographic.published_date).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

      <div className="mt-8 text-center">
        <Link 
          to="/" 
          className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          &larr; กลับไปหน้าหลัก
        </Link>
      </div>
    </div>
  );
};

export default InfographicDetailPage;
