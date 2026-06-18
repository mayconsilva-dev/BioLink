import LandingPage from './components/LandingPage';
import PublicPage from './components/PublicPage';
import { AdminPage } from './components/admin/AdminPage';
import { useHashRoute } from './hooks/useHashRoute';

export default function Root() {
  const route = useHashRoute();

  if (route === '/') {
    return <LandingPage />;
  }

  if (route.startsWith('/admin')) {
    return <AdminPage />;
  }

  // Qualquer outra rota é tratada como o @handle de um usuário: #/<handle>
  const handle = decodeURIComponent(route.replace(/^\//, '').split('/')[0]);
  return <PublicPage handle={handle} />;
}
