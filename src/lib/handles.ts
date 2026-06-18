/**
 * Utilitários do @handle — o identificador único que vira a URL pública de cada
 * usuário (ex.: #/maria). Só permite letras minúsculas, números e underscore.
 */

/** Handles reservados (rotas internas) que não podem ser usados por usuários. */
export const RESERVED_HANDLES = ['admin', 'u', 'api', 'login', 'signup'];

export const MAX_HANDLE_LENGTH = 30;

/** Normaliza um handle: minúsculas, só [a-z0-9_], com limite de tamanho. */
export function normalizeHandle(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '')
    .slice(0, MAX_HANDLE_LENGTH);
}

/** Mensagem de erro do handle, ou null se for válido. */
export function validateHandle(handle: string): string | null {
  if (handle.trim() === '') return 'Escolha um @handle para a sua página.';
  if (handle.length < 3) return 'O @handle precisa ter ao menos 3 caracteres.';
  if (RESERVED_HANDLES.includes(handle)) return 'Esse @handle é reservado.';
  return null;
}
