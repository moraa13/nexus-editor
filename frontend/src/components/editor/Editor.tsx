import { useState } from "react";
import EditorLayout from "../../layouts/EditorLayout";
import Sidebar from "./Sidebar";
import Canvas from "./Canvas";
import PropertiesPanel from "./PropertiesPanel";
import BottomPanel from "./BottomPanel";
import DialogueGenerator from "../DialogueGenerator";
import SkillCheckEditor from "./SkillCheckEditor";
import DiceRoller from "./DiceRoller";
import CharacterEditor from "./CharacterEditor";
import QuestEditor from "./QuestEditor";
import DialogueLogComponent from "./DialogueLog";
import ExportPanel from "./ExportPanel";
import DialogueNodeEditor from "./DialogueNodeEditor";

export default function Editor() {
  const [activeTab, setActiveTab] = useState<"canvas" | "skill-checks" | "dice-roller" | "characters" | "quests" | "dialogue-log" | "export" | "dialogue-nodes">("canvas");
  const [selectedDialogueId, setSelectedDialogueId] = useState<string | undefined>();
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | undefined>();

  const renderMainContent = () => {
    switch (activeTab) {
      case "skill-checks":
        return <SkillCheckEditor dialogueId={selectedDialogueId} />;
      case "dice-roller":
        return <DiceRoller dialogueId={selectedDialogueId} />;
      case "characters":
        return <CharacterEditor onCharacterSelect={setSelectedCharacterId} />;
      case "quests":
        return <QuestEditor projectId={selectedDialogueId} />;
      case "dialogue-log":
        return <DialogueLogComponent />;
      case "export":
        return <ExportPanel />;
      case "dialogue-nodes":
        return <DialogueNodeEditor dialogueId={selectedDialogueId} />;
      default:
        return (
          <div className="h-full flex flex-col p-6 space-y-6">
            <div className="flex-1 min-h-0 bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-gray-600/30 overflow-hidden shadow-lg">
              <Canvas dialogueId={selectedDialogueId} characterId={selectedCharacterId} />
            </div>
            <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-600/50 rounded-2xl overflow-hidden shadow-lg">
              <DialogueGenerator />
            </div>
          </div>
        );
    }
  };

  return (
    <EditorLayout
      sidebar={<Sidebar onDialogueSelect={setSelectedDialogueId} />}
      main={
        <div className="h-full flex flex-col">
          {/* Tab Navigation */}
          <div className="flex items-center gap-2 p-4 bg-gray-800/60 backdrop-blur-sm border-b border-gray-600/30">
            <button
              onClick={() => setActiveTab("canvas")}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                activeTab === "canvas"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-gray-700/50"
              }`}
            >
              <span className="text-lg">🎯</span>
              Canvas
            </button>
            <button
              onClick={() => setActiveTab("skill-checks")}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                activeTab === "skill-checks"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-gray-700/50"
              }`}
            >
              <span className="text-lg">🎲</span>
              Skill Checks
            </button>
            <button
              onClick={() => setActiveTab("dice-roller")}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                activeTab === "dice-roller"
                  ? "bg-gradient-to-r from-yellow-600 to-orange-600 text-white shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-gray-700/50"
              }`}
            >
              <span className="text-lg">🎲</span>
              Dice Roller
            </button>
            <button
              onClick={() => setActiveTab("characters")}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                activeTab === "characters"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-gray-700/50"
              }`}
            >
              <span className="text-lg">👥</span>
              Characters
            </button>
            <button
              onClick={() => setActiveTab("quests")}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                activeTab === "quests"
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-gray-700/50"
              }`}
            >
              <span className="text-lg">🎯</span>
              Quests
            </button>
            <button
              onClick={() => setActiveTab("dialogue-log")}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                activeTab === "dialogue-log"
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-gray-700/50"
              }`}
            >
              <span className="text-lg">📑</span>
              Dialogue Log
            </button>
            <button
              onClick={() => setActiveTab("dialogue-nodes")}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                activeTab === "dialogue-nodes"
                  ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-gray-700/50"
              }`}
            >
              <span className="text-lg">🌿</span>
              Dialogue Nodes
            </button>
            <button
              onClick={() => setActiveTab("export")}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                activeTab === "export"
                  ? "bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-gray-700/50"
              }`}
            >
              <span className="text-lg">📤</span>
              Export
            </button>
          </div>
          
          {/* Main Content */}
          <div className="flex-1 min-h-0">
            {renderMainContent()}
          </div>
        </div>
      }
      right={<PropertiesPanel />}
      bottom={<BottomPanel />}
    />
  );
}



