import { useEffect, useState } from 'react';
import { WhatsappConnector } from '../components/WhatsappConnector';
import { Modal } from '../components/Modal';
import { api } from '../services/api';

// Tipo de dado para uma etapa (copiado da API)
type FunnelStage = {
  _id: string;
  name: string;
  order: number;
  promptInstructions: string;
};

export function Configuracoes() {
  const [stages, setStages] = useState<FunnelStage[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Estados para o formulário
  const [name, setName] = useState('');
  const [prompt, setPrompt] = useState('');
  
  // Função para buscar as etapas
  async function fetchStages() {
    try {
      const response = await api.get('/crm/funnel-stages');
      setStages(response.data);
    } catch (err) {
      console.error('Erro ao buscar etapas:', err);
      alert('Erro ao buscar etapas.');
    }
  }

  // Buscar etapas ao carregar a página
  useEffect(() => {
    fetchStages();
  }, []);

  async function handleCreateStage(e: React.FormEvent) {
    e.preventDefault();
    try {
      const newStage = {
        name,
        promptInstructions: prompt,
        order: stages.length, // Ordem simples por enquanto
      };
      await api.post('/crm/funnel-stages', newStage);
      
      // Limpa o form, fecha o modal e atualiza a lista
      setName('');
      setPrompt('');
      setIsModalOpen(false);
      fetchStages(); // Re-busca da API
    } catch (err) {
      console.error('Erro ao criar etapa:', err);
      alert('Erro ao criar etapa.');
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Configurações</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Coluna 1: Conexão */}
        <WhatsappConnector />
        
        {/* Coluna 2: Gerenciamento do Funil */}
        <div className="bg-white p-6 rounded-lg shadow-md">
           <div className="flex justify-between items-center mb-4">
             <h2 className="text-xl font-semibold">Etapas do Funil</h2>
             <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
             >
                + Nova Etapa
             </button>
           </div>
           
           {/* Lista de Etapas */}
           <ul className="space-y-2">
            {stages.map(stage => (
              <li key={stage._id} className="p-3 bg-gray-50 rounded border">
                <strong>{stage.name}</strong> (Ordem: {stage.order})
                <p className="text-sm text-gray-600 truncate">{stage.promptInstructions}</p>
              </li>
            ))}
           </ul>
        </div>
      </div>

      {/* Modal de Criação de Etapa */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Criar Nova Etapa do Funil"
      >
        <form onSubmit={handleCreateStage}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Nome da Etapa</label>
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Instruções para IA (Prompt)</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-2 border rounded"
              rows={4}
              required
            />
          </div>
          <div className="text-right">
            <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
              Salvar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}