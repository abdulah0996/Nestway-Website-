import { useEffect } from 'react';

function upsertMeta(name, content) {
  let element = document.querySelector(`meta[name="${name}"]`);
  if (!content) {
    element?.remove();
    return;
  }
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute('name', name);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function upsertProperty(property, content) {
  let element = document.querySelector(`meta[property="${property}"]`);
  if (!content) {
    element?.remove();
    return;
  }
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute('property', property);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function upsertCanonical(url) {
  if (!url) return;
  let element = document.querySelector('link[rel="canonical"]');
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }
  element.setAttribute('href', url);
}

export function useSeo({ title, description, image, type = 'website', canonical, structuredData }) {
  useEffect(() => {
    const resolvedTitle = title ? `${title} | Nestway Immigration` : 'Nestway Immigration';
    document.title = resolvedTitle;
    upsertMeta('description', description);
    upsertProperty('og:title', resolvedTitle);
    upsertProperty('og:description', description);
    upsertProperty('og:type', type);
    upsertProperty('og:image', image);
    upsertMeta('twitter:card', image ? 'summary_large_image' : 'summary');
    upsertCanonical(canonical);

    const scriptId = 'nestway-structured-data';
    document.getElementById(scriptId)?.remove();
    if (structuredData) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }
    return () => {
      document.getElementById(scriptId)?.remove();
      if (canonical) document.querySelector('link[rel="canonical"]')?.remove();
    };
  }, [title, description, image, type, canonical, structuredData]);
}
