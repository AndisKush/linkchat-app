import { useEffect, useState } from 'react';
import { Modal } from '../components/Modal';
import { api } from '../services/api';

// Tipos de dados (ajude o TypeScript)
type FunnelStage = {
  _id: string;
  name: string;
};

type Client = {
  _id: string;
  name: string;
  phone: string;
  category: string;
  currentStage: FunnelStage;
};

export function Clientes() {
  const [clients, setClients] = useState<Client[]>([]);
  const [stages, setStages] = useState<FunnelStage[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estados do formulário de cliente
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('');
  const [initialStageId, setInitialStageId] = useState('');

  // Função para buscar clientes e etapas
  async function fetchData() {
    try {
      const [clientsRes, stagesRes] = await Promise.all([
        api.get('/crm/clients'),
        api.get('/crm/funnel-stages'),
      ]);
      setClients(clientsRes.data);
      setStages(stagesRes.data);
      
      // Define a etapa inicial padrão se ela existir
      if (stagesRes.data.length > 0) {
        setInitialStageId(stagesRes.data[0]._id);
      }
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
      alert('Erro ao buscar dados.');
    }
  }

  // Buscar dados ao carregar a página
  useEffect(() => {
    fetchData();
  }, []);

  async function handleCreateClient(e: React.FormEvent) {
    e.preventDefault();
    try {
      const newClient = { name, phone, category, initialStageId };
      await api.post('/crm/clients', newClient);
      
      setIsModalOpen(false);
      fetchData(); // Re-busca
      // Limpa o form
      setName(''); setPhone(''); setCategory('');
    } catch (err) {
      console.error('Erro ao criar cliente:', err);
      alert('Erro ao criar cliente.');
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Meus Clientes</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Novo Cliente
        </button>
      </div>

      {/* Tabela/Lista de Clientes */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3">Nome</th>
              <th className="text-left p-3">Telefone</th>
              <th className="text-left p-3">Categoria</th>
              <th className="text-left p-3">Etapa Atual</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(client => (
              <tr key={client._id} className="hover:bg-gray-50 border-b">
                <td className="p-3">{client.name}</td>
                <td className="p-3">{client.phone}</td>
                <td className="p-3">{client.category}</td>
                <td className="p-3">
                  <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-sm">
                    {client.currentStage.name}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Criação de Cliente */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Criar Novo Cliente"
      >
        <form onSubmit={handleCreateClient}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Nome</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Telefone (Ex: +5534999998888)</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-2 border rounded" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Categoria</label>
            <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 border rounded" placeholder="Ex: Salão de Beleza" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Etapa Inicial</label>
            <select value={initialStageId} onChange={(e) => setInitialStageId(e.target.value)} className="w-full p-2 border rounded" required>
              {stages.map(stage => (
                <option key={stage._id} value={stage._id}>{stage.name}</option>
              ))}
            </select>
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