import { useEffect, type ReactNode } from 'react';

export const btn = {
  primary: 'px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-lg text-white text-sm font-medium shadow-sm transition-colors',
  danger: 'px-4 py-2 bg-red-600 hover:bg-red-500 disabled:bg-slate-300 rounded-lg text-white text-sm font-medium shadow-sm transition-colors',
  success: 'px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 rounded-lg text-white text-sm font-medium shadow-sm transition-colors',
  ghost: 'px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 text-sm font-medium transition-colors',
  outline: 'px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm transition-colors',
};

export const input =
  'w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20';

export const th = 'px-4 py-3 text-xs font-medium text-slate-600 uppercase tracking-wide';
export const td = 'px-4 py-3 text-sm text-slate-700';

export function PageHeader({ icon, title, subtitle, actions }: { icon: string; title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap justify-between items-start gap-4">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">{icon} {title}</h2>
        {subtitle && <p className="text-slate-500 text-sm mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}>{children}</div>;
}

export function Stat({ label, value, hint, tone = 'slate', onClick }: {
  label: string; value: ReactNode; hint?: string; tone?: 'slate' | 'emerald' | 'orange' | 'red' | 'blue'; onClick?: () => void;
}) {
  const tones = {
    slate: 'text-slate-800', emerald: 'text-emerald-600', orange: 'text-orange-600', red: 'text-red-600', blue: 'text-blue-600',
  };
  return (
    <Card className={`p-5 ${onClick ? 'cursor-pointer hover:border-blue-300 transition-colors' : ''}`}>
      <div onClick={onClick}>
        <div className="text-sm text-slate-500">{label}</div>
        <div className={`text-2xl font-bold mt-1 ${tones[tone]}`}>{value}</div>
        {hint && <div className="text-xs text-slate-400 mt-1">{hint}</div>}
      </div>
    </Card>
  );
}

export function Modal({ title, onClose, children, footer, wide }: {
  title: string; onClose: () => void; children: ReactNode; footer?: ReactNode; wide?: boolean;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div role="dialog" aria-label={title} className={`bg-white rounded-2xl border border-slate-200 w-full ${wide ? 'max-w-5xl' : 'max-w-xl'} max-h-[92vh] flex flex-col shadow-2xl`}>
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-xl leading-none" aria-label="Закрыть">×</button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-5">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-slate-200 flex justify-end items-center gap-3">{footer}</div>}
      </div>
    </div>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm text-slate-600 mb-1 block">{label}</span>
      {children}
    </label>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="p-10 text-center text-slate-500 text-sm">{children}</div>;
}

export function MonthSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500">
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}
