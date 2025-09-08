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
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="grid grid-rows-[1fr_auto] h-[calc(100vh-48px)]">
        <div className="grid grid-cols-[320px_1fr_380px] gap-4 p-4">
          <aside className="overflow-hidden">
            {sidebar}
          </aside>
          <main className="overflow-hidden">
            {main}
          </main>
          <section className="overflow-hidden">
            {right}
          </section>
        </div>
        <div className="p-4 pt-0">
          {bottom}
        </div>
      </div>
    </div>
  );
}


