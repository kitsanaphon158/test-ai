
import React, { useState, useEffect } from 'react';
import { UserProfile, ResponseStyle, AppTheme } from '../types';
import { Button } from './Button';
import { UserCog, Save, Globe, MessageSquare, User, Palette } from 'lucide-react';

interface ProfileSettingsProps {
  userProfile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
}

const themeOptions: { value: AppTheme; label: string; color: string }[] = [
  { value: 'blue', label: 'Ocean Blue', color: 'bg-blue-600' },
  { value: 'violet', label: 'Royal Violet', color: 'bg-violet-600' },
  { value: 'emerald', label: 'Forest Green', color: 'bg-emerald-600' },
  { value: 'orange', label: 'Sunset Orange', color: 'bg-orange-600' },
  { value: 'rose', label: 'Berry Rose', color: 'bg-rose-600' },
  { value: 'slate', label: 'Corporate Grey', color: 'bg-slate-600' },
];

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ userProfile, onUpdate }) => {
  const [formData, setFormData] = useState<UserProfile>(userProfile);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setFormData(userProfile);
  }, [userProfile]);

  const handleChange = (field: keyof UserProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto h-full overflow-y-auto p-4 md:p-8">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100">
          <div className={`w-12 h-12 bg-${formData.theme}-50 text-${formData.theme}-600 rounded-xl flex items-center justify-center transition-colors`}>
            <UserCog className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">User Profile & AI Settings</h2>
            <p className="text-slate-500">Customize how Gemini interacts with you across the workspace.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Identity Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" />
              Identity
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-slate-700">Display Name</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={`w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-${formData.theme}-500 focus:border-transparent outline-none transition-all`}
                  placeholder="e.g. Alex"
                />
                <p className="text-xs text-slate-400">The AI will use this name to address you.</p>
              </div>
            </div>
          </div>

          {/* Theme Section */}
           <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Palette className="w-4 h-4 text-slate-400" />
              Visual Theme
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {themeOptions.map((theme) => (
                <button
                  key={theme.value}
                  type="button"
                  onClick={() => handleChange('theme', theme.value)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                    formData.theme === theme.value
                      ? `border-${theme.value}-500 bg-${theme.value}-50 ring-1 ring-${theme.value}-500`
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full ${theme.color} shadow-sm`} />
                  <span className={`text-xs font-medium ${formData.theme === theme.value ? `text-${theme.value}-700` : 'text-slate-600'}`}>
                    {theme.label.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>


          {/* Preferences Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-slate-400" />
              Communication Preferences
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="language" className="block text-sm font-medium text-slate-700 flex items-center gap-1">
                  <Globe className="w-3 h-3" /> Preferred Language
                </label>
                <input
                  type="text"
                  id="language"
                  value={formData.language}
                  onChange={(e) => handleChange('language', e.target.value)}
                  className={`w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-${formData.theme}-500 focus:border-transparent outline-none transition-all`}
                  placeholder="e.g. English, Spanish, Japanese, Thai"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="style" className="block text-sm font-medium text-slate-700">Response Style</label>
                <select
                  id="style"
                  value={formData.responseStyle}
                  onChange={(e) => handleChange('responseStyle', e.target.value as ResponseStyle)}
                  className={`w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-${formData.theme}-500 focus:border-transparent outline-none transition-all`}
                >
                  <option value="Default">Default (Balanced)</option>
                  <option value="Formal">Formal & Professional</option>
                  <option value="Casual">Casual & Friendly</option>
                  <option value="Concise">Concise (Short & Direct)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Context Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">Custom Instructions</h3>
            <div className="space-y-2">
              <label htmlFor="instructions" className="block text-sm font-medium text-slate-700">
                What else should the AI know about you?
              </label>
              <textarea
                id="instructions"
                value={formData.customInstructions}
                onChange={(e) => handleChange('customInstructions', e.target.value)}
                rows={4}
                className={`w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-${formData.theme}-500 focus:border-transparent outline-none transition-all resize-none`}
                placeholder="e.g. I am a software engineer specializing in React. I prefer technical explanations. I am working on a marketing project."
              />
              <p className="text-xs text-slate-400">These instructions will be added to the system context for every chat.</p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-4">
             {isSaved && <span className="text-emerald-600 text-sm font-medium animate-fade-in">Settings saved successfully!</span>}
             <Button type="submit" variant="primary" size="lg" theme={formData.theme}>
                <Save className="w-4 h-4 mr-2" />
                Save Profile
             </Button>
          </div>

        </form>
      </div>
    </div>
  );
};
