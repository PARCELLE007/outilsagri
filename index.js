import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container); // Créez un root avec createRoot
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);