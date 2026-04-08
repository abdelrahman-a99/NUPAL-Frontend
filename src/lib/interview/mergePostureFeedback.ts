import {
  buildObjectivePostureNotes,
  type BodyLanguageAggregate,
} from "./bodyLanguage";

/** Attach deterministic posture bullets to API feedback JSON. */
export function mergePostureIntoFeedback(
  feedback: Record<string, unknown>,
  metrics: unknown
): void {
  if (!metrics || typeof metrics !== "object") return;
  const m = metrics as Partial<BodyLanguageAggregate>;
  if (typeof m.frameCount !== "number") return;
  feedback.postureObjectiveNotes = buildObjectivePostureNotes(
    m as BodyLanguageAggregate
  );
}
