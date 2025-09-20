import type { ReactNode } from "react";
import Navbar from "../components/notus/Navbar";

interface EditorLayoutProps {
  sidebar: ReactNode;
  main: ReactNode;
  right: ReactNode;
  bottom: ReactNode;
}

export default function EditorLayout({ sidebar, main, right, bottom }: EditorLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white overflow-hidden">
      <Navbar />
      <div className="flex flex-col h-[calc(100vh-80px)]">
        {/* Main Content Area */}
        <div className="flex-1 flex gap-8 p-8 min-h-0 w-full">
          {/* Left Sidebar */}
          <aside className="w-80 flex-shrink-0">
            <div className="h-full bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
              {sidebar}
            </div>
          </aside>
          
          {/* Center Main Area */}
          <main className="flex-1 min-w-0">
            <div className="h-full bg-gray-900/40 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
              {main}
            </div>
          </main>
          
          {/* Right Properties Panel */}
          <section className="w-96 flex-shrink-0">
            <div className="h-full bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
              {right}
            </div>
          </section>
        </div>
        
        {/* Bottom Panel */}
        <div className="bg-gray-900/80 backdrop-blur-xl border-t border-gray-700/50 shadow-lg">
          <div className="p-4">
            {bottom}
          </div>
        </div>
      </div>
    </div>
  );
}


