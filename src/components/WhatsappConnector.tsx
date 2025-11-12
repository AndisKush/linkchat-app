import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { whatsappStore } from '../services/whatsapp.store'; // Importa nosso store

// Tipo do estado para facilitar
type WhatsappState = {
  status: string;
  qr: string | null;
};

export function WhatsappConnector() {
  // O useState agora só reflete o que o store global diz
  const [state, setState] = useState<WhatsappState>(whatsappStore.getState());

  useEffect(() => {
    // Quando o componente montar, ele se "inscreve" no store
    // A função de "subscribe" retorna a função de "unsubscribe"
    const unsubscribe = whatsappStore.subscribe(setState);
    
    // Quando o componente desmontar (navegar para outra tela),
    // ele se "desinscreve"
    return unsubscribe;
  }, []); // Roda apenas uma vez

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto text-center">
      <h2 className="text-xl font-semibold mb-4">Conexão WhatsApp</h2>
      <p className="text-gray-600 mb-4">{state.status}</p>
      
      {state.qr && (
        <div className="p-4 border rounded-lg inline-block">
          <QRCodeSVG value={state.qr} size={256} />
        </div>
      )}
    </div>
  );
}