import { useState } from "react";
import { api } from "../../lib/api";
import Button from "../notus/Button";

export default function BottomPanel() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const runGeneration = async () => {
    setIsGenerating(true);
    setLogs((l) => ["🚀 Starting generation...", ...l]);
    try {
      // Placeholder ping; real call should target specific endpoints
      await api.get("/profiles/");
      setLogs((l) => ["✅ Generation finished successfully.", ...l]);
    } catch (e: any) {
      setLogs((l) => [`❌ Generation failed: ${e?.message ?? "Unknown error"}`, ...l]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">📊</span>
          <h2 className="text-lg font-semibold text-white">Debug Console</h2>
        </div>
        <Button 
          onClick={runGeneration} 
          variant="success"
          disabled={isGenerating}
          className="px-8 py-3 text-lg font-semibold flex items-center gap-3"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
              Generating...
            </>
          ) : (
            <>
              <span>⚡</span>
              Запустить генерацию
            </>
          )}
        </Button>
      </div>
      
      <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 max-h-32 overflow-auto">
        <div className="text-xs space-y-1">
          {logs.length === 0 ? (
            <div className="text-gray-400 italic">No logs yet. Click "Запустить генерацию" to start.</div>
          ) : (
            logs.map((line, i) => (
              <div key={i} className="text-gray-300 font-mono">
                <span className="text-gray-500">[{new Date().toLocaleTimeString()}]</span> {line}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}


