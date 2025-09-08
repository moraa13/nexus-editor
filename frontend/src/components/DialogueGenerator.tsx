import { useEffect, useState } from "react";
import axios from "axios";
import Button from "./notus/Button";
import { Select } from "./notus/Form";
import Toast, { ToastContainer, type ToastProps } from "./notus/Toast";

type Dialogue = { id: string; title: string };
type GeneratedPost = { id?: string; speaker?: string; text: string };

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  headers: { "Content-Type": "application/json" },
});

export default function DialogueGenerator() {
  const [dialogues, setDialogues] = useState<Dialogue[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<GeneratedPost[]>([]);
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  useEffect(() => {
    api
      .get<Dialogue[]>("/dialogues/")
      .then((res) => setDialogues(res.data))
      .catch((e) => setError(e?.message ?? "Failed to load dialogues"));
  }, []);

  const addToast = (toast: Omit<ToastProps, "id" | "onClose">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { ...toast, id, onClose: () => {} }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleGenerate = async () => {
    if (!selectedId) return;
    setLoading(true);
    setError(null);
    setPosts([]);
    try {
      const { data } = await api.post<GeneratedPost[]>(`/dialogues/${selectedId}/generate/`);
      setPosts(Array.isArray(data) ? data : []);
      addToast({
        type: "success",
        title: "Generation Complete",
        message: `Generated ${Array.isArray(data) ? data.length : 0} dialogue posts`
      });
    } catch (e: any) {
      const errorMsg = e?.response?.data?.error || e?.message || "Failed to generate";
      setError(errorMsg);
      addToast({
        type: "error",
        title: "Generation Failed",
        message: errorMsg
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
          <span className="text-lg">⚡</span>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Dialogue Generator</h2>
          <p className="text-xs text-gray-400">AI-powered dialogue generation</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Select Dialogue</label>
          <Select 
            value={selectedId} 
            onChange={(e) => setSelectedId(e.target.value)} 
            className="w-full bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500/20"
          >
            <option value="">Choose a dialogue to generate…</option>
            {dialogues.map((d) => (
              <option key={d.id} value={d.id}>{d.title}</option>
            ))}
          </Select>
        </div>
        
        <Button 
          onClick={handleGenerate} 
          disabled={!selectedId || loading}
          className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
              Generating…
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Сгенерировать
            </>
          )}
        </Button>
      </div>
      
      {error && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        </div>
      )}
      
      {posts.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-300">✅ Generation Complete</h3>
          </div>
          <div className="space-y-3">
            {posts.map((p, idx) => (
              <div key={p.id || idx} className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all duration-200">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {p.speaker?.[0] || "?"}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white mb-1">{p.speaker || "Unknown"}</div>
                    <div className="text-gray-300 text-sm leading-relaxed">{p.text}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Toast Container */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}
