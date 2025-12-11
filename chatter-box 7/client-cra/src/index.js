/**
 * Application Entry Point
 * Initializes React app with routing and authentication context
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import './index.css';
import reportWebVitals from './reportWebVitals';

const rootElement = document.getElementById('root');
const appRoot = ReactDOM.createRoot(rootElement);

appRoot.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
