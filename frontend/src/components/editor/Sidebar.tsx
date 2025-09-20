import { useEffect, useState } from "react";
import { api } from "../../lib/api";

type Item = { id: string; title?: string; name?: string };

interface SidebarProps {
  onDialogueSelect?: (dialogueId: string) => void;
}

export default function Sidebar({ onDialogueSelect }: SidebarProps) {
  const [scenes, setScenes] = useState<Item[]>([]);
  const [characters, setCharacters] = useState<Item[]>([]);
  const [dialogues, setDialogues] = useState<Item[]>([]);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    scenes: true,
    characters: true,
    dialogues: true,
  });

  useEffect(() => {
    // Mock or API: using existing endpoints where possible
    api.get<Item[]>("/dialogues/").then((r) => setDialogues(r.data)).catch(() => {});
    api.get<Item[]>("/characters/").then((r) => setCharacters(r.data)).catch(() => {});
    // scenes not implemented server-side yet; keep empty or mock
  }, []);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="h-full flex flex-col p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
        <h1 className="text-xl font-bold mb-2">Nexus Editor</h1>
        <p className="text-sm opacity-90">Visual Novel Creator</p>
        <div className="w-12 h-1 bg-white/30 rounded-full mt-3"></div>
      </div>

      {/* Scenes Section */}
      <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-600/50 rounded-2xl overflow-hidden shadow-lg">
        <button
          onClick={() => toggleSection("scenes")}
          className="w-full px-6 py-4 flex items-center justify-between text-white hover:bg-gray-700/50 transition-all duration-300 group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <span className="text-lg">🎬</span>
            </div>
            <div>
              <span className="font-bold text-lg">Scenes</span>
              <div className="text-xs text-gray-400">Story sequences</div>
            </div>
            <span className="text-xs bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full border border-blue-500/30">{scenes.length}</span>
          </div>
          <span className={`transform transition-transform duration-300 ${expandedSections.scenes ? "rotate-180" : ""}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </button>
        {expandedSections.scenes && (
          <div className="px-6 pb-6 border-t border-gray-600/30">
            <div className="max-h-40 overflow-auto space-y-2 mt-4">
              {scenes.length === 0 ? (
                <div className="text-center py-6 text-gray-400">
                  <div className="w-16 h-16 mx-auto mb-3 bg-gray-700/50 rounded-2xl flex items-center justify-center">
                    <span className="text-2xl">🎬</span>
                  </div>
                  <p className="mb-4 font-medium">No scenes yet</p>
                  <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-sm rounded-xl transition-all duration-200 hover:scale-105 shadow-lg">
                    + Add Scene
                  </button>
                </div>
              ) : (
                scenes.map(s => (
                  <div key={s.id} className="group flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-700/50 cursor-pointer transition-all duration-200 border border-transparent hover:border-gray-600/30">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full shadow-lg"></div>
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors font-medium">{s.title || s.name}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Characters Section */}
      <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-600/50 rounded-2xl overflow-hidden shadow-lg">
        <button
          onClick={() => toggleSection("characters")}
          className="w-full px-6 py-4 flex items-center justify-between text-white hover:bg-gray-700/50 transition-all duration-300 group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <span className="text-lg">👥</span>
            </div>
            <div>
              <span className="font-bold text-lg">Characters</span>
              <div className="text-xs text-gray-400">Story personas</div>
            </div>
            <span className="text-xs bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30">{characters.length}</span>
          </div>
          <span className={`transform transition-transform duration-300 ${expandedSections.characters ? "rotate-180" : ""}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </button>
        {expandedSections.characters && (
          <div className="px-6 pb-6 border-t border-gray-600/30">
            <div className="max-h-40 overflow-auto space-y-2 mt-4">
              {characters.length === 0 ? (
                <div className="text-center py-6 text-gray-400">
                  <div className="w-16 h-16 mx-auto mb-3 bg-gray-700/50 rounded-2xl flex items-center justify-center">
                    <span className="text-2xl">👥</span>
                  </div>
                  <p className="mb-4 font-medium">No characters yet</p>
                  <button className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm rounded-xl transition-all duration-200 hover:scale-105 shadow-lg">
                    + Add Character
                  </button>
                </div>
              ) : (
                characters.map(c => (
                  <div key={c.id} className="group flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-700/50 cursor-pointer transition-all duration-200 border border-transparent hover:border-gray-600/30">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-sm font-bold text-white">{(c.name || c.title)?.[0] || "?"}</span>
                    </div>
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors font-medium">{c.name || c.title}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Dialogues Section */}
      <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-600/50 rounded-2xl overflow-hidden flex-1 flex flex-col shadow-lg">
        <button
          onClick={() => toggleSection("dialogues")}
          className="w-full px-6 py-4 flex items-center justify-between text-white hover:bg-gray-700/50 transition-all duration-300 group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <span className="text-lg">💬</span>
            </div>
            <div>
              <span className="font-bold text-lg">Dialogues</span>
              <div className="text-xs text-gray-400">Conversations</div>
            </div>
            <span className="text-xs bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full border border-purple-500/30">{dialogues.length}</span>
          </div>
          <span className={`transform transition-transform duration-300 ${expandedSections.dialogues ? "rotate-180" : ""}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </button>
        {expandedSections.dialogues && (
          <div className="px-6 pb-6 border-t border-gray-600/30 flex-1 flex flex-col">
            <div className="flex-1 overflow-auto space-y-2 mt-4">
              {dialogues.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <div className="w-16 h-16 mx-auto mb-3 bg-gray-700/50 rounded-2xl flex items-center justify-center">
                    <span className="text-2xl">💬</span>
                  </div>
                  <p className="mb-4 font-medium">No dialogues yet</p>
                  <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-sm rounded-xl transition-all duration-200 hover:scale-105 shadow-lg">
                    + Add Dialogue
                  </button>
                </div>
              ) : (
                dialogues.map(d => (
                  <div 
                    key={d.id} 
                    className="group flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-700/50 cursor-pointer transition-all duration-200 border border-transparent hover:border-gray-600/30"
                    onClick={() => onDialogueSelect?.(d.id)}
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-sm font-bold text-white">💬</span>
                    </div>
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors font-medium">{d.title || d.name}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


