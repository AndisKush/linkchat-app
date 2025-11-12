import type { PropsWithChildren } from 'react';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
};

export function Modal({ isOpen, onClose, title, children }: PropsWithChildren<ModalProps>) {
  if (!isOpen) return null;

  return (
    // Overlay (fundo escuro)
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Conteúdo do Modal */}
      <div 
        className="bg-white p-6 rounded-lg shadow-xl z-50 w-full max-w-lg"
        onClick={(e) => e.stopPropagation()} // Impede de fechar ao clicar dentro
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{title}</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-800 text-3xl"
          >
            &times;
          </button>
        </div>
        {/* Formulário ou conteúdo vai aqui */}
        {children}
      </div>
    </div>
  );
}