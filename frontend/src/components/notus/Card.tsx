import type { ReactNode } from "react";

export default function Card({ title, children, footer }: { title?: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="bg-slate-800/60 rounded-lg ring-1 ring-slate-700 overflow-hidden">
      {title ? (
        <div className="px-4 py-2 border-b border-slate-700 text-slate-300 font-medium text-sm">
          {title}
        </div>
      ) : null}
      <div className="p-3">{children}</div>
      {footer ? <div className="px-4 py-2 border-t border-slate-700">{footer}</div> : null}
    </div>
  );
}


