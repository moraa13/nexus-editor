import { useEffect, useState } from "react";
import { api } from "../../lib/api";

type Item = { id: string; title?: string; name?: string };

export default function Sidebar() {
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
    <div className="h-full bg-gray-900 border border-gray-700 rounded-xl p-4 space-y-4">
      {/* Scenes Section */}
      <div className="border border-gray-700 rounded-lg bg-gray-800/50">
        <button
          onClick={() => toggleSection("scenes")}
          className="w-full px-4 py-3 flex items-center justify-between text-white hover:bg-gray-700/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">🎬</span>
            <span className="font-semibold text-sm uppercase tracking-wide">Scenes</span>
          </div>
          <span className={`transform transition-transform ${expandedSections.scenes ? "rotate-180" : ""}`}>▼</span>
        </button>
        {expandedSections.scenes && (
          <div className="px-4 pb-3">
            <ul className="space-y-1 text-sm text-gray-300 max-h-28 overflow-auto">
              {scenes.length === 0 ? <li className="opacity-60 py-2">No scenes</li> : scenes.map(s => (
                <li key={s.id} className="px-3 py-2 rounded-lg hover:bg-gray-700/50 cursor-pointer transition-colors">{s.title || s.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Characters Section */}
      <div className="border border-gray-700 rounded-lg bg-gray-800/50">
        <button
          onClick={() => toggleSection("characters")}
          className="w-full px-4 py-3 flex items-center justify-between text-white hover:bg-gray-700/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">👥</span>
            <span className="font-semibold text-sm uppercase tracking-wide">Characters</span>
          </div>
          <span className={`transform transition-transform ${expandedSections.characters ? "rotate-180" : ""}`}>▼</span>
        </button>
        {expandedSections.characters && (
          <div className="px-4 pb-3">
            <ul className="space-y-1 text-sm text-gray-300 max-h-40 overflow-auto">
              {characters.length === 0 ? <li className="opacity-60 py-2">No characters</li> : characters.map(c => (
                <li key={c.id} className="px-3 py-2 rounded-lg hover:bg-gray-700/50 cursor-pointer transition-colors">{c.name || c.title}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Dialogues Section */}
      <div className="border border-gray-700 rounded-lg bg-gray-800/50 flex-1">
        <button
          onClick={() => toggleSection("dialogues")}
          className="w-full px-4 py-3 flex items-center justify-between text-white hover:bg-gray-700/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">💬</span>
            <span className="font-semibold text-sm uppercase tracking-wide">Dialogues</span>
          </div>
          <span className={`transform transition-transform ${expandedSections.dialogues ? "rotate-180" : ""}`}>▼</span>
        </button>
        {expandedSections.dialogues && (
          <div className="px-4 pb-3 flex-1 overflow-auto">
            <ul className="space-y-1 text-sm text-gray-300">
              {dialogues.length === 0 ? <li className="opacity-60 py-2">No dialogues</li> : dialogues.map(d => (
                <li key={d.id} className="px-3 py-2 rounded-lg hover:bg-gray-700/50 cursor-pointer transition-colors">{d.title || d.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}


