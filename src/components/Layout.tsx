import { Link, Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Menu Lateral */}
      <nav className="w-64 bg-gray-800 text-white p-4">
        <h1 className="text-2xl font-bold mb-6">Co-Piloto 🚀</h1>
        <ul>
          <li className="mb-2">
            <Link to="/" className="hover:bg-gray-700 p-2 block rounded">
              Clientes
            </Link>
          </li>
          <li className="mb-2">
            <Link to="/chat" className="hover:bg-gray-700 p-2 block rounded">
              Chat
            </Link>
          </li>
          <li className="mb-2">
            <Link to="/config" className="hover:bg-gray-700 p-2 block rounded">
              Configurações
            </Link>
          </li>
        </ul>
      </nav>

      {/* Conteúdo da Página */}
      <main className="flex-1 p-6 overflow-auto">
        <Outlet /> {/* As páginas (Clientes, Chat, Config) serão renderizadas aqui */}
      </main>
    </div>
  );
}