import { useEffect, useState } from 'react';
import { AppProvider } from './context/appcontext';
import Header from './components/header';
import Footer from './components/footer';
import AnnouncementBar from './components/announcementbar';
import DemoNoticeModal from './components/demonoticemodal';
import Home from './pages/home';
import Admin from './pages/admin';
import { api } from './utils/api';
import { useDocumentMeta } from './hooks/usedocumentmeta';

// Real, server-side visit tracking (see backend/routes/visitors.js) - never
// tracks the admin panel itself, and never blocks or throws on failure.
function trackVisit(pathname: string) {
  if (pathname.startsWith('/admin')) return;
  api.visitors.track();
}

// Renders nothing; just keeps <title>/meta description/favicon/OG tags in
// sync with the store config. Lives as its own component (rather than
// inline in AppProvider) because it needs useStoreConfig(), which itself
// depends on AppContext already being provided.
function DocumentMeta() {
  useDocumentMeta();
  return null;
}

function Router() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      trackVisit(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);

    const originalPushState = window.history.pushState;
    window.history.pushState = function(...args) {
      originalPushState.apply(window.history, args);
      setCurrentPath(window.location.pathname);
      trackVisit(window.location.pathname);
      window.dispatchEvent(new Event('popstate'));
    };

    const handleLinkClick = (e: MouseEvent) => {
      // Respect the browser's native "open in new tab/window" gestures
      // (middle-click, cmd/ctrl/shift/alt+click) instead of hijacking them
      // into an in-page navigation.
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }

      const target = e.target as HTMLElement;
      const link = target.closest('a');

      if (
        link &&
        link.href &&
        link.href.startsWith(window.location.origin) &&
        !link.target &&
        !link.hasAttribute('download')
      ) {
        const url = new URL(link.href);

        // A same-page anchor (e.g. the nav's "#menu"/"#about"/"#contact"
        // links, or the footer's) should get the browser's own native hash
        // scroll (smooth, thanks to `html { scroll-behavior: smooth }` in
        // index.css) rather than being hijacked into a full "navigation"
        // that would reset scroll to the top. Only the SPA route itself
        // needs custom handling.
        if (url.hash && url.pathname === window.location.pathname) {
          return;
        }

        e.preventDefault();
        window.history.pushState({}, '', url.pathname + url.search + url.hash);
        setCurrentPath(url.pathname);
        trackVisit(url.pathname);
        if (!url.hash) {
          window.scrollTo(0, 0);
        }
      }
    };

    document.addEventListener('click', handleLinkClick);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('click', handleLinkClick);
    };
  }, []);

  const path = currentPath;

  const isAdminRoute = path === '/admin' || path.startsWith('/admin/');
  if (isAdminRoute) {
    return <Admin />;
  }

  if (path === '/' || path === '') {
    return (
      <>
        <DemoNoticeModal />
        <AnnouncementBar />
        <Header />
        <Home />
        <Footer />
      </>
    );
  }

  return (
    <>
      <AnnouncementBar />
      <Header />
      <div className="min-h-[60vh] flex items-center justify-center bg-surface">
        <div className="text-center px-6">
          <h1 className="font-display text-6xl font-semibold text-secondary mb-4">404</h1>
          <p className="text-muted text-lg mb-8">Page not found</p>
          <a
            href="/"
            className="inline-block px-8 py-3 bg-primary text-white font-medium rounded-full hover:bg-secondary transition-colors"
          >
            Back home
          </a>
        </div>
      </div>
      <Footer />
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <DocumentMeta />
      <Router />
    </AppProvider>
  );
}

export default App;
