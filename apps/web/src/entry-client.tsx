import '@vitejs/plugin-react/preamble';
import { hydrateRoot } from 'react-dom/client';
import { createBrowserRouter } from 'react-router-dom';
import { routes } from './routes/routes';
import './index.css';
import { AppShell } from './app/AppShell';

// 创建Browser Router
const router = createBrowserRouter(routes);

// Hydrate根节点
hydrateRoot(
  document.getElementById('root')!,
  <AppShell type="client" router={router} />
);
