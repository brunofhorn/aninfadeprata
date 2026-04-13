import { timingSafeEqual, scryptSync } from 'node:crypto'

export function verifyPasswordHash(password: string, storedHash: string) {
  const [algorithm, salt, hash] = storedHash.split(':')

  if (algorithm !== 'scrypt' || !salt || !hash) {
    return false
  }

  const computedHash = scryptSync(password, salt, 64)
  const storedBuffer = Buffer.from(hash, 'hex')

  if (computedHash.length !== storedBuffer.length) {
    return false
  }

  return timingSafeEqual(computedHash, storedBuffer)
}
