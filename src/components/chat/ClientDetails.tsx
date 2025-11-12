import { useEffect, useState } from 'react';
import { api } from '../../services/api';

// Tipos completos vindos da API
type FunnelStage = {
  _id: string;
  name: string;
};

type ClientDetails = {
  _id: string;
  name: string;
  phone: string;
  category: string;
  currentStage: FunnelStage;
};

type ClientDetailsProps = {
  clientId: string;
};

export function ClientDetails({ clientId }: ClientDetailsProps) {
  const [client, setClient] = useState<ClientDetails | null>(null);
  const [allStages, setAllStages] = useState<FunnelStage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Função para buscar dados
  async function fetchData() {
    if (!clientId) return;
    setIsLoading(true);
    try {
      const [clientRes, stagesRes] = await Promise.all([
        api.get<ClientDetails>(`/crm/clients/${clientId}`),
        api.get<FunnelStage[]>('/crm/funnel-stages'),
      ]);
      setClient(clientRes.data);
      setAllStages(stagesRes.data);
    } catch (err) {
      console.error('Erro ao buscar detalhes:', err);
    } finally {
      setIsLoading(false);
    }
  }

  // Busca os dados quando o ID do cliente muda
  useEffect(() => {
    fetchData();
  }, [clientId]);

  // Função para MUDAR A ETAPA
  async function handleStageChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStageId = e.target.value;
    if (!client) return;

    try {
      // Faz o PATCH na API
      const response = await api.patch<ClientDetails>(
        `/crm/clients/${client._id}/stage`, 
        { newStageId }
      );
      // Atualiza o estado local com a resposta da API
      setClient(response.data);
      alert('Etapa atualizada!');
    } catch (err) {
      console.error('Erro ao atualizar etapa:', err);
      alert('Erro ao atualizar etapa.');
    }
  }

  if (isLoading) return <div className="p-4">Carregando...</div>;
  if (!client) return null;

  return (
    <div className="p-6 space-y-4">
      <h3 className="text-xl font-semibold">{client.name}</h3>
      
      <div>
        <label className="text-sm font-medium text-gray-500">Telefone</label>
        <p>{client.phone}</p>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-500">Categoria</label>
        <p>{client.category}</p>
      </div>
      
      {/* O SELETOR DE ETAPA (Status) */}
      <div>
        <label className="text-sm font-medium text-gray-500">Etapa do Funil</label>
        <select 
          value={client.currentStage._id}
          onChange={handleStageChange}
          className="w-full p-2 border rounded mt-1"
        >
          {allStages.map(stage => (
            <option key={stage._id} value={stage._id}>
              {stage.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}