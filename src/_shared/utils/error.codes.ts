/* eslint-disable max-len */

export const errorsList = {
  // ----------------------------------
  // Identity Provider
  // ----------------------------------
  'IP-TA-10': 'Data monitoring is already verified.',
} as const

export const errorCodes = Object.keys(errorsList).reduce((newMap, key) => {
  newMap[key] = key
  return newMap
}, {} as any) as unknown as Record<keyof typeof errorsList, string>
