// src/main.jsx
import React from 'react'; // ✅ Needed for JSX like <AuthProvider>
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext.jsx'; // ✅ Consistent extension

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);
