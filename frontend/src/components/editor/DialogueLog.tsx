import { useState, useEffect } from "react";
import Button from "../notus/Button";
import { listDialogueLogs, deleteDialogueLog } from "../../api/quest";
import type { DialogueLog } from "../../api/quest";

interface DialogueLogProps {
  questId?: string;
  characterId?: string;
}

export default function DialogueLogComponent({ questId, characterId }: DialogueLogProps) {
  const [logs, setLogs] = useState<DialogueLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    loadLogs();
  }, [questId, characterId]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const response = await listDialogueLogs();
      let filteredLogs = response.data;
      
      if (questId) {
        filteredLogs = filteredLogs.filter(log => log.quest === questId);
      }
      if (characterId) {
        filteredLogs = filteredLogs.filter(log => log.character === characterId);
      }
      
      setLogs(filteredLogs);
    } catch (e: any) {
      setError(e?.message || "Failed to load dialogue logs");
    } finally {
      setLoading(false);
    }
  };

  const handleClearLogs = async () => {
    if (!confirm("Are you sure you want to clear all logs? This action cannot be undone.")) {
      return;
    }

    try {
      // Delete all logs (in a real app, you'd have a bulk delete endpoint)
      for (const log of logs) {
        if (log.id) {
          await deleteDialogueLog(log.id);
        }
      }
      setLogs([]);
    } catch (e: any) {
      setError(e?.message || "Failed to clear logs");
    }
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(logs, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `dialogue-log-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const getLogIcon = (logType: string) => {
    switch (logType) {
      case "dialogue": return "💬";
      case "dice_roll": return "🎲";
      case "skill_check": return "🎯";
      case "quest_action": return "🎯";
      case "character_action": return "👤";
      default: return "📝";
    }
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case "success": return "text-green-400";
      case "failure": return "text-red-400";
      case "critical_success": return "text-green-300";
      case "critical_failure": return "text-red-300";
      case "pending_roll": return "text-yellow-400";
      default: return "text-gray-400";
    }
  };

  const getResultIcon = (result: string) => {
    switch (result) {
      case "success": return "✅";
      case "failure": return "❌";
      case "critical_success": return "🎉";
      case "critical_failure": return "💥";
      case "pending_roll": return "⏳";
      default: return "➖";
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const filteredLogs = filter === "all" 
    ? logs 
    : logs.filter(log => log.log_type === filter);

  return (
    <div className="h-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-lg">📑</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Dialogue Log</h2>
              <p className="text-xs text-gray-400">History of all dialogue events</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              onClick={handleExportJSON}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors"
            >
              Export JSON
            </Button>
            <Button 
              onClick={handleClearLogs}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded-lg transition-colors"
            >
              Clear All
            </Button>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-300">Filter:</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-1 bg-white/5 border border-white/10 text-white text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500/20"
          >
            <option value="all">All Events</option>
            <option value="dialogue">Dialogue</option>
            <option value="dice_roll">Dice Rolls</option>
            <option value="skill_check">Skill Checks</option>
            <option value="quest_action">Quest Actions</option>
            <option value="character_action">Character Actions</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-auto">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg mb-4">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            <div className="w-12 h-12 mx-auto mb-2 bg-gray-700/50 rounded-lg flex items-center justify-center">
              <span className="text-lg">📑</span>
            </div>
            <p>No dialogue events yet</p>
            <p className="text-xs mt-1">Start rolling dice and having conversations!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredLogs.map((log) => (
              <div key={log.id} className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                    <span className="text-lg">{getLogIcon(log.log_type)}</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-white">{log.author}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-400">{formatTime(log.created_at || "")}</span>
                      {log.result && (
                        <>
                          <span className="text-xs text-gray-400">•</span>
                          <span className={`text-xs flex items-center gap-1 ${getResultColor(log.result)}`}>
                            {getResultIcon(log.result)} {log.result}
                          </span>
                        </>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-300 leading-relaxed mb-2">
                      {log.content}
                    </div>
                    
                    {log.metadata && Object.keys(log.metadata).length > 0 && (
                      <div className="text-xs text-gray-400">
                        <details className="cursor-pointer">
                          <summary className="hover:text-gray-300">Metadata</summary>
                          <pre className="mt-2 p-2 bg-white/5 rounded text-xs overflow-x-auto">
                            {JSON.stringify(log.metadata, null, 2)}
                          </pre>
                        </details>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-shrink-0">
                    <Button 
                      variant="ghost"
                      onClick={() => {
                        if (log.id) {
                          deleteDialogueLog(log.id).then(() => {
                            setLogs(prev => prev.filter(l => l.id !== log.id));
                          });
                        }
                      }}
                      className="text-xs px-2 py-1 text-gray-400 hover:text-red-400"
                    >
                      ×
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
