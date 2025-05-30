
import React from 'react';
import { Link } from 'react-router-dom';
import { APP_TITLE } from '../constants';

const Header: React.FC = () => {
  return (
    <header className="bg-green-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center">
        <Link to="/" className="text-2xl font-bold hover:text-green-200 transition-colors">
          🌾 {APP_TITLE}
        </Link>
        <nav className="mt-4 sm:mt-0 space-x-2 sm:space-x-4">
          <Link to="/" className="px-3 py-2 rounded hover:bg-green-600 transition-colors">หน้าหลัก</Link>
          <Link to="/articles" className="px-3 py-2 rounded hover:bg-green-600 transition-colors">บทความ</Link>
          <a href="/admin/" target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded hover:bg-green-600 transition-colors">ส่วนจัดการ (Admin)</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
    