import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Clientes } from "./pages/Clientes";
import { Chat } from "./pages/Chat";
import { Configuracoes } from "./pages/Configuracoes";
import { WhatsappReadyGuard } from "./components/guards/WhatsappReadyGuard";

// Define as rotas usando o Layout principal
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Clientes />,
      },
      {
        path: "/chat",
        element: (
          <WhatsappReadyGuard>
            <Chat />
          </WhatsappReadyGuard>
        ),
      },
      {
        path: "/config",
        element: <Configuracoes />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
