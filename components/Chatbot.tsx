import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import ChatIcon from './icons/ChatIcon';
import CloseIcon from './icons/CloseIcon';
import SendIcon from './icons/SendIcon';
import { SHECARE_SYSTEM_PROMPT } from '../system-prompt';

interface Message {
  text: string;
  sender: 'user' | 'ai';
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the bottom of the chat window when new messages are added
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add initial greeting message when chat opens for the first time
      setMessages([{
        sender: 'ai',
        text: "Hello! I'm SheCare, your personal wellness assistant from SheCareHub. How can I help you today? 🌸"
      }]);
    }
  }, [isOpen]);


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = userInput.trim();
    if (!trimmedInput || isLoading) return;

    const newMessages: Message[] = [...messages, { text: trimmedInput, sender: 'user' }];
    setMessages(newMessages);
    setUserInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: trimmedInput,
        config: {
          systemInstruction: SHECARE_SYSTEM_PROMPT,
        },
      });
      
      const aiResponse = response.text;
      setMessages([...newMessages, { text: aiResponse, sender: 'ai' }]);
    } catch (error) {
      console.error('Gemini API error:', error);
      setMessages([...newMessages, { text: "I'm having a little trouble connecting right now. Please try again in a moment.", sender: 'ai' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Bubble */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-accent text-surface w-16 h-16 rounded-full shadow-lg flex items-center justify-center transform transition-all duration-300 ease-in-out hover:scale-110 hover:bg-accent-hover"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <CloseIcon className="w-8 h-8"/> : <ChatIcon className="w-8 h-8"/>}
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-full max-w-sm h-[70vh] max-h-[600px] bg-surface rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ease-in-out origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
        }`}
        role="dialog"
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className="p-4 bg-surface/80 backdrop-blur-sm border-b border-border-color rounded-t-2xl">
          <h3 className="text-lg font-semibold text-text-primary text-center font-heading">SheCare Assistant 💛</h3>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto no-scrollbar">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xs md:max-w-md lg:max-w-xs rounded-xl px-4 py-2 text-sm ${
                    msg.sender === 'user'
                      ? 'bg-accent text-surface'
                      : 'bg-border-color/40 text-text-primary'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                  <div className="bg-border-color/40 text-text-primary rounded-xl px-4 py-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-text-secondary rounded-full animate-pulse delay-75"></span>
                      <span className="w-2 h-2 bg-text-secondary rounded-full animate-pulse delay-150"></span>
                      <span className="w-2 h-2 bg-text-secondary rounded-full animate-pulse delay-300"></span>
                  </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Form */}
        <div className="p-4 border-t border-border-color bg-surface/80 backdrop-blur-sm rounded-b-2xl">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ask me anything..."
              className="w-full bg-border-color/20 border border-border-color rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all text-sm"
              disabled={isLoading}
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={isLoading || !userInput.trim()}
              className="bg-accent text-surface p-2.5 rounded-full transform transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
              aria-label="Send message"
            >
              <SendIcon className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Chatbot;