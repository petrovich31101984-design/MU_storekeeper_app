/** Вошедший кладовщик */
export interface Storekeeper {
  id: string;
  personalNumber: string;
  fullName: string;
  position: string;
}

/** Сотрудник — кладовщик (по должности в листе «Сотрудники») */
export const isStorekeeperPosition = (position: string) =>
  String(position || '').toLowerCase().includes('кладовщ');
