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
    <div className="p-6">
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 border-b border-white/10 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-lg">📊</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Debug Console</h2>
                <p className="text-xs text-gray-400">System logs and generation status</p>
              </div>
            </div>
            <Button 
              onClick={runGeneration} 
              disabled={isGenerating}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                  Generating...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Запустить генерацию
                </>
              )}
            </Button>
          </div>
        </div>
        
        {/* Console Output */}
        <div className="p-4">
          <div className="bg-black/20 border border-white/10 rounded-lg p-4 max-h-32 overflow-auto">
            <div className="text-xs space-y-1 font-mono">
              {logs.length === 0 ? (
                <div className="text-gray-400 italic flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                  Ready. Click "Запустить генерацию" to start.
                </div>
              ) : (
                logs.map((line, i) => (
                  <div key={i} className="text-gray-300 flex items-start gap-2">
                    <span className="text-gray-500 text-[10px] mt-0.5 flex-shrink-0">
                      [{new Date().toLocaleTimeString()}]
                    </span>
                    <span className="flex-1">{line}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


