export interface Rank {
  name: string;
  minPoints: number;
  maxPoints: number;
  color: string;
  icon: string;
}

export const ranks: Rank[] = [
  { name: "Sleeper", minPoints: 0, maxPoints: 49, color: "#94a3b8", icon: "💤" },
  { name: "Waker", minPoints: 50, maxPoints: 119, color: "#834dfb", icon: "🌅" },
  { name: "Early Bird", minPoints: 120, maxPoints: 249, color: "#10b981", icon: "🐦" },
  { name: "Locked In", minPoints: 250, maxPoints: 449, color: "#f59e0b", icon: "🔒" },
  { name: "No Snooze", minPoints: 450, maxPoints: 799, color: "#ef4444", icon: "⚡" },
  { name: "Legend", minPoints: 800, maxPoints: Infinity, color: "#f0e100", icon: "👑" },
];

export function getRankFromPoints(points: number): Rank {
  return ranks.find(rank => points >= rank.minPoints && points <= rank.maxPoints) || ranks[0];
}

export function getNextRank(currentPoints: number): { rank: Rank | null; pointsNeeded: number } {
  const currentRank = getRankFromPoints(currentPoints);
  const currentIndex = ranks.findIndex(r => r.name === currentRank.name);

  if (currentIndex === ranks.length - 1) {
    // Already at max rank
    return { rank: null, pointsNeeded: 0 };
  }

  const nextRank = ranks[currentIndex + 1];
  const pointsNeeded = nextRank.minPoints - currentPoints;

  return { rank: nextRank, pointsNeeded };
}

export function getRankProgress(points: number): number {
  const currentRank = getRankFromPoints(points);

  if (currentRank.maxPoints === Infinity) {
    return 100;
  }

  const rankRange = currentRank.maxPoints - currentRank.minPoints + 1;
  const pointsInRank = points - currentRank.minPoints;

  return Math.min(100, (pointsInRank / rankRange) * 100);
}
