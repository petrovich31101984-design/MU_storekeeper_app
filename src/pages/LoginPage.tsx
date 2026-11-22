import { useState, type FormEvent } from 'react';
import * as api from '../api';
import type { Storekeeper } from '../api/types';
import { isStorekeeperPosition } from '../api/types';
import { btn, Field, input } from '../components/ui';
import { Brand } from './SetupPage';

export function LoginPage({ onLogin, onChangeConnection }: { onLogin: (user: Storekeeper) => void; onChangeConnection: () => void }) {
  const [personalNumber, setPersonalNumber] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const user = await api.authenticate(personalNumber, password);
      if (!isStorekeeperPosition(user.position)) {
        setError(`Вход только для сотрудника с должностью «Кладовщик». Ваша должность: «${user.position || 'не указана'}». Её меняет руководитель в листе «Сотрудники».`);
        return;
      }
      onLogin(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка входа');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center p-4">
      <div className="max-w-sm w-full">
        <Brand subtitle="Система медицинского учёта (к) v. 1.0.0 · вход для кладовщика" />
        <form onSubmit={submit} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xl space-y-4">
          <Field label="Персональный номер">
            <input value={personalNumber} onChange={e => setPersonalNumber(e.target.value)} autoComplete="username" inputMode="numeric" className={input} autoFocus />
          </Field>
          <Field label="Пароль">
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" className={input} />
          </Field>
          {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}
          <button type="submit" disabled={busy || !personalNumber.trim() || !password} className={`${btn.primary} w-full !py-3`}>
            {busy ? 'Вход...' : 'Войти'}
          </button>
        </form>
        <button onClick={onChangeConnection} className="mt-4 w-full text-sm text-slate-500 hover:text-slate-800">⚙️ Изменить подключение</button>
      </div>
    </div>
  );
}
