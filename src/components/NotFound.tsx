import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center bg-paper-50 dark:bg-ink-900">
      <div className="bg-paper-100 dark:bg-ink-800 p-8 rounded-sm border border-paper-300 dark:border-ink-700">
        <h2 className="text-3xl font-display font-bold text-ink-900 dark:text-paper-50 mb-4">404 - Page Not Found</h2>
        <p className="text-ink-600 dark:text-paper-400 mb-8 font-serif">The page you are looking for doesn't exist or has been moved.</p>
        <Link 
          to="/" 
          className="px-4 py-2.5 rounded-sm text-sm font-medium text-paper-50 bg-accent-blue hover:bg-accent-blue/90 focus:outline-none"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
