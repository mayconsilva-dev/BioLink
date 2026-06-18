import { useEffect, useState } from 'react';

/**
 * Roteamento simples baseado em hash (`#/admin`), que funciona em hospedagem
 * estática como GitHub Pages sem configuração extra de servidor.
 */
export function useHashRoute(): string {
  const [route, setRoute] = useState(() => normalize(window.location.hash));

  useEffect(() => {
    const onChange = () => setRoute(normalize(window.location.hash));
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return route;
}

function normalize(hash: string): string {
  const path = hash.replace(/^#/, '');
  return path === '' ? '/' : path;
}
