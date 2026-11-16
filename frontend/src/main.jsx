import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
// BrowserRouter wraps the whole app so React Router can read the URL

// Global styles
import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import './styles/badges.css';
import './styles/layout.css';
import './styles/pages.css';

import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
