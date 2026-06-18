import { ArrowRight, Link as LinkIcon } from 'lucide-react';
import { siteConfig } from '../config';
import { mergeTheme, themeToCssVars } from '../lib/config-utils';

const theme = mergeTheme(siteConfig.theme);
const themeStyle = themeToCssVars(theme);

export default function LandingPage() {
  return (
    <main
      className="mx-auto flex min-h-dvh w-full max-w-[var(--page-max-width)] flex-col items-center justify-center gap-6 px-[var(--page-padding-x)] py-8 text-center"
      style={themeStyle}
    >
      <span
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-fg"
        aria-hidden="true"
      >
        <LinkIcon size={26} />
      </span>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-text">
          Sua página de links, em um só lugar
        </h1>
        <p className="max-w-md text-sm text-text-muted">
          Crie sua conta, personalize seu perfil e compartilhe todos os seus
          links com um único endereço.
        </p>
      </div>

      <a
        href="#/admin"
        className="flex items-center gap-2 rounded-[var(--radius-md)] bg-primary px-5 py-3 font-medium text-primary-fg transition-opacity hover:opacity-90"
      >
        Entrar ou criar conta
        <ArrowRight size={18} aria-hidden="true" />
      </a>
    </main>
  );
}
