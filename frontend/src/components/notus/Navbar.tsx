export default function Navbar() {
  return (
    <nav className="w-full bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-10 shadow-lg">
      <div className="px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <div>
              <span className="font-bold text-xl text-white tracking-wide">Nexus Editor</span>
              <div className="text-sm text-gray-300">Visual Novel Creator</div>
            </div>
          </div>
        </div>

        {/* Status & API Info */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 text-sm text-gray-300">
            <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
            <span className="font-medium">Connected</span>
          </div>
          <div className="text-sm text-gray-400 hidden sm:block bg-gray-800/60 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-600/50">
            API: {import.meta.env.VITE_API_URL || 'localhost:8000'}
          </div>
          <button className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 border border-gray-600/50">
            <span className="text-gray-300 text-lg">⚙️</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
