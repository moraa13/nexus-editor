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
          <div className="h-full flex flex-col space-y-4">
            <div className="flex-1 min-h-0">
              <Canvas dialogueId={selectedDialogueId} characterId={selectedCharacterId} />
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
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
          <div className="flex items-center gap-1 p-2 bg-white/5 backdrop-blur-sm border-b border-white/10">
            <button
              onClick={() => setActiveTab("canvas")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === "canvas"
                  ? "bg-indigo-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <span className="mr-2">🎯</span>
              Canvas
            </button>
            <button
              onClick={() => setActiveTab("skill-checks")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === "skill-checks"
                  ? "bg-purple-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <span className="mr-2">🎲</span>
              Skill Checks
            </button>
            <button
              onClick={() => setActiveTab("dice-roller")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === "dice-roller"
                  ? "bg-yellow-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <span className="mr-2">🎲</span>
              Dice Roller
            </button>
            <button
              onClick={() => setActiveTab("characters")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === "characters"
                  ? "bg-emerald-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <span className="mr-2">👥</span>
              Characters
            </button>
            <button
              onClick={() => setActiveTab("quests")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === "quests"
                  ? "bg-purple-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <span className="mr-2">🎯</span>
              Quests
            </button>
            <button
              onClick={() => setActiveTab("dialogue-log")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === "dialogue-log"
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <span className="mr-2">📑</span>
              Dialogue Log
            </button>
            <button
              onClick={() => setActiveTab("dialogue-nodes")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === "dialogue-nodes"
                  ? "bg-green-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <span className="mr-2">🌿</span>
              Dialogue Nodes
            </button>
            <button
              onClick={() => setActiveTab("export")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === "export"
                  ? "bg-orange-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <span className="mr-2">📤</span>
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



