import React, { useState } from 'react';
import { DocumentData, EditorActionType, AppTheme } from '../types';
import { processDocumentAction } from '../services/geminiService';
import { Button } from './Button';
import { Wand2, SpellCheck, FileText, Briefcase, Languages, Save, RotateCcw } from 'lucide-react';

interface DocumentEditorProps {
  document: DocumentData;
  onUpdate: (doc: DocumentData) => void;
  theme?: AppTheme;
}

export const DocumentEditor: React.FC<DocumentEditorProps> = ({ document, onUpdate, theme = 'blue' }) => {
  const [content, setContent] = useState(document.content);
  const [isProcessing, setIsProcessing] = useState<EditorActionType | null>(null);
  const [lastSaved, setLastSaved] = useState(document.lastModified);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleSave = () => {
    onUpdate({
      ...document,
      content,
      lastModified: Date.now(),
    });
    setLastSaved(Date.now());
  };

  const handleAIAction = async (action: EditorActionType) => {
    if (!content.trim()) return;

    setIsProcessing(action);
    try {
      const result = await processDocumentAction(action, content);
      
      let newContent = content;
      if (action === EditorActionType.SUMMARIZE) {
        newContent = `${content}\n\n--- AI Summary ---\n${result}`;
      } else if (action === EditorActionType.TRANSLATE_ES) {
        newContent = `${content}\n\n--- Spanish Translation ---\n${result}`;
      } else {
        newContent = result;
      }
      
      setContent(newContent);
    } catch (error) {
      alert("Failed to process AI action. Please try again.");
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Toolbar */}
      <div className="px-6 py-3 border-b border-slate-100 bg-white flex flex-wrap gap-2 items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-2">Magic Actions:</span>
          
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => handleAIAction(EditorActionType.SUMMARIZE)}
            isLoading={isProcessing === EditorActionType.SUMMARIZE}
            className="whitespace-nowrap"
            theme={theme}
          >
            <FileText className="w-3.5 h-3.5 mr-1.5" />
            Summarize
          </Button>

          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => handleAIAction(EditorActionType.FIX_GRAMMAR)}
            isLoading={isProcessing === EditorActionType.FIX_GRAMMAR}
            className="whitespace-nowrap"
            theme={theme}
          >
            <SpellCheck className="w-3.5 h-3.5 mr-1.5" />
            Fix Grammar
          </Button>

          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => handleAIAction(EditorActionType.EXPAND)}
            isLoading={isProcessing === EditorActionType.EXPAND}
            className="whitespace-nowrap"
            theme={theme}
          >
            <Wand2 className="w-3.5 h-3.5 mr-1.5" />
            Expand
          </Button>

          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => handleAIAction(EditorActionType.MAKE_PROFESSIONAL)}
            isLoading={isProcessing === EditorActionType.MAKE_PROFESSIONAL}
            className="whitespace-nowrap"
            theme={theme}
          >
            <Briefcase className="w-3.5 h-3.5 mr-1.5" />
            Professional
          </Button>

           <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => handleAIAction(EditorActionType.TRANSLATE_ES)}
            isLoading={isProcessing === EditorActionType.TRANSLATE_ES}
            className="whitespace-nowrap"
            theme={theme}
          >
            <Languages className="w-3.5 h-3.5 mr-1.5" />
            Translate
          </Button>
        </div>

        <div className="flex items-center gap-2 pl-4 border-l border-slate-200 ml-auto">
             <span className="text-xs text-slate-400 hidden md:inline">
                Last saved: {new Date(lastSaved).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <Button variant="ghost" size="sm" onClick={() => setContent(document.content)} title="Revert Changes" theme={theme}>
                <RotateCcw className="w-4 h-4" />
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave} theme={theme}>
                <Save className="w-4 h-4 mr-1.5" />
                Save
            </Button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 bg-slate-50 overflow-hidden relative">
        <textarea
            className="w-full h-full p-8 bg-white focus:outline-none resize-none text-slate-800 text-base leading-7 font-serif"
            value={content}
            onChange={handleContentChange}
            placeholder="Start writing here... Use the magic tools above to enhance your writing."
            disabled={isProcessing !== null}
        />
        {isProcessing && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="bg-white p-4 rounded-xl shadow-xl flex flex-col items-center animate-bounce-slight">
                    <Wand2 className={`w-8 h-8 text-${theme}-600 mb-2 animate-pulse`} />
                    <p className="text-slate-800 font-medium">Gemini is working...</p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
