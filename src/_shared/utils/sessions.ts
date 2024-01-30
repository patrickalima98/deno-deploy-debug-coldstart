// Packages
import { createHash } from 'node:crypto'

export function makeCacheKeyName(key: string) {
  const sessionHash = createHash('sha256').update(key).digest('hex');
  return `session_tk_${sessionHash}`
}