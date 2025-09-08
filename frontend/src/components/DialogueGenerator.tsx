import { useEffect, useState } from "react";
import axios from "axios";
import Button from "./notus/Button";
import { Select } from "./notus/Form";

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

  useEffect(() => {
    api
      .get<Dialogue[]>("/dialogues/")
      .then((res) => setDialogues(res.data))
      .catch((e) => setError(e?.message ?? "Failed to load dialogues"));
  }, []);

  const handleGenerate = async () => {
    if (!selectedId) return;
    setLoading(true);
    setError(null);
    setPosts([]);
    try {
      const { data } = await api.post<GeneratedPost[]>(`/dialogues/${selectedId}/generate/`);
      setPosts(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e?.response?.data?.error || e?.message || "Failed to generate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gray-900 border border-gray-700 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">⚡</span>
        <h2 className="text-lg font-semibold text-white">Dialogue Generator</h2>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Select Dialogue</label>
          <Select 
            value={selectedId} 
            onChange={(e) => setSelectedId(e.target.value)} 
            className="w-full bg-gray-800 border-gray-600 text-white"
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
          variant="success"
          className="w-full flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              Generating…
            </>
          ) : (
            <>
              <span>⚡</span>
              Сгенерировать
            </>
          )}
        </Button>
      </div>
      
      {error && (
        <div className="mt-4 p-3 bg-red-900/20 border border-red-700 rounded-lg">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}
      
      {posts.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Generated Posts</h3>
          <div className="space-y-3">
            {posts.map((p, idx) => (
              <div key={p.id || idx} className="bg-gray-800 border border-gray-600 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
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
    </section>
  );
}
