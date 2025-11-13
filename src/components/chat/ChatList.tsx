import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import type { ClientSummary } from '../../pages/Chat';
import { socket } from '../../services/socket';

type ClientFromAPI = {
  _id: string;
  name: string;
  phone: string;
};

type ChatListProps = {
  onClientSelect: (client: ClientSummary) => void;
  selectedClient: ClientSummary | null;
};

export function ChatList({ onClientSelect, selectedClient }: ChatListProps) {
  const [clients, setClients] = useState<ClientSummary[]>([]);
  const [unreadMarkers, setUnreadMarkers] = useState(new Set<string>());

  async function fetchClients() {
    try {
      const response = await api.get<ClientFromAPI[]>('/crm/clients');
      setClients(response.data);
    } catch (err) {
      console.error('Erro ao buscar clientes:', err);
    }
  }


  async function fetchUnread() {
    try {
      const response = await api.get<string[]>('/chat/unread');
      setUnreadMarkers(new Set(response.data));
    } catch (err) {
      console.error('Erro ao buscar não lidos:', err);
    }
  }

  useEffect(() => {
    fetchClients();
    fetchUnread();
  }, []);

  useEffect(() => {
    const handleNewMessage = (newMessage: { client: string }) => {
      
      if (newMessage.client !== selectedClient?._id) {
        setUnreadMarkers(prev => new Set(prev).add(newMessage.client));
      } else {
        api.post(`/chat/${newMessage.client}/mark-read`).catch();
      }
    };
    socket.on('new_message', handleNewMessage);
    return () => {
      socket.off('new_message', handleNewMessage);
    };

  }, [selectedClient]);


  async function handleSelectClient(client: ClientSummary) {
    onClientSelect(client);
    
    try {
      await api.post(`/chat/${client._id}/mark-read`);
      
      setUnreadMarkers(prev => {
        const newSet = new Set(prev);
        newSet.delete(client._id);
        return newSet;
      });
    } catch (err) {
      console.error('Erro ao marcar como lido:', err);
    }
  }

  return (
    <div className="flex flex-col">
      {/* ... (Header) ... */}
      <ul className="divide-y">
        {clients.map(client => {
          const hasUnread = unreadMarkers.has(client._id);
          return (
            <li 
              key={client._id}
              onClick={() => handleSelectClient(client)}
              className="p-4 hover:bg-gray-50 cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{client.name}</h3>
                  <p className="text-sm text-gray-600">{client.phone}</p>
                </div>
                {hasUnread && (
                  <span className="w-3 h-3 bg-green-500 rounded-full" />
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}