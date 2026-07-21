import type { TechniqueId } from "@/content/pack";

export type TechRecord = {
  seen: boolean;
  correct: number;
  platforms: string[];
};

export type ProgressLike = {
  tech: Partial<Record<TechniqueId, TechRecord>>;
  genuineSeen: number;
  genuineTrusted: number;
};
