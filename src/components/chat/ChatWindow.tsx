import { useEffect, useState } from 'react';
import type { ClientSummary } from '../../pages/Chat';
import { api } from '../../services/api';
import { socket } from '../../services/socket';

// Tipo da mensagem vinda da API
type Message = {
  _id: string;
  fromMe: boolean;
  body: string;
  createdAt: string;
};

type ChatWindowProps = {
  client: ClientSummary;
};

export function ChatWindow({ client }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);

  // Função para buscar o histórico de chat
  async function fetchMessages() {
    setIsLoading(true);
    try {
      const response = await api.get<Message[]>(`/chat/${client._id}/messages`);
      setMessages(response.data);
    } catch (err) {
      console.error('Erro ao buscar mensagens:', err);
    } finally {
      setIsLoading(false);
    }
  }

  // Busca o histórico quando o cliente muda
  useEffect(() => {
    fetchMessages();
    
    // Ouvinte para novas mensagens (WebSocket)
    const handleNewMessage = (newMessage: Message) => {
      // Adiciona a nova mensagem se ela for deste cliente
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };
    
    socket.on('new_message', handleNewMessage);
    
    return () => {
      socket.off('new_message', handleNewMessage);
    };
  }, [client._id]);
  
  // Função para ENVIAR mensagem
  async function handleSend() {
    if (currentMessage.trim() === '') return;
    
    try {
      // 1. Envia para a API (que envia para o Wpp e salva no DB)
      const response = await api.post<Message>(`/chat/send/${client._id}`, {
        body: currentMessage,
      });
      
      // 2. Adiciona a mensagem enviada à lista
      setMessages((prev) => [...prev, response.data]);
      setCurrentMessage('');
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
      alert('Falha ao enviar mensagem.');
    }
  }
  
  // Função para SUGERIR resposta (IA)
  async function handleSuggest() {
    setIsSuggesting(true);
    try {
      const response = await api.post<{ suggestion: string }>(
        `/ai/suggest-reply/${client._id}`
      );
      // Coloca a sugestão na caixa de texto
      setCurrentMessage(response.data.suggestion);
    } catch (err) {
      console.error('Erro ao buscar sugestão:', err);
      alert('Falha ao gerar sugestão.');
    } finally {
      setIsSuggesting(false);
    }
  }

  return (
    <>
      {/* Header do Chat */}
      <header className="bg-white p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold">{client.name}</h2>
        <button
          onClick={handleSuggest}
          disabled={isSuggesting}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:bg-gray-400"
        >
          {isSuggesting ? 'Pensando...' : '🤖 Sugerir Resposta'}
        </button>
      </header>

      {/* Área de Mensagens */}
      <main className="flex-1 p-4 overflow-y-auto space-y-3">
        {isLoading && <p>Carregando histórico...</p>}
        {messages.map(msg => (
          <div 
            key={msg._id}
            className={`flex ${msg.fromMe ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`p-3 rounded-lg max-w-lg ${
                msg.fromMe 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white shadow'
              }`}
            >
              {msg.body}
            </div>
          </div>
        ))}
      </main>

      {/* Input de Mensagem */}
      <footer className="bg-white p-4 border-t flex space-x-2">
        <textarea
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          placeholder="Digite sua mensagem ou clique em 'Sugerir'..."
          className="w-full p-2 border rounded resize-none"
          rows={3}
        />
        <button
          onClick={handleSend}
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 self-end"
        >
          Enviar
        </button>
      </footer>
    </>
  );
}