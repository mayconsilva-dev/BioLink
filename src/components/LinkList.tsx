import type { LinkListProps } from '../types';
import { LinkButton } from './LinkButton';

export function LinkList({
  links,
  emptyMessage = 'Nenhum link disponível.',
}: LinkListProps) {
  return (
    <nav aria-label="Links principais" className="flex w-full flex-col gap-3">
      {links.length === 0 ? (
        <p className="py-4 text-center text-sm text-text-muted">{emptyMessage}</p>
      ) : (
        links.map((link) => (
          <LinkButton
            key={`${link.url}-${link.title}`}
            title={link.title}
            url={link.url}
            icon={link.icon}
            highlighted={link.highlighted}
          />
        ))
      )}
    </nav>
  );
}
