import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Add Font Awesome
const fontAwesomeCDN = document.createElement('link');
fontAwesomeCDN.rel = 'stylesheet';
fontAwesomeCDN.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
document.head.appendChild(fontAwesomeCDN);

// Add Google Fonts
const googleFonts = document.createElement('link');
googleFonts.rel = 'stylesheet';
googleFonts.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
document.head.appendChild(googleFonts);

// Add Tailwind CSS
const tailwindCSS = document.createElement('script');
tailwindCSS.src = 'https://cdn.tailwindcss.com';
document.head.appendChild(tailwindCSS);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
