export function xpForLevel(level) {
  return Math.floor(100 * Math.pow(level, 1.5))
}

export function levelFromXP(xp) {
  let level = 1
  while (xpForLevel(level + 1) <= xp) {
    level++
  }
  return level
}

export function xpProgress(xp) {
  const level = levelFromXP(xp)
  const currentLevelXP = xpForLevel(level)
  const nextLevelXP = xpForLevel(level + 1)
  return {
    level,
    current: xp - currentLevelXP,
    needed: nextLevelXP - currentLevelXP,
    percent: Math.round(((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100),
  }
}
