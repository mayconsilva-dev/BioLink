import { motion, useReducedMotion } from 'framer-motion';
import { siteConfig } from '../config';
import { ProfileCard } from './ProfileCard';
import { LinkList } from './LinkList';
import { SeoHead } from './SeoHead';
import { usePublicPage } from '../hooks/usePublicPage';
import { mergeTheme, themeToCssVars } from '../lib/config-utils';
import type { Meta } from '../types';

// Tema compartilhado por todas as páginas (vem do config.ts).
const theme = mergeTheme(siteConfig.theme);
const themeStyle = themeToCssVars(theme);

interface PublicPageProps {
  handle: string;
}

export default function PublicPage({ handle }: PublicPageProps) {
  const prefersReducedMotion = useReducedMotion();
  const { profile, links, loading, notFound } = usePublicPage(handle);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: prefersReducedMotion
        ? { duration: 0 }
        : { staggerChildren: 0.08, delayChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: prefersReducedMotion
        ? { duration: 0 }
        : { duration: 0.4, ease: 'easeOut' as const },
    },
  };

  const container =
    'mx-auto flex min-h-dvh w-full max-w-[var(--page-max-width)] flex-col items-center px-[var(--page-padding-x)] py-8';

  if (loading) {
    return (
      <main className={container} style={themeStyle}>
        <p className="m-auto text-sm text-text-muted">Carregando…</p>
      </main>
    );
  }

  if (notFound || !profile) {
    return (
      <main className={container} style={themeStyle}>
        <div className="m-auto flex flex-col items-center gap-3 text-center">
          <h1 className="text-lg font-semibold text-text">Página não encontrada</h1>
          <p className="text-sm text-text-muted">
            Não existe um perfil em <code>#/{handle}</code>.
          </p>
          <a
            href="#/"
            className="text-sm text-text-muted underline-offset-4 hover:underline"
          >
            ← Início
          </a>
        </div>
      </main>
    );
  }

  const meta: Meta = {
    title: `${profile.name || profile.handle} — Links`,
    description:
      profile.bio || `Todos os links de ${profile.name || profile.handle}.`,
  };

  return (
    <>
      <SeoHead
        meta={meta}
        profile={{ name: profile.name, avatarUrl: profile.avatarUrl }}
        socialUrls={[]}
      />
      <main className={container} style={themeStyle}>
        <motion.div
          className="flex w-full flex-col items-center gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="w-full">
            <ProfileCard
              name={profile.name}
              handle={profile.handle}
              bio={profile.bio}
              avatarUrl={profile.avatarUrl}
              avatarAlt={`${profile.name} profile photo`}
            />
          </motion.div>

          <motion.div variants={itemVariants} className="w-full">
            <LinkList links={links} />
          </motion.div>
        </motion.div>

        <footer className="mt-auto pt-8">
          <a
            href="#/admin"
            className="text-xs text-text-muted underline-offset-4 transition-opacity hover:underline"
          >
            Criar minha página
          </a>
        </footer>
      </main>
    </>
  );
}
