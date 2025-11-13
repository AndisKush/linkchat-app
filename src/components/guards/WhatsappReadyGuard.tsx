import { useEffect, useState } from 'react';
import { whatsappStore } from '../../services/whatsapp.store';
import { Link } from 'react-router-dom';

// Pega o estado inicial do store
const initialState = whatsappStore.getState();

export function WhatsappReadyGuard({ children }: { children: React.ReactNode }) {
  // O estado local reflete o estado global do 'isReady'
  const [isWhatsappReady, setIsWhatsappReady] = useState(initialState.isReady);
  const [currentStatus, setCurrentStatus] = useState(initialState.status);

  useEffect(() => {
    const unsubscribe = whatsappStore.subscribe((state) => {
      setIsWhatsappReady(state.isReady);
      setCurrentStatus(state.status);
    });
    
    return () => {
        unsubscribe;
    } 
  }, []);

  if (isWhatsappReady) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      {/* Você pode adicionar um Spinner/Loading aqui */}
      <svg className="animate-spin h-10 w-10 text-blue-500 mb-4" /* ... (ícone de spinner) ... */ />
      
      <h1 className="text-2xl font-bold mb-4">Aguardando conexão...</h1>
      <p className="text-gray-600 mb-6">
        O chat só será liberado após o WhatsApp estar conectado.
        <br />
        Status atual: <strong>{currentStatus}</strong>
      </p>
      
      <Link
        to="/config"
        className="bg-blue-500 text-white px-6 py-2 rounded font-semibold hover:bg-blue-600 shadow"
      >
        Ir para Configurações (Verificar QR Code)
      </Link>
    </div>
  );
}