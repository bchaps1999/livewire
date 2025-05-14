import React from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import NewsFeed from './components/NewsFeed';
import SavedEvents from './components/SavedEvents';
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
      <Route path="/category/:categorySlug" element={<CategoryNewsWrapper />} />
      <Route path="/saved" element={<SavedEvents />} />
      <Route path="/annotated" element={<NewsFeed specialView="annotated" />} /> 
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
