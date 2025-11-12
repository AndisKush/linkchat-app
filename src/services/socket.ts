import { io } from 'socket.io-client';

// URL do seu backend NestJS
const URL = 'http://localhost:3000';

// Cria a instância do socket
export const socket = io(URL, {
  autoConnect: true, // Conecta automaticamente ao carregar a app
});