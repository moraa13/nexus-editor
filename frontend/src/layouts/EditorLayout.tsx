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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Navbar />
      <div className="flex flex-col h-[calc(100vh-64px)]">
        {/* Main Content Area */}
        <div className="flex-1 flex max-w-screen-xl mx-auto gap-6 p-6 min-h-0 w-full">
          {/* Left Sidebar */}
          <aside className="w-80 flex-shrink-0">
            {sidebar}
          </aside>
          
          {/* Center Main Area */}
          <main className="flex-1 min-w-0">
            {main}
          </main>
          
          {/* Right Properties Panel */}
          <section className="w-96 flex-shrink-0">
            {right}
          </section>
        </div>
        
        {/* Bottom Panel */}
        <div className="border-t border-white/10 bg-white/5 backdrop-blur-sm">
          {bottom}
        </div>
      </div>
    </div>
  );
}


