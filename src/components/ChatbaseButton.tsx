import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export default function ChatbaseButton() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all"
      >
        {isOpen ? (
          <>
            <X className="w-5 h-5" />
            <span>Fechar Chat</span>
          </>
        ) : (
          <>
            <MessageCircle className="w-5 h-5" />
            <span>Abrir Chat AI</span>
          </>
        )}
      </button>

      {/* Chat iframe */}
      {isOpen && (
        <div className="fixed top-24 right-4 z-50 bg-white rounded-lg shadow-2xl">
          <iframe
            src="https://www.chatbase.co/chatbot-iframe/PtTs0I_Lx3Cepgcx3kQLp"
            width="400"
            height="500"
            className="rounded-lg"
          ></iframe>
        </div>
      )}
    </>
  );
}
