import { useState } from "react";
import { ChatList } from "../components/chat/ChatList";
import { ClientDetails } from "../components/chat/ClientDetails";
import { ChatWindow } from "../components/chat/ChatWindow";

export type ClientSummary = {
  _id: string;
  name: string;
  phone: string;
};

export function Chat() {
  const [selectedClient, setSelectedClient] = useState<ClientSummary | null>(
    null
  );

  return (
    <div className="flex h-screen -m-6">
      {" "}
      {/* Coluna 1: Lista de Clientes/Conversas */}
      <div className="w-1/4 border-r border-gray-200 bg-white overflow-y-auto">
        <ChatList
          selectedClient={selectedClient}
          onClientSelect={setSelectedClient}
        />
      </div>
      {/* Coluna 2: Janela da Conversa */}
      <div className="flex-1 flex flex-col bg-gray-100">
        {selectedClient ? (
          <ChatWindow client={selectedClient} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">
              Selecione um cliente para iniciar a conversa.
            </p>
          </div>
        )}
      </div>
      {/* Coluna 3: Detalhes do Cliente */}
      <div className="w-1/4 border-l border-gray-200 bg-white overflow-y-auto">
        {selectedClient ? (
          <ClientDetails clientId={selectedClient._id} />
        ) : (
          <div className="p-4 flex items-center justify-center h-full">
            <p className="text-gray-500 text-sm">
              Detalhes do cliente aparecerão aqui.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
