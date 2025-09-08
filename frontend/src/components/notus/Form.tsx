import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from "react";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`w-full bg-slate-900/60 border border-slate-700 rounded px-3 py-2 text-sm ${props.className || ""}`} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`w-full bg-slate-900/60 border border-slate-700 rounded px-3 py-2 text-sm ${props.className || ""}`} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`w-full bg-slate-900/60 border border-slate-700 rounded px-3 py-2 text-sm ${props.className || ""}`} />;
}


