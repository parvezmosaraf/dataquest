import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, RefreshCw, Sparkles, Info } from 'lucide-react';
import { useData } from '../context/DataContext';
import { generateChatResponse } from '../utils/geminiAI';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AiChatBox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data, insights } = useData();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (insights.length > 0 && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: `I've analyzed your data and found some interesting insights! Feel free to ask me about:\n\n${
          insights.map((insight, index) => `${index + 1}. ${insight}`).join('\n')
        }\n\nWhat would you like to know more about?`
      }]);
    }
  }, [insights]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await generateChatResponse(userMessage, data, insights);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response
      }]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your request.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mt-8 relative backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl opacity-50" />
      
      <div className="relative">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Bot className="h-5 w-5 text-indigo-600" />
          </div>
          <span>AI Assistant</span>
          <div className="ml-auto flex items-center gap-2">
            <Info className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-500 font-normal">
              {insights.length} insights available
            </span>
          </div>
          <Sparkles className="h-5 w-5 text-yellow-500" />
        </h2>
        
        <div className="h-[350px] custom-scrollbar mb-6 space-y-4 pr-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-3">
              <Bot className="h-12 w-12 text-gray-400" />
              <p className="text-sm">Ask me anything about your data!</p>
            </div>
          )}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                message.role === 'assistant' ? 'flex-row' : 'flex-row-reverse'
              }`}
            >
              <div className={`p-3 rounded-2xl max-w-[85%] shadow-sm ${
                message.role === 'assistant' 
                  ? 'bg-gray-50 text-gray-800 border border-gray-100' 
                  : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
              }`}>
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
              {message.role === 'assistant' ? (
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Bot className="h-4 w-4 text-gray-600" />
                </div>
              ) : (
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <User className="h-4 w-4 text-indigo-600" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-3 text-gray-500 bg-gray-50 p-3 rounded-2xl w-fit">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span className="text-sm">Processing your request...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="flex gap-3 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your data analysis..."
            className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 placeholder-gray-400"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all duration-200 hover:shadow-md"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AiChatBox; 