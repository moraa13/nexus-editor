export default function Navbar() {
  return (
    <nav className="w-full bg-white/5 backdrop-blur-md border-b border-white/10 sticky top-0 z-10">
      <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <div>
              <span className="font-bold text-lg text-white">Nexus Editor</span>
              <div className="text-xs text-gray-400">Visual Novel Creator</div>
            </div>
          </div>
        </div>

        {/* Status & API Info */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span>Connected</span>
          </div>
          <div className="text-xs text-gray-400 hidden sm:block bg-white/5 px-3 py-1 rounded-full border border-white/10">
            API: {import.meta.env.VITE_API_URL}
          </div>
        </div>
      </div>
    </nav>
  );
}
