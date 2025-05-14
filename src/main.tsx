import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// Change to import the main CSS file
import './styles/main.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
