import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Adjusted path if App.tsx is in src/
import { HashRouter } from 'react-router-dom'; // Keep HashRouter if preferred for static hosting

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
