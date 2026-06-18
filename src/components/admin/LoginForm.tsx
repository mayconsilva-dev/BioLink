import { useState, type FormEvent } from 'react';
import { LogIn, UserPlus } from 'lucide-react';
import { signIn, signUp } from '../../hooks/useAuth';

type Mode = 'login' | 'signup';

export function LoginForm() {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isSignup = mode === 'signup';

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setInfo(null);

    if (isSignup && password.length < 6) {
      setError('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }

    setSubmitting(true);
    try {
      if (isSignup) {
        const { needsConfirmation } = await signUp(email.trim(), password);
        if (needsConfirmation) {
          setInfo(
            'Conta criada! Verifique seu e-mail para confirmar e depois faça login.',
          );
          setMode('login');
          setPassword('');
        }
        // Sem confirmação: o login é automático (onAuthStateChange assume).
      } else {
        await signIn(email.trim(), password);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : '';
      if (isSignup) {
        setError(
          /registered|already/i.test(message)
            ? 'Este e-mail já está cadastrado. Tente entrar.'
            : 'Não foi possível criar a conta. Verifique os dados.',
        );
      } else {
        setError('E-mail ou senha inválidos.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  function toggleMode() {
    setMode((m) => (m === 'login' ? 'signup' : 'login'));
    setError(null);
    setInfo(null);
  }

  const inputClasses =
    'w-full rounded-[var(--radius-md)] border border-border bg-surface px-4 py-3 text-base text-text outline-none transition-colors focus:border-primary';

  return (
    <div className="flex w-full flex-col gap-4">
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-4 rounded-[var(--radius-md)] border border-border bg-surface p-6"
      >
        <div className="flex flex-col gap-1 text-center">
          <h1 className="text-lg font-semibold text-text">
            {isSignup ? 'Criar conta' : 'Acessar painel'}
          </h1>
          <p className="text-sm text-text-muted">
            {isSignup
              ? 'Cadastre-se para gerenciar seus links.'
              : 'Entre para gerenciar seus links.'}
          </p>
        </div>

        <label className="flex flex-col gap-1 text-sm text-text-muted">
          E-mail
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClasses}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-text-muted">
          Senha
          <input
            type="password"
            autoComplete={isSignup ? 'new-password' : 'current-password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClasses}
          />
        </label>

        {error && (
          <p className="text-sm" style={{ color: 'var(--color-error)' }}>
            {error}
          </p>
        )}
        {info && <p className="text-sm text-text-muted">{info}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="flex items-center justify-center gap-2 rounded-[var(--radius-md)] bg-primary px-4 py-3 font-medium text-primary-fg transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {isSignup ? (
            <UserPlus size={18} aria-hidden="true" />
          ) : (
            <LogIn size={18} aria-hidden="true" />
          )}
          {submitting
            ? isSignup
              ? 'Criando…'
              : 'Entrando…'
            : isSignup
              ? 'Criar conta'
              : 'Entrar'}
        </button>
      </form>

      <button
        type="button"
        onClick={toggleMode}
        className="text-center text-sm text-text-muted underline-offset-4 hover:underline"
      >
        {isSignup
          ? 'Já tenho conta — entrar'
          : 'Não tem conta? Criar uma conta'}
      </button>
    </div>
  );
}
