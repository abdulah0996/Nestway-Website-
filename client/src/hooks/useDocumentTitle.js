import { useEffect } from 'react';

export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | Nestway Immigration` : 'Nestway Immigration';
  }, [title]);
}
