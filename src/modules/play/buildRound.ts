import { SCENARIOS, LESSONS, type Scenario, type TechniqueId } from "@/content/pack";

// Build a round of `size` scenarios, ALWAYS including >=1 genuine (spec §5.2).
// `weight` biases toward a technique (used by the lesson bridge).
export function buildRound(size = 5, weight?: TechniqueId): Scenario[] {
  const genuine = shuffle(SCENARIOS.filter((s) => s.genuine));
  const manip = shuffle(SCENARIOS.filter((s) => !s.genuine));

  if (weight) {
    manip.sort((a, b) => {
      const aw = a.techniques.includes(weight) ? 0 : 1;
      const bw = b.techniques.includes(weight) ? 0 : 1;
      return aw - bw;
    });
  }

  const genuineCount = Math.min(genuine.length, Math.max(1, Math.round(size / 5)));
  const chosen = [
    ...genuine.slice(0, genuineCount),
    ...manip.slice(0, size - genuineCount),
  ];
  return weight ? chosen : shuffle(chosen);
}

export function lessonForTechnique(id: TechniqueId): string | undefined {
  return LESSONS.find((l) => l.technique === id)?.id;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
