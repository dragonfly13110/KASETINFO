
import React from 'react';
import { Link } from 'react-router-dom';
import { Infographic } from '../types';

interface InfographicCardProps {
  infographic: Infographic;
}

const InfographicCard: React.FC<InfographicCardProps> = ({ infographic }) => {
  const detailUrl = infographic.contentPath 
    ? `/infographic/${encodeURIComponent(infographic.contentPath)}` 
    : `/infographic/${infographic.id}`;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
      <Link to={detailUrl}>
        <img 
          src={infographic.image || `https://picsum.photos/seed/${infographic.id}/400/300`} 
          alt={infographic.title} 
          className="w-full h-48 object-cover" 
        />
      </Link>
      <div className="p-6">
        <span className="inline-block bg-green-200 text-green-800 text-xs px-2 py-1 rounded-full uppercase font-semibold tracking-wide">
          {infographic.category || 'ทั่วไป'}
        </span>
        <h3 className="mt-2 text-xl font-semibold text-gray-800 truncate" title={infographic.title}>
          <Link to={detailUrl} className="hover:text-green-600 transition-colors">
            {infographic.title}
          </Link>
        </h3>
        <p className="mt-2 text-gray-600 text-sm h-20 overflow-hidden text-ellipsis">
          {infographic.summary || 'ไม่มีข้อมูลสรุป'}
        </p>
        <div className="mt-4">
          <Link 
            to={detailUrl}
            className="text-green-600 hover:text-green-800 font-semibold text-sm transition-colors"
          >
            ดูรายละเอียด &rarr;
          </Link>
        </div>
        <div className="mt-3 text-xs text-gray-500">
          เผยแพร่: {new Date(infographic.published_date).toLocaleDateString('th-TH')}
        </div>
      </div>
    </div>
  );
};

export default InfographicCard;
    