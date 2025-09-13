import { useState, useEffect } from "react";
import axios from "axios";
import Button from "../notus/Button";
import { Select } from "../notus/Form";
import Toast, { ToastContainer, type ToastProps } from "../notus/Toast";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  headers: { "Content-Type": "application/json" },
});

interface GameProject {
  id: string;
  name: string;
  description: string;
}

interface ExportSession {
  id: string;
  project_name: string;
  format_type: string;
  status: string;
  file_size?: number;
  download_url?: string;
  error_message?: string;
}

const EXPORT_FORMATS = [
  { value: "json", label: "JSON", description: "Для веб-приложений и API" },
  { value: "yaml", label: "YAML", description: "Для конфигурационных файлов" },
  { value: "csv", label: "CSV", description: "Для анализа данных" },
  { value: "unity", label: "Unity ScriptableObject", description: "Для Unity проектов" },
  { value: "unreal", label: "Unreal Engine Data Table", description: "Для Unreal Engine" },
  { value: "godot", label: "Godot Resource", description: "Для Godot Engine" },
  { value: "renpy", label: "Ren'Py Script", description: "Для Ren'Py игр" },
  { value: "twine", label: "Twine Story Format", description: "Для Twine историй" },
];

export default function ExportPanel() {
  const [projects, setProjects] = useState<GameProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [selectedFormat, setSelectedFormat] = useState<string>("json");
  const [loading, setLoading] = useState(false);
  const [exportSessions, setExportSessions] = useState<ExportSession[]>([]);
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  useEffect(() => {
    loadProjects();
    loadExportSessions();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await api.get<GameProject[]>("/game-projects/");
      setProjects(response.data);
    } catch (error) {
      console.error("Failed to load projects:", error);
    }
  };

  const loadExportSessions = async () => {
    try {
      const response = await api.get<ExportSession[]>("/export-sessions/");
      setExportSessions(response.data);
    } catch (error) {
      console.error("Failed to load export sessions:", error);
    }
  };

  const addToast = (toast: Omit<ToastProps, "id" | "onClose">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { ...toast, id, onClose: () => {} }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleExport = async () => {
    if (!selectedProjectId) {
      addToast({
        type: "error",
        title: "Ошибка",
        message: "Выберите проект для экспорта"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/export/project/", {
        project_id: selectedProjectId,
        format_type: selectedFormat,
        export_options: {}
      });

      const { export_session_id, download_url, status, file_size } = response.data;
      
      addToast({
        type: "success",
        title: "Экспорт завершен",
        message: `Файл размером ${Math.round(file_size / 1024)}KB готов к скачиванию`
      });

      // Обновляем список сессий
      await loadExportSessions();
      
      // Автоматически скачиваем файл
      if (download_url) {
        window.open(`${import.meta.env.VITE_API_URL}${download_url}`, '_blank');
      }

    } catch (error: any) {
      const errorMsg = error?.response?.data?.error || error?.message || "Ошибка экспорта";
      addToast({
        type: "error",
        title: "Ошибка экспорта",
        message: errorMsg
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = async (sessionId: string) => {
    try {
      const response = await api.get(`/export/download/${sessionId}/`, {
        responseType: 'blob'
      });
      
      // Создаем ссылку для скачивания
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `export_${sessionId}.${selectedFormat}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      addToast({
        type: "error",
        title: "Ошибка скачивания",
        message: "Не удалось скачать файл"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'processing': return 'text-yellow-400';
      case 'failed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'processing': return '⏳';
      case 'failed': return '❌';
      default: return '⏸️';
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
          <span className="text-lg">📤</span>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Export Project</h2>
          <p className="text-xs text-gray-400">Экспорт проекта для тестирования</p>
        </div>
      </div>

      {/* Export Form */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Выберите проект
          </label>
          <Select 
            value={selectedProjectId} 
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="w-full bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500/20"
          >
            <option value="">Выберите проект для экспорта...</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Формат экспорта
          </label>
          <Select 
            value={selectedFormat} 
            onChange={(e) => setSelectedFormat(e.target.value)}
            className="w-full bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500/20"
          >
            {EXPORT_FORMATS.map((format) => (
              <option key={format.value} value={format.value}>
                {format.label} - {format.description}
              </option>
            ))}
          </Select>
        </div>

        <Button 
          onClick={handleExport} 
          disabled={!selectedProjectId || loading}
          className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
              Экспортируем...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Экспортировать проект
            </>
          )}
        </Button>
      </div>

      {/* Export History */}
      {exportSessions.length > 0 && (
        <div className="mt-8">
          <h3 className="text-sm font-medium text-gray-300 mb-4">История экспорта</h3>
          <div className="space-y-3">
            {exportSessions.slice(0, 5).map((session) => (
              <div key={session.id} className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{getStatusIcon(session.status)}</span>
                    <div>
                      <div className="text-sm font-medium text-white">
                        {session.project_name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {EXPORT_FORMATS.find(f => f.value === session.format_type)?.label} • 
                        <span className={getStatusColor(session.status)}> {session.status}</span>
                        {session.file_size && ` • ${Math.round(session.file_size / 1024)}KB`}
                      </div>
                    </div>
                  </div>
                  {session.status === 'completed' && (
                    <Button
                      onClick={() => downloadFile(session.id)}
                      className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white text-xs rounded"
                    >
                      Скачать
                    </Button>
                  )}
                </div>
                {session.error_message && (
                  <div className="mt-2 text-xs text-red-400">
                    Ошибка: {session.error_message}
                  </div>
                )}
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
