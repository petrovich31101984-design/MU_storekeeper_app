import { useState } from 'react';
import * as api from '../api';
import { btn, input } from '../components/ui';

const logo = `${import.meta.env.BASE_URL}logo.png`;

export function Brand({ subtitle }: { subtitle: string }) {
  return (
    <div className="text-center mb-6">
      <img src={logo} alt="СМУ" className="w-28 h-28 object-contain mx-auto mb-3 drop-shadow" />
      <h1 className="text-3xl font-bold"><span className="text-blue-600">СМУ</span></h1>
      <p className="text-slate-600 mt-1">{subtitle}</p>
    </div>
  );
}

export function SetupPage({ onDone }: { onDone: () => void }) {
  const [url, setUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const connect = async () => {
    setBusy(true);
    setError('');
    api.saveConfig({ mode: 'remote', scriptUrl: url.trim() });
    try {
      await api.testConnection();
      onDone();
    } catch (err) {
      api.clearConfig();
      setError(err instanceof Error ? err.message : 'Ошибка подключения');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center p-4">
      <div className="max-w-xl w-full">
        <Brand subtitle="Система медицинского учёта (к) v. 0.5.5" />
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-5">
          <div className="text-sm text-slate-700 space-y-2">
            <p className="font-semibold text-slate-800">Подключение к общей Google-таблице</p>
            <p className="text-slate-600">Вставьте тот же адрес веб-приложения Apps Script, что используется в приложениях руководителя и сотрудников. Обновлять скрипт не нужно.</p>
          </div>
          <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://script.google.com/macros/s/.../exec" className={input} aria-label="Адрес Apps Script" />
          {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}
          <button onClick={connect} disabled={busy || !/^https:\/\//.test(url.trim())} className={`${btn.primary} w-full !py-3`}>
            {busy ? 'Проверка...' : '🔌 Подключиться'}
          </button>
        </div>
      </div>
    </div>
  );
}
