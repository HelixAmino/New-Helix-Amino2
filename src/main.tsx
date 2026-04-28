import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

(() => {
  const randomUUID = () => {
    const bytes = new Uint8Array(16);
    if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
      crypto.getRandomValues(bytes);
    } else {
      for (let i = 0; i < 16; i++) bytes[i] = Math.floor(Math.random() * 256);
    }
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}` as `${string}-${string}-${string}-${string}-${string}`;
  };

  if (typeof globalThis.crypto === 'undefined') {
    (globalThis as { crypto: Crypto }).crypto = { randomUUID } as unknown as Crypto;
    return;
  }

  if (typeof globalThis.crypto.randomUUID === 'function') return;

  try {
    Object.defineProperty(globalThis.crypto, 'randomUUID', {
      value: randomUUID,
      configurable: true,
      writable: true,
    });
  } catch {
    try {
      (globalThis.crypto as Crypto & { randomUUID: () => string }).randomUUID = randomUUID;
    } catch {
      // ignore
    }
  }
})();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
