const DEMO_KEY = 'clt_demo';

export function setDemoMode(on: boolean): void {
  if (typeof window === 'undefined') return;
  if (on) sessionStorage.setItem(DEMO_KEY, '1');
  else sessionStorage.removeItem(DEMO_KEY);
}

export function getDemoMode(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(DEMO_KEY) === '1';
}
