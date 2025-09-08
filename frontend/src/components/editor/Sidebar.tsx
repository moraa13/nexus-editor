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
    <div className="h-full flex flex-col space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-4 text-white">
        <h1 className="text-lg font-bold mb-1">Nexus Editor</h1>
        <p className="text-sm opacity-90">Visual Novel Creator</p>
      </div>

      {/* Scenes Section */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
        <button
          onClick={() => toggleSection("scenes")}
          className="w-full px-4 py-3 flex items-center justify-between text-white hover:bg-white/5 transition-all duration-200"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-sm">🎬</span>
            </div>
            <span className="font-semibold">Scenes</span>
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{scenes.length}</span>
          </div>
          <span className={`transform transition-transform duration-200 ${expandedSections.scenes ? "rotate-180" : ""}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </button>
        {expandedSections.scenes && (
          <div className="px-4 pb-4 border-t border-white/10">
            <div className="max-h-32 overflow-auto space-y-1 mt-3">
              {scenes.length === 0 ? (
                <div className="text-center py-4 text-gray-400 text-sm">
                  <div className="w-12 h-12 mx-auto mb-2 bg-gray-700/50 rounded-lg flex items-center justify-center">
                    <span className="text-lg">🎬</span>
                  </div>
                  <p className="mb-3">No scenes yet</p>
                  <button className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded-lg transition-colors">
                    + Add Scene
                  </button>
                </div>
              ) : (
                scenes.map(s => (
                  <div key={s.id} className="group flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 cursor-pointer transition-all duration-200">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{s.title || s.name}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Characters Section */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
        <button
          onClick={() => toggleSection("characters")}
          className="w-full px-4 py-3 flex items-center justify-between text-white hover:bg-white/5 transition-all duration-200"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
              <span className="text-sm">👥</span>
            </div>
            <span className="font-semibold">Characters</span>
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{characters.length}</span>
          </div>
          <span className={`transform transition-transform duration-200 ${expandedSections.characters ? "rotate-180" : ""}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </button>
        {expandedSections.characters && (
          <div className="px-4 pb-4 border-t border-white/10">
            <div className="max-h-40 overflow-auto space-y-1 mt-3">
              {characters.length === 0 ? (
                <div className="text-center py-4 text-gray-400 text-sm">
                  <div className="w-12 h-12 mx-auto mb-2 bg-gray-700/50 rounded-lg flex items-center justify-center">
                    <span className="text-lg">👥</span>
                  </div>
                  <p className="mb-3">No characters yet</p>
                  <button className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-lg transition-colors">
                    + Add Character
                  </button>
                </div>
              ) : (
                characters.map(c => (
                  <div key={c.id} className="group flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 cursor-pointer transition-all duration-200">
                    <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">{(c.name || c.title)?.[0] || "?"}</span>
                    </div>
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{c.name || c.title}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Dialogues Section */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden flex-1 flex flex-col">
        <button
          onClick={() => toggleSection("dialogues")}
          className="w-full px-4 py-3 flex items-center justify-between text-white hover:bg-white/5 transition-all duration-200"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-sm">💬</span>
            </div>
            <span className="font-semibold">Dialogues</span>
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{dialogues.length}</span>
          </div>
          <span className={`transform transition-transform duration-200 ${expandedSections.dialogues ? "rotate-180" : ""}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </button>
        {expandedSections.dialogues && (
          <div className="px-4 pb-4 border-t border-white/10 flex-1 flex flex-col">
            <div className="flex-1 overflow-auto space-y-1 mt-3">
              {dialogues.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">
                  <div className="w-12 h-12 mx-auto mb-2 bg-gray-700/50 rounded-lg flex items-center justify-center">
                    <span className="text-lg">💬</span>
                  </div>
                  <p className="mb-3">No dialogues yet</p>
                  <button className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-lg transition-colors">
                    + Add Dialogue
                  </button>
                </div>
              ) : (
                dialogues.map(d => (
                  <div 
                    key={d.id} 
                    className="group flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 cursor-pointer transition-all duration-200"
                    onClick={() => onDialogueSelect?.(d.id)}
                  >
                    <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">💬</span>
                    </div>
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{d.title || d.name}</span>
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


