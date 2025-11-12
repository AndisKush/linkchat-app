import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import type { ClientSummary } from '../../pages/Chat'; // Importa o tipo

type ClientFromAPI = {
  _id: string;
  name: string;
  phone: string;
  // ...outros campos
};

type ChatListProps = {
  onClientSelect: (client: ClientSummary) => void;
};

export function ChatList({ onClientSelect }: ChatListProps) {
  const [clients, setClients] = useState<ClientSummary[]>([]);
  
  useEffect(() => {
    async function fetchClients() {
      try {
        const response = await api.get<ClientFromAPI[]>('/crm/clients');
        setClients(response.data);
      } catch (err) {
        console.error('Erro ao buscar clientes:', err);
      }
    }
    fetchClients();
  }, []);

  return (
    <div className="flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Conversas</h2>
        {/* TODO: Adicionar um campo de busca aqui */}
      </div>
      <ul className="divide-y">
        {clients.map(client => (
          <li 
            key={client._id}
            onClick={() => onClientSelect(client)}
            className="p-4 hover:bg-gray-50 cursor-pointer"
          >
            <h3 className="font-semibold">{client.name}</h3>
            <p className="text-sm text-gray-600">{client.phone}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}