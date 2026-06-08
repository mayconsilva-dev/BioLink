import { motion, useReducedMotion } from 'framer-motion';
import { siteConfig } from './config';
import { ProfileCard } from './components/ProfileCard';
import { LinkList } from './components/LinkList';
import { SocialIcons } from './components/SocialIcons';
import { SeoHead } from './components/SeoHead';
import {
  filterValidLinks,
  filterValidSocials,
  mergeTheme,
  themeToCssVars,
} from './lib/config-utils';

const validLinks = filterValidLinks(siteConfig.links);
const validSocials = filterValidSocials(siteConfig.socials);
const theme = mergeTheme(siteConfig.theme);
const themeStyle = themeToCssVars(theme);

const linkProps = validLinks.map(({ title, url, icon, highlighted }) => ({
  title,
  url,
  icon,
  highlighted,
}));

const socialUrls = validSocials.map((social) => social.url);

export default function App() {
  const prefersReducedMotion = useReducedMotion();

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

  return (
    <>
      <SeoHead
        meta={siteConfig.meta}
        profile={{
          name: siteConfig.profile.name,
          avatarUrl: siteConfig.profile.avatarUrl,
        }}
        socialUrls={socialUrls}
      />
      <main
        className="mx-auto flex min-h-dvh w-full max-w-[var(--page-max-width)] flex-col items-center px-[var(--page-padding-x)] py-8"
        style={themeStyle}
      >
        <motion.div
          className="flex w-full flex-col items-center gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="w-full">
            <ProfileCard
              name={siteConfig.profile.name}
              handle={siteConfig.profile.handle}
              bio={siteConfig.profile.bio}
              avatarUrl={siteConfig.profile.avatarUrl}
              avatarAlt={`${siteConfig.profile.name} profile photo`}
            />
          </motion.div>

          {validSocials.length > 0 && (
            <motion.div variants={itemVariants}>
              <SocialIcons socials={validSocials} />
            </motion.div>
          )}

          <motion.div variants={itemVariants} className="w-full">
            <LinkList links={linkProps} />
          </motion.div>
        </motion.div>
      </main>
    </>
  );
}
