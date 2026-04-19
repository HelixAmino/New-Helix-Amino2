import { useEffect, useRef, useState } from 'react';
import { Loader as Loader2 } from 'lucide-react';

type PdfJsLib = {
  GlobalWorkerOptions: { workerSrc: string };
  getDocument: (src: { url: string }) => { promise: Promise<PdfDocProxy> };
};

type PdfDocProxy = {
  getPage: (n: number) => Promise<PdfPageProxy>;
};

type PdfPageProxy = {
  getViewport: (opts: { scale: number }) => {
    width: number;
    height: number;
  };
  render: (opts: {
    canvasContext: CanvasRenderingContext2D;
    viewport: { width: number; height: number };
  }) => { promise: Promise<void> };
};

const PDFJS_VERSION = '3.11.174';
const PDFJS_URL = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDFJS_VERSION}/build/pdf.min.js`;
const PDFJS_WORKER = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.min.js`;

declare global {
  interface Window {
    pdfjsLib?: PdfJsLib;
    __pdfjsLoading?: Promise<PdfJsLib>;
  }
}

function loadPdfJs(): Promise<PdfJsLib> {
  if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
  if (window.__pdfjsLoading) return window.__pdfjsLoading;
  window.__pdfjsLoading = new Promise<PdfJsLib>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[data-pdfjs="1"]`
    );
    const onReady = () => {
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
        resolve(window.pdfjsLib);
      } else {
        reject(new Error('pdfjsLib missing'));
      }
    };
    if (existing) {
      existing.addEventListener('load', onReady, { once: true });
      existing.addEventListener(
        'error',
        () => reject(new Error('pdf.js failed to load')),
        { once: true }
      );
      return;
    }
    const s = document.createElement('script');
    s.src = PDFJS_URL;
    s.async = true;
    s.dataset.pdfjs = '1';
    s.onload = onReady;
    s.onerror = () => reject(new Error('pdf.js failed to load'));
    document.head.appendChild(s);
  });
  return window.__pdfjsLoading;
}

type Props = {
  url: string;
  size?: number;
  alt?: string;
  className?: string;
  zoom?: number;
};

export function PdfQrImage({
  url,
  size = 320,
  alt = 'QR code',
  className = '',
  zoom = 1,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    setDims(null);

    (async () => {
      try {
        const pdfjsLib = await loadPdfJs();
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
        const proxied = supabaseUrl
          ? `${supabaseUrl}/functions/v1/pdf-proxy?url=${encodeURIComponent(url)}`
          : url;
        const doc = await pdfjsLib.getDocument({ url: proxied }).promise;
        const page = await doc.getPage(1);

        const baseViewport = page.getViewport({ scale: 1 });
        const dpr = Math.min(window.devicePixelRatio || 1, 3);

        const aspect = baseViewport.width / baseViewport.height;
        let displayW: number;
        let displayH: number;
        if (aspect >= 1) {
          displayW = size;
          displayH = size / aspect;
        } else {
          displayH = size;
          displayW = size * aspect;
        }

        const renderScale =
          (Math.max(displayW, displayH) / Math.max(baseViewport.width, baseViewport.height)) *
          2 *
          Math.max(zoom, 1);
        const viewport = page.getViewport({ scale: renderScale });

        const canvas = canvasRef.current;
        if (!canvas || cancelled) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = Math.floor(viewport.width * dpr);
        canvas.height = Math.floor(viewport.height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        await page.render({ canvasContext: ctx, viewport }).promise;
        if (!cancelled) {
          setDims({ w: displayW, h: displayH });
          setStatus('ready');
        }
      } catch {
        if (!cancelled) setStatus('error');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [url, size, zoom]);

  const canvasW = dims ? dims.w * zoom : size;
  const canvasH = dims ? dims.h * zoom : size;

  return (
    <div
      className={`relative bg-white overflow-hidden ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={alt}
    >
      <canvas
        ref={canvasRef}
        className="block absolute top-1/2 left-1/2"
        style={{
          width: `${canvasW}px`,
          height: `${canvasH}px`,
          transform: 'translate(-50%, -50%)',
          imageRendering: 'crisp-edges',
        }}
      />
      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-white">
          <Loader2 className="w-6 h-6 text-cyan-500 animate-spin" />
        </div>
      )}
      {status === 'error' && (
        <div className="absolute inset-0 flex items-center justify-center bg-white">
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="text-[11px] text-cyan-700 underline px-3 text-center"
          >
            Open QR code
          </a>
        </div>
      )}
    </div>
  );
}
