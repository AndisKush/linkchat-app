import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Clientes } from './pages/Clientes';
import { Chat } from './pages/Chat';
import { Configuracoes } from './pages/Configuracoes';

// Define as rotas usando o Layout principal
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Clientes />,
      },
      {
        path: '/chat',
        element: <Chat />,
      },
      {
        path: '/config',
        element: <Configuracoes />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;