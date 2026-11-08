import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
// frontend routing

// styles
// import './styles/tokens.css';
// import './styles/base.css';
// import './styles/components.css';
// import './styles/badges.css';
// import './styles/layout.css';
// import './styles/pages.css';


// need auth for frontend but leaving it for now 

// import { ToastProvider } from './components/Toast.jsx';
// notification provider.

import App from './App.jsx';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
