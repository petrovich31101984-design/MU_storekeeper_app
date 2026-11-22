// Подключение к общей Google-таблице через Apps Script
import type { Storekeeper } from './types';

const CONFIG_KEY = 'storekeeperConfig';

export interface Config { mode: 'remote'; scriptUrl: string }

export function getConfig(): Config | null {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    const value = raw ? JSON.parse(raw) : null;
    if (value && value.mode === 'remote' && value.scriptUrl) return value;
  } catch { /* нет доступа к хранилищу */ }
  return null;
}

export function saveConfig(config: Config) {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

export function clearConfig() {
  try { localStorage.removeItem(CONFIG_KEY); } catch { /* нет доступа к хранилищу */ }
}

/** GET-запрос к Apps Script: ответ как есть (ошибка — исключение) */
export async function rawGet(action: string, params: Record<string, string> = {}): Promise<any> {
  const config = getConfig();
  if (!config) throw new Error('Не настроено подключение');
  const url = new URL(config.scriptUrl);
  url.searchParams.set('action', action);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const response = await fetch(url.toString());
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const result = await response.json();
  if (result && !Array.isArray(result) && typeof result.error === 'string' && result.error) throw new Error(result.error);
  return result;
}

/** POST-запрос к Apps Script (запись в таблицу) */
export async function rawPost(action: string, data: unknown): Promise<void> {
  const config = getConfig();
  if (!config) throw new Error('Не настроено подключение');
  const response = await fetch(config.scriptUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action, data }),
    redirect: 'follow',
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const result = await response.json();
  if (result?.error) throw new Error(result.error);
}

/**
 * POST-запрос, который браузер доставит даже при закрытии вкладки (navigator.sendBeacon).
 * Ответ не читается. Без настроенного подключения ничего не делает.
 */
export function beaconPost(action: string, data: unknown): void {
  const config = getConfig();
  if (!config) return;
  const body = JSON.stringify({ action, data });
  try {
    const blob = new Blob([body], { type: 'text/plain;charset=utf-8' });
    if (navigator.sendBeacon && navigator.sendBeacon(config.scriptUrl, blob)) return;
  } catch { /* sendBeacon недоступен — пробуем fetch */ }
  fetch(config.scriptUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body,
    keepalive: true,
  }).catch(() => { /* статус обновится при следующей отметке */ });
}

/** Статус кладовщика в листе «Сотрудники»: «Активен», пока приложение открыто, иначе «Неактивен» */
export function setStorekeeperActive(id: string, active: boolean): void {
  if (!id) return;
  beaconPost('updateEmployeeShift', { id, shiftOpen: active });
}

export async function testConnection() {
  const result = await rawGet('test');
  return { title: String(result.title ?? ''), sheets: Array.isArray(result.sheets) ? result.sheets as string[] : [] };
}

export async function authenticate(personalNumber: string, password: string): Promise<Storekeeper> {
  const result = await rawGet('authenticateEmployee', { personalNumber: personalNumber.trim(), password })
    .catch(err => ({ success: false, error: err instanceof Error ? err.message : 'Ошибка входа' }));
  const data = result?.data && typeof result.data === 'object' ? result.data : result;
  if (!data || data.success === false || !data.id) {
    throw new Error(data?.error || 'Неверный персональный номер или пароль');
  }
  return {
    id: String(data.id),
    personalNumber: String(data.personalNumber ?? ''),
    fullName: String(data.fullName ?? ''),
    position: String(data.position ?? ''),
  };
}
