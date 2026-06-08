/**
 * =============================================================================
 * BIOLINK — Arquivo de configuração (ÚNICO arquivo que você precisa editar)
 * =============================================================================
 *
 * Personalize sua página de bio links alterando os valores abaixo.
 * Não é necessário modificar componentes React ou estilos.
 *
 * Campos disponíveis:
 * - profile: foto, nome, @handle e bio
 * - links: botões principais (título, URL, ícone, destaque opcional)
 * - socials: ícones compactos de redes sociais
 * - theme: cores da página (primária, fundo, botões)
 * - meta: título e descrição para SEO / compartilhamento
 *
 * Ícones disponíveis (campo icon):
 * Globe, Link, MessageCircle, ShoppingBag, BookOpen, Mail,
 * Instagram, Youtube, Twitter, Github, Linkedin, Facebook, Music, Video, Phone
 */

import type { SiteConfig } from './types';
import defaultAvatar from './assets/avatar.jpg';

export const siteConfig: SiteConfig = {
  profile: {
    name: 'Maria Silva',
    handle: 'mariasilva',
    bio: 'Designer & creator. Todos os meus links importantes estão aqui 👇',
    avatarUrl: defaultAvatar,
  },

  links: [
    {
      id: 'portfolio',
      title: 'Meu Portfolio',
      url: 'https://example.com/portfolio',
      icon: 'Globe',
      highlighted: true,
    },
    {
      id: 'curso',
      title: 'Curso Online',
      url: 'https://example.com/curso',
      icon: 'BookOpen',
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp',
      url: 'https://wa.me/5511999999999',
      icon: 'MessageCircle',
    },
    {
      id: 'loja',
      title: 'Loja',
      url: 'https://example.com/loja',
      icon: 'ShoppingBag',
    },
  ],

  socials: [
    {
      id: 'instagram',
      url: 'https://instagram.com/mariasilva',
      icon: 'Instagram',
      label: 'Instagram de Maria Silva',
    },
    {
      id: 'youtube',
      url: 'https://youtube.com/@mariasilva',
      icon: 'Youtube',
      label: 'YouTube de Maria Silva',
    },
    {
      id: 'github',
      url: 'https://github.com/mariasilva',
      icon: 'Github',
      label: 'GitHub de Maria Silva',
    },
  ],

  theme: {
    primary: '#7c3aed',
    primaryForeground: '#ffffff',
    background: '#0f0f12',
    surface: '#1a1a21',
    surfaceHover: '#24242e',
    text: '#f4f4f5',
    textMuted: '#a1a1aa',
    border: '#2e2e3a',
  },

  meta: {
    title: 'Maria Silva — Links',
    description:
      'Todos os links de Maria Silva em um só lugar. Portfolio, curso, WhatsApp e redes sociais.',
    canonicalUrl: 'https://username.github.io/biolink/',
    locale: 'pt_BR',
  },
};
