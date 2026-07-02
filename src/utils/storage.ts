export function readFromStorage<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null) return null
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export function writeToStorage<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // localStorage no disponible (modo privado, cuota excedida, etc.) - se ignora
  }
}

export function removeFromStorage(key: string): void {
  try {
    window.localStorage.removeItem(key)
  } catch {
    // localStorage no disponible - se ignora
  }
}
