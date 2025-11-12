import axios from 'axios';

// Cria uma instância do Axios pré-configurada
export const api = axios.create({
  baseURL: 'http://localhost:3000', // URL do nosso backend
  // headers: { 'Authorization': 'Bearer SEU_TOKEN_AQUI' } // TODO: Adicionar o token do AuthModule
});