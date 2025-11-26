
import React, { useState, useRef, useEffect } from 'react';
import { Message, UserProfile } from '../types';
import { Send, Bot, User, Trash2, StopCircle } from 'lucide-react';
import { streamChatResponse } from '../services/geminiService';
import { Button } from './Button';

interface ChatInterfaceProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  userProfile?: UserProfile;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, setMessages, userProfile }) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const theme = userProfile?.theme || 'blue';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const botMsgId = (Date.now() + 1).toString();
    const initialBotMsg: Message = {
      id: botMsgId,
      role: 'model',
      text: '', // Start empty for streaming
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, initialBotMsg]);

    try {
      // Prepare history for API (excluding the current user message which is sent as 'message' param)
      const apiHistory = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      // Pass userProfile to the service
      const stream = streamChatResponse(apiHistory, userMsg.text, userProfile);

      let accumulatedText = "";
      
      for await (const chunk of stream) {
        accumulatedText += chunk;
        setMessages((prev) => 
          prev.map((msg) => 
            msg.id === botMsgId ? { ...msg, text: accumulatedText } : msg
          )
        );
      }

    } catch (error) {
      setMessages((prev) => 
        prev.map((msg) => 
          msg.id === botMsgId 
            ? { ...msg, text: "Sorry, I encountered an error while processing your request.", isError: true } 
            : msg
        )
      );
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
        <div>
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <Bot className={`w-5 h-5 text-${theme}-600`} />
            AI Chat Assistant
          </h2>
          <p className="text-xs text-slate-500">Powered by Gemini 3 Pro</p>
        </div>
        <Button variant="ghost" size="sm" onClick={clearChat} title="Clear history" theme={theme}>
            <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 opacity-60">
            <Bot className="w-16 h-16 mb-4" />
            <p className="text-lg font-medium">How can I help you today{userProfile?.name ? `, ${userProfile.name}` : ''}?</p>
            <p className="text-sm">Ask me anything about code, analysis, or general knowledge.</p>
          </div>
        )}
        
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`flex max-w-[85%] md:max-w-[70%] gap-3 ${
                msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user' ? `bg-${theme}-600` : 'bg-slate-700'
                }`}
              >
                {msg.role === 'user' ? (
                  <User className="w-5 h-5 text-white" />
                ) : (
                  <Bot className="w-5 h-5 text-white" />
                )}
              </div>

              <div
                className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? `bg-${theme}-600 text-white rounded-br-none shadow-md`
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'
                } ${msg.isError ? 'border-red-300 bg-red-50 text-red-800' : ''}`}
              >
                {msg.text}
                {msg.role === 'model' && isTyping && msg.id === messages[messages.length - 1].id && msg.text.length === 0 && (
                   <span className="animate-pulse">Thinking...</span>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        <div className="relative flex items-end gap-2 max-w-4xl mx-auto">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className={`w-full p-3 pr-12 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-${theme}-500 focus:border-transparent resize-none max-h-32 min-h-[50px] text-sm`}
            rows={1}
            disabled={isTyping}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="absolute right-2 bottom-2 !p-2 rounded-lg"
            variant="primary"
            theme={theme}
          >
            {isTyping ? <StopCircle className="w-5 h-5" /> : <Send className="w-5 h-5" />}
          </Button>
        </div>
        <p className="text-center text-xs text-slate-400 mt-2">
            AI can make mistakes. Please verify important information.
        </p>
      </div>
    </div>
  );
};
