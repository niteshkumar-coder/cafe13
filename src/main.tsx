import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Patch for "Cannot set property fetch of #<Window> which has only a getter"
// This error is common in some environments when libraries try to polyfill fetch.
window.addEventListener('error', (event) => {
  if (event.message && event.message.includes('Cannot set property fetch')) {
    event.preventDefault();
    console.warn('Caught and ignored fetch property assignment error');
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
