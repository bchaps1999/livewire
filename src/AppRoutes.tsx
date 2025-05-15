import React from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import NewsFeed from './components/NewsFeed';
import NotFound from './components/NotFound';

// CategoryNews component wrapper that uses URL parameters
const CategoryNewsWrapper: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  return <NewsFeed categorySlug={categorySlug} />;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<NewsFeed />} />
      <Route path="/breaking" element={<NewsFeed specialView="breaking-news" />} />
      <Route path="/category/:categorySlug" element={<CategoryNewsWrapper />} />
      <Route path="/annotated" element={<NewsFeed specialView="annotated" />} /> 
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
