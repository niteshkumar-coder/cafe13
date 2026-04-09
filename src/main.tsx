// Patch for "Cannot set property fetch of #<Window> which has only a getter"
// This error happens when libraries try to overwrite window.fetch in restricted environments.
try {
  const originalFetch = window.fetch;
  Object.defineProperty(window, 'fetch', {
    value: originalFetch,
    writable: true,
    configurable: true,
    enumerable: true
  });
  console.log('Successfully patched window.fetch to be writable');
} catch (e) {
  console.warn('Could not patch window.fetch:', e);
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
