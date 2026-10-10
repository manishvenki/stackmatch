import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { NetworkStatusProvider } from './context/NetworkStatusContext';
import { GlobalErrorProvider } from './context/GlobalErrorContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <NetworkStatusProvider>
        <GlobalErrorProvider>
          <App />
        </GlobalErrorProvider>
      </NetworkStatusProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
