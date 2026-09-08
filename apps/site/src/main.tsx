import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary, ThemeProvider } from '@thewhileloop/whileui/web';
import './styles.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>
);
