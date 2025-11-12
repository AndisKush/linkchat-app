import { socket } from './socket';

// 1. Onde vamos guardar o estado globalmente
let currentState = {
  status: 'Conectando ao servidor...',
  qr: null as string | null,
};

// 2. Uma lista de "ouvintes" (nossos componentes React)
const subscribers = new Set<(state: typeof currentState) => void>();

// 3. Função para notificar os componentes sobre mudanças
function notify() {
  subscribers.forEach((callback) => callback(currentState));
}

// 4. Ouvir os eventos do socket UMA VEZ e atualizar o estado global
socket.on('connect', () => {
  currentState = { ...currentState, status: 'Servidor conectado. Aguardando WhatsApp...' };
  notify();
});

socket.on('disconnect', () => {
  currentState = { ...currentState, status: 'Servidor desconectado.' };
  notify();
});

socket.on('qr_code', (data: { qr: string }) => {
  currentState = { status: 'Escaneie o QR Code para conectar!', qr: data.qr };
  notify();
});

socket.on('whatsapp_ready', (data: { message: string }) => {
  currentState = { status: `🚀 ${data.message}`, qr: null };
  notify();
});

socket.on('whatsapp_disconnected', (data: { message: string }) => {
  currentState = { status: `🔌 ${data.message}`, qr: null };
  notify();
});

// 5. O "serviço" que nossos componentes vão usar
export const whatsappStore = {
  // Permite que um componente se inscreva
  subscribe(callback: (state: typeof currentState) => void) {
    subscribers.add(callback);
    callback(currentState); // Envia o estado atual imediatamente
    
    // Retorna a função de "limpeza" (unsubscribe)
    return () => {subscribers.delete(callback)};
  },
  
  // Permite que um componente pegue o estado atual (para o F5)
  getState() {
    return currentState;
  }
};