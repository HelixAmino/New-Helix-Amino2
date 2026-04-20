import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import emailjs from '@emailjs/browser';
import App from './App.tsx';
import './index.css';

const emailjsKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined;
if (emailjsKey) {
  emailjs.init({ publicKey: emailjsKey });
  console.log('[emailjs] initialized');
} else {
  console.warn('[emailjs] VITE_EMAILJS_PUBLIC_KEY is not set — backup email will fail');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
