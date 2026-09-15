import { useEffect } from 'react';
import { useLocation } from 'react-router';

/**
 * ScrollToTop component scrolls the viewport to the top (scrollY = 0)
 * whenever the React Router route (pathname or search params) changes.
 */
export function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    try {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant',
      });
    } catch {
      window.scrollTo(0, 0);
    }
  }, [pathname, search]);

  return null;
}

export default ScrollToTop;
