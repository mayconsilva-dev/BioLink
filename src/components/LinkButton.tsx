import type { LinkButtonProps } from '../types';
import { getLucideIcon } from '../lib/icons';

export function LinkButton({
  title,
  url,
  icon,
  highlighted = false,
}: LinkButtonProps) {
  const Icon = getLucideIcon(icon);

  const baseClasses =
    'flex w-full items-center gap-4 rounded-[var(--radius-md)] px-4 font-medium transition-colors duration-150';
  const variantClasses = highlighted
    ? 'bg-primary text-primary-fg shadow-sm hover:opacity-90'
    : 'border border-border bg-surface text-text hover:bg-surface-hover';

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseClasses} ${variantClasses}`}
      style={{ minHeight: 'var(--link-min-height)' }}
    >
      <Icon size={20} aria-hidden="true" className="shrink-0" />
      <span className="truncate text-base">{title}</span>
    </a>
  );
}
