import React from 'react';
import { useParams } from 'react-router-dom';
import NewsFeed from './NewsFeed';

const CategoryNews: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  
  if (!categorySlug) {
    return <div>Category not found</div>;
  }

  return <NewsFeed categorySlug={categorySlug} />;
};

export default CategoryNews;
