import React from 'react';
import { APP_TITLE } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white text-center p-6">
      <p>&copy; {new Date().getFullYear()} {APP_TITLE}. สงวนลิขสิทธิ์</p>
      <p className="text-sm text-gray-400 mt-1">พัฒนาโดยทีมงานผู้เชี่ยวชาญ</p>
    </footer>
  );
};

export default Footer;
