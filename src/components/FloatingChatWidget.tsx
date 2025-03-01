import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Upload, Bot, User, Send, Minimize, Maximize, RefreshCw } from 'lucide-react';
import { generateChatResponse } from '../utils/geminiAI';
import { useData } from '../context/DataContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const FloatingChatWidget: React.FC = () => {
  const { data, insights } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dataset, setDataset] = useState<any[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (data && !dataset) {
      setDataset(data);
      setMessages([{
        role: 'assistant',
        content: `Dataset loaded! I can help you analyze ${data.length} records with columns: ${Object.keys(data[0]).join(', ')}\n\nAvailable insights:\n${insights.map((insight, i) => `${i + 1}. ${insight}`).join('\n')}`
      }]);
    }
  }, [data, insights]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      setDataset(data);
      
      setMessages([{
        role: 'assistant',
        content: `Dataset loaded successfully! I can help you analyze ${data.length} records with columns: ${Object.keys(data[0]).join(', ')}`
      }]);
    } catch (error) {
      setMessages([{
        role: 'assistant',
        content: 'Error loading dataset. Please make sure it\'s a valid JSON file.'
      }]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !dataset || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await generateChatResponse(userMessage, dataset, insights);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error analyzing the data.'
      }]);
    } finally {
      setIsLoading(false);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-indigo-600 text-white rounded-full p-4 shadow-lg hover:bg-indigo-700 transition-all duration-200"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat Widget */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-[380px] max-h-[600px] flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-indigo-500 to-purple-500 rounded-t-2xl">
            <div className="flex items-center gap-2 text-white">
              <Bot className="h-5 w-5" />
              <span className="font-semibold">AI Data Assistant</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <Minimize className="h-5 w-5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {!dataset && (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-500">
                <Upload className="h-12 w-12" />
                <p className="text-center">Upload a JSON dataset to start analyzing</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Upload Dataset
                </button>
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-2 ${
                  message.role === 'assistant' ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                <div className={`p-3 rounded-xl max-w-[80%] ${
                  message.role === 'assistant'
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-indigo-600 text-white'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                {message.role === 'assistant' ? (
                  <Bot className="h-5 w-5 text-gray-500" />
                ) : (
                  <User className="h-5 w-5 text-indigo-600" />
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-gray-500">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span className="text-sm">Analyzing data...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={dataset ? "Ask about your data..." : "Upload a dataset first"}
                disabled={!dataset}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm disabled:bg-gray-100"
              />
              <button
                type="submit"
                disabled={!dataset || !input.trim() || isLoading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".json"
            className="hidden"
          />
        </div>
      )}
    </div>
  );
};

export default FloatingChatWidget; 