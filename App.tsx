import React, { useState, useEffect } from 'react';
import { AppView, Message, DocumentData, UserProfile } from './types';
import { ChatInterface } from './components/ChatInterface';
import { DocumentEditor } from './components/DocumentEditor';
import { ProfileSettings } from './components/ProfileSettings';
import { MessageSquare, FileText, Sparkles, LogOut, Github, Settings, User } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.CHAT);
  
  // User Profile State with Persistence
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('nexgen_user_profile');
    return saved ? JSON.parse(saved) : {
      name: '',
      language: 'English',
      responseStyle: 'Default',
      customInstructions: ''
    };
  });

  useEffect(() => {
    localStorage.setItem('nexgen_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  // Chat State
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      text: 'Hello! I am your AI assistant powered by Gemini 3 Pro. I can help you write code, analyze text, or draft documents. How can I help you today?',
      timestamp: Date.now(),
    },
  ]);

  // Document State (Mock single document for demo)
  const [currentDoc, setCurrentDoc] = useState<DocumentData>({
    id: '1',
    title: 'Untitled Note',
    content: 'Welcome to NexGen Workspace.\n\nStart typing here, then use the Magic Actions above to have Gemini Flash summarize, rewrite, or fix your grammar instantly.',
    lastModified: Date.now(),
  });

  const renderContent = () => {
    switch (currentView) {
      case AppView.CHAT:
        return <ChatInterface messages={messages} setMessages={setMessages} userProfile={userProfile} />;
      case AppView.EDITOR:
        return <DocumentEditor document={currentDoc} onUpdate={setCurrentDoc} />;
      case AppView.SETTINGS:
        return <ProfileSettings userProfile={userProfile} onUpdate={setUserProfile} />;
      default:
        return <ChatInterface messages={messages} setMessages={setMessages} userProfile={userProfile} />;
    }
  };

  const getHeaderTitle = () => {
    switch (currentView) {
      case AppView.CHAT: return 'Chat Workspace';
      case AppView.EDITOR: return 'Document Editor';
      case AppView.SETTINGS: return 'Profile & Settings';
      default: return 'NexGen AI';
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-20 lg:w-64 bg-slate-900 text-slate-300 flex flex-col flex-shrink-0 transition-all duration-300">
        <div className="p-4 lg:p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-900/20">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <span className="font-bold text-white text-lg tracking-tight hidden lg:block">NexGen</span>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          <button
            onClick={() => setCurrentView(AppView.CHAT)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
              currentView === AppView.CHAT
                ? 'bg-blue-600 text-white shadow-md'
                : 'hover:bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium hidden lg:block">Chat Assistant</span>
            {currentView === AppView.CHAT && (
                <div className="ml-auto w-2 h-2 rounded-full bg-white/30 hidden lg:block" />
            )}
          </button>

          <button
            onClick={() => setCurrentView(AppView.EDITOR)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
              currentView === AppView.EDITOR
                ? 'bg-emerald-600 text-white shadow-md'
                : 'hover:bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium hidden lg:block">Smart Editor</span>
            {currentView === AppView.EDITOR && (
                <div className="ml-auto w-2 h-2 rounded-full bg-white/30 hidden lg:block" />
            )}
          </button>

          <button
            onClick={() => setCurrentView(AppView.SETTINGS)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
              currentView === AppView.SETTINGS
                ? 'bg-purple-600 text-white shadow-md'
                : 'hover:bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium hidden lg:block">Settings</span>
            {currentView === AppView.SETTINGS && (
                <div className="ml-auto w-2 h-2 rounded-full bg-white/30 hidden lg:block" />
            )}
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => setCurrentView(AppView.SETTINGS)}
            className="flex w-full items-center gap-3 px-3 py-3 text-slate-400 hover:text-white transition-colors cursor-pointer hover:bg-slate-800 rounded-xl text-left"
          >
             <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-slate-300" />
             </div>
             <div className="hidden lg:block overflow-hidden">
                <p className="text-sm font-medium text-slate-200 truncate">{userProfile.name || 'User Account'}</p>
                <p className="text-xs text-slate-500 truncate">Pro Plan</p>
             </div>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0">
          <h1 className="text-xl font-bold text-slate-800">
            {getHeaderTitle()}
          </h1>
          <div className="flex items-center gap-4">
             <span className="text-xs font-medium px-2 py-1 rounded bg-purple-50 text-purple-700 border border-purple-100 hidden sm:block">
                Gemini Models Active
             </span>
          </div>
        </header>

        <div className="flex-1 p-4 lg:p-6 overflow-hidden">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;