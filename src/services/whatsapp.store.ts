import { socket } from "./socket";

type WhatsappState = {
  status: string;
  qr: string | null;
  isReady: boolean;
};

let currentState: WhatsappState = {
  status: "Conectando ao servidor...",
  qr: null,
  isReady: false,
};

// 2. Uma lista de "ouvintes" (nossos componentes React)
const subscribers = new Set<(state: typeof currentState) => void>();

// 3. Função para notificar os componentes sobre mudanças
function notify() {
  subscribers.forEach((callback) => callback(currentState));
}

// 4. Ouvir os eventos do socket UMA VEZ e atualizar o estado global
socket.on("connect", () => {
  currentState = {
    ...currentState,
    status: "Servidor conectado. Aguardando WhatsApp...",
    isReady: false,
  };
  notify();
});

socket.on("disconnect", () => {
  currentState = { status: "Servidor desconectado.", qr: null, isReady: false };
  notify();
});

socket.on("qr_code", (data: { qr: string }) => {
  currentState = {
    status: "Escaneie o QR Code para conectar!",
    qr: data.qr,
    isReady: false,
  };
  notify();
});

socket.on("whatsapp_ready", (data: { message: string }) => {
  currentState = { status: `🚀 ${data.message}`, qr: null, isReady: true };
  notify();
});

socket.on("whatsapp_disconnected", (data: { message: string }) => {
  currentState = { status: `🔌 ${data.message}`, qr: null, isReady: false };
  notify();
});

// 5. O "serviço" que nossos componentes vão usar
export const whatsappStore = {
  subscribe(callback: (state: WhatsappState) => void) {
    subscribers.add(callback);
    callback(currentState);

    return () => subscribers.delete(callback);
  },

  getState() {
    return currentState;
  },
};
