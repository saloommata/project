// src/components/demonoticemodal.tsx
//
// One-time-per-page-load pop-up shown when the site opens. Tells visitors the
// backend is offline in this demo and links to the source code.
import { useEffect, useState } from 'react';

const SOURCE_URL = 'https://github.com/saloommata/project';

export default function DemoNoticeModal() {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4"
      onClick={() => setOpen(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="demo-notice-title"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="demo-notice-title" className="mb-4 text-xl font-semibold text-secondary">
          Demo notes
        </h2>

        <p className="mb-4 text-sm text-gray-700">
          <strong>Note:</strong> Please note: the backend server is currently offline, so some
          features are unavailable in this demo.
        </p>

        <p className="mb-6 text-sm text-gray-700">
          <strong>Source code:</strong>{' '}
          <a
            href={SOURCE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all text-primary underline"
          >
            {SOURCE_URL}
          </a>
        </p>

        <button
          type="button"
          onClick={() => setOpen(false)}
          className="w-full rounded-full bg-primary px-6 py-2.5 font-medium text-white transition-colors hover:bg-secondary"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
