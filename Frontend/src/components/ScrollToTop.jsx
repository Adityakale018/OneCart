import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Scrolls window to the top on every route change.
 * Mount once inside <BrowserRouter> and it handles all navigation globally.
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

export default ScrollToTop;
