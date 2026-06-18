import { ChevronDown, ChevronUp, Eye, EyeOff, Star, Trash2 } from 'lucide-react';
import { ICON_NAMES, getLucideIcon } from '../../lib/icons';
import type { LinkRow, LucideIconName } from '../../types';

interface LinkEditorRowProps {
  link: LinkRow;
  isFirst: boolean;
  isLast: boolean;
  onChange: (id: string, patch: Partial<LinkRow>) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, direction: -1 | 1) => void;
}

export function LinkEditorRow({
  link,
  isFirst,
  isLast,
  onChange,
  onDelete,
  onMove,
}: LinkEditorRowProps) {
  const Icon = getLucideIcon(link.icon as LucideIconName);

  const inputClasses =
    'w-full rounded-[var(--radius-sm)] border border-border bg-bg px-3 py-2 text-sm text-text outline-none transition-colors focus:border-primary';
  const iconBtn =
    'flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] border border-border text-text-muted transition-colors hover:bg-surface-hover disabled:opacity-40';

  return (
    <div
      className="flex flex-col gap-3 rounded-[var(--radius-md)] border border-border bg-surface p-4"
      style={{ opacity: link.visible ? 1 : 0.6 }}
    >
      <div className="flex items-center gap-2">
        <Icon size={18} aria-hidden="true" className="shrink-0 text-text-muted" />
        <input
          aria-label="Título do link"
          placeholder="Título"
          value={link.title}
          onChange={(e) => onChange(link.id, { title: e.target.value })}
          className={inputClasses}
        />
      </div>

      <input
        aria-label="URL do link"
        placeholder="https://…"
        value={link.url}
        onChange={(e) => onChange(link.id, { url: e.target.value })}
        className={inputClasses}
      />

      <div className="flex flex-wrap items-center gap-2">
        <select
          aria-label="Ícone"
          value={link.icon}
          onChange={(e) => onChange(link.id, { icon: e.target.value })}
          className={`${inputClasses} w-auto`}
        >
          {ICON_NAMES.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        <button
          type="button"
          aria-pressed={link.highlighted}
          onClick={() => onChange(link.id, { highlighted: !link.highlighted })}
          title={link.highlighted ? 'Remover destaque' : 'Destacar link'}
          className={`flex h-9 items-center gap-1.5 rounded-[var(--radius-sm)] border px-3 text-sm transition-colors ${
            link.highlighted
              ? 'border-primary bg-primary text-primary-fg'
              : 'border-border text-text-muted hover:bg-surface-hover'
          }`}
        >
          <Star size={15} aria-hidden="true" />
          Destaque
        </button>

        <button
          type="button"
          aria-pressed={link.visible}
          onClick={() => onChange(link.id, { visible: !link.visible })}
          title={link.visible ? 'Ocultar da página' : 'Mostrar na página'}
          className={`flex h-9 items-center gap-1.5 rounded-[var(--radius-sm)] border px-3 text-sm transition-colors ${
            link.visible
              ? 'border-border text-text hover:bg-surface-hover'
              : 'border-border text-text-muted hover:bg-surface-hover'
          }`}
        >
          {link.visible ? <Eye size={15} /> : <EyeOff size={15} />}
          {link.visible ? 'Visível' : 'Oculto'}
        </button>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            className={iconBtn}
            disabled={isFirst}
            onClick={() => onMove(link.id, -1)}
            aria-label="Mover para cima"
          >
            <ChevronUp size={16} />
          </button>
          <button
            type="button"
            className={iconBtn}
            disabled={isLast}
            onClick={() => onMove(link.id, 1)}
            aria-label="Mover para baixo"
          >
            <ChevronDown size={16} />
          </button>
          <button
            type="button"
            className={`${iconBtn} hover:text-[var(--color-error)]`}
            onClick={() => onDelete(link.id)}
            aria-label="Excluir link"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
