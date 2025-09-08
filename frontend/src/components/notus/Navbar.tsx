export default function Navbar() {
  return (
    <nav className="w-full bg-slate-900/80 backdrop-blur border-b border-slate-800 sticky top-0 z-10">
      <div className="max-w-full px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-200">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
          <span className="font-semibold tracking-wide">Nexus Editor</span>
        </div>
        <div className="text-xs text-slate-400">API: {import.meta.env.VITE_API_URL}</div>
      </div>
    </nav>
  );
}


