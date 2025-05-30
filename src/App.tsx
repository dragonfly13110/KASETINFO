import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import InfographicDetailPage from './pages/InfographicDetailPage';
import ArticlesPage from './pages/ArticlesPage';

const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/infographic/:id" element={<InfographicDetailPage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          {/* Admin route is handled by public/admin/index.html, not React Router */}
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
