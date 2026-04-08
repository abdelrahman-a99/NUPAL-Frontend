/** Normalized pose landmark from MediaPipe */
export interface PoseLandmark {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
}

export interface FrameScores {
  symmetry: number;
  facing: number;
  /** Nose vs shoulders: higher = head more “up” / toward camera axis (heuristic) */
  headPitch: number;
  /** Torso visible & shoulder–hip span; omitted when hips not visible */
  trunkOpen?: number;
}

const VIS_SHOULDER = 0.45;
const VIS_HIP = 0.4;

function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function stdSample(values: number[]): number {
  if (values.length < 2) return 0;
  const m = mean(values);
  return Math.sqrt(
    values.reduce((s, v) => s + (v - m) ** 2, 0) / (values.length - 1)
  );
}

/**
 * Per-frame scores from MediaPipe pose landmarks.
 */
export function scorePoseFrame(landmarks: PoseLandmark[]): FrameScores | null {
  const nose = landmarks[0];
  const left = landmarks[11];
  const right = landmarks[12];
  if (!nose || !left || !right) return null;
  if (
    (left.visibility ?? 1) < VIS_SHOULDER ||
    (right.visibility ?? 1) < VIS_SHOULDER
  ) {
    return null;
  }

  const shoulderDiffY = Math.abs(left.y - right.y);
  const symmetry = Math.max(0, Math.min(100, 100 - shoulderDiffY * 420));

  const midShoulderX = (left.x + right.x) / 2;
  const noseOffset = Math.abs(nose.x - midShoulderX);
  const facing = Math.max(0, Math.min(100, 100 - noseOffset * 380));

  const shoulderMidY = (left.y + right.y) / 2;
  const delta = nose.y - shoulderMidY;
  const headPitch = Math.max(
    0,
    Math.min(100, 72 + (-delta) * 280 - Math.max(0, delta - 0.04) * 420)
  );

  const hipL = landmarks[23];
  const hipR = landmarks[24];
  let trunkOpen: number | undefined;
  if (
    hipL &&
    hipR &&
    (hipL.visibility ?? 1) >= VIS_HIP &&
    (hipR.visibility ?? 1) >= VIS_HIP
  ) {
    const hipMidY = (hipL.y + hipR.y) / 2;
    const torsoSpan = hipMidY - shoulderMidY;
    trunkOpen = Math.max(
      0,
      Math.min(100, (torsoSpan - 0.07) * 220 + 35)
    );
  }

  return { symmetry, facing, headPitch, trunkOpen };
}

export interface BodyLanguageAggregate {
  frameCount: number;
  avgSymmetry: number;
  avgFacing: number;
  avgHeadPitch: number;
  avgTrunk: number | null;
  trunkFrameRatio: number;
  stdSymmetry: number;
  stdFacing: number;
  stdHeadPitch: number;
  pctSymmetryBelow58: number;
  pctFacingBelow58: number;
  pctHeadPitchBelow58: number;
  /** Rich text block for the LLM with strict interpretation rules */
  summaryForModel: string;
}

export function aggregateSamples(
  samples: FrameScores[]
): BodyLanguageAggregate {
  if (samples.length === 0) {
    return {
      frameCount: 0,
      avgSymmetry: 0,
      avgFacing: 0,
      avgHeadPitch: 0,
      avgTrunk: null,
      trunkFrameRatio: 0,
      stdSymmetry: 0,
      stdFacing: 0,
      stdHeadPitch: 0,
      pctSymmetryBelow58: 0,
      pctFacingBelow58: 0,
      pctHeadPitchBelow58: 0,
      summaryForModel:
        "NO_POSE_DATA: Camera off, pose not detected, or too few frames. Do not invent posture praise. Say data was insufficient if asked about body language.",
    };
  }

  const sym = samples.map((s) => s.symmetry);
  const fac = samples.map((s) => s.facing);
  const hp = samples.map((s) => s.headPitch);
  const trunkVals = samples
    .map((s) => s.trunkOpen)
    .filter((v): v is number => v !== undefined);

  const avgSymmetry = mean(sym);
  const avgFacing = mean(fac);
  const avgHeadPitch = mean(hp);
  const avgTrunk = trunkVals.length ? mean(trunkVals) : null;
  const trunkFrameRatio = trunkVals.length / samples.length;

  const stdSymmetry = stdSample(sym);
  const stdFacing = stdSample(fac);
  const stdHeadPitch = stdSample(hp);

  const pctSymmetryBelow58 =
    (samples.filter((s) => s.symmetry < 58).length / samples.length) * 100;
  const pctFacingBelow58 =
    (samples.filter((s) => s.facing < 58).length / samples.length) * 100;
  const pctHeadPitchBelow58 =
    (samples.filter((s) => s.headPitch < 58).length / samples.length) * 100;

  const summaryForModel = [
    "=== POSE METRICS (MediaPipe, heuristic — you MUST follow the rules below) ===",
    `Frames used: ${samples.length}`,
    `Shoulder symmetry — mean: ${avgSymmetry.toFixed(1)}, stdev: ${stdSymmetry.toFixed(1)}, pct frames <58: ${pctSymmetryBelow58.toFixed(0)}%`,
    `Facing camera (nose vs shoulder mid X) — mean: ${avgFacing.toFixed(1)}, stdev: ${stdFacing.toFixed(1)}, pct frames <58: ${pctFacingBelow58.toFixed(0)}%`,
    `Head pitch proxy (up/down vs shoulders) — mean: ${avgHeadPitch.toFixed(1)}, stdev: ${stdHeadPitch.toFixed(1)}, pct frames <58: ${pctHeadPitchBelow58.toFixed(0)}%`,
    avgTrunk !== null
      ? `Trunk / shoulder–hip span — mean: ${avgTrunk.toFixed(1)} (hips visible in ${(trunkFrameRatio * 100).toFixed(0)}% of frames)`
      : "Trunk: hips rarely visible — do not claim sitting posture quality.",
    "",
    "RULES FOR YOUR WRITING:",
    "- Do NOT say 'strong eye contact' or 'great connection with camera' unless avgFacing >= 72 AND stdFacing <= 17 AND pctFacingBelow58 <= 25.",
    "- If avgFacing < 62 OR pctFacingBelow58 >= 40, explicitly say the candidate often turned away or was off-center.",
    "- If avgSymmetry < 62 OR stdSymmetry >= 15, mention uneven or shifting shoulders.",
    "- If avgHeadPitch < 60 OR pctHeadPitchBelow58 >= 35, mention head tilted down / toward desk or screen.",
    "- If stdFacing >= 18 OR stdSymmetry >= 16, mention visible fidgeting or restless upper body (based on frame-to-frame variance).",
    "- If frames < 25, call the posture sample 'thin' and avoid strong claims.",
    "- Never contradict these averages with generic praise.",
    "===",
  ].join("\n");

  return {
    frameCount: samples.length,
    avgSymmetry,
    avgFacing,
    avgHeadPitch,
    avgTrunk,
    trunkFrameRatio,
    stdSymmetry,
    stdFacing,
    stdHeadPitch,
    pctSymmetryBelow58,
    pctFacingBelow58,
    pctHeadPitchBelow58,
    summaryForModel,
  };
}

/**
 * Deterministic bullets shown to the user (not LLM-dependent).
 */
export function buildObjectivePostureNotes(
  agg: BodyLanguageAggregate
): string[] {
  const out: string[] = [];
  if (agg.frameCount === 0) {
    out.push(
      "No pose frames were captured — posture feedback is not available for this session."
    );
    return out;
  }

  if (agg.frameCount < 25) {
    out.push(
      `Only ${agg.frameCount} pose frames were analyzed — treat posture insights as approximate.`
    );
  }

  if (agg.avgSymmetry < 62) {
    out.push(
      `Shoulder level averaged ${agg.avgSymmetry.toFixed(0)}/100 (uneven or slouched shoulders likely).`
    );
  }
  if (agg.stdSymmetry >= 14) {
    out.push(
      `Shoulder alignment fluctuated noticeably across the session (variability ${agg.stdSymmetry.toFixed(1)}).`
    );
  }
  if (agg.pctSymmetryBelow58 >= 38) {
    out.push(
      `${agg.pctSymmetryBelow58.toFixed(0)}% of frames showed low shoulder symmetry.`
    );
  }

  if (agg.avgFacing < 65) {
    out.push(
      `Facing the camera averaged ${agg.avgFacing.toFixed(0)}/100 — you were often off-center or turned sideways relative to the lens.`
    );
  }
  if (agg.stdFacing >= 17) {
    out.push(
      `Head position moved side-to-side a lot (stdev ${agg.stdFacing.toFixed(1)}) — try steadier head position when answering.`
    );
  }
  if (agg.pctFacingBelow58 >= 38) {
    out.push(
      `${agg.pctFacingBelow58.toFixed(0)}% of frames had weak “facing camera” alignment.`
    );
  }

  if (agg.avgHeadPitch < 60) {
    out.push(
      `Head angle vs shoulders averaged ${agg.avgHeadPitch.toFixed(0)}/100 — likely looking down at screen or notes; raise the camera to eye level if possible.`
    );
  }
  if (agg.pctHeadPitchBelow58 >= 35) {
    out.push(
      `In ${agg.pctHeadPitchBelow58.toFixed(0)}% of frames the head appeared tilted downward.`
    );
  }

  if (agg.avgTrunk !== null && agg.avgTrunk < 55 && agg.trunkFrameRatio >= 0.35) {
    out.push(
      `Upper-body openness (shoulder–hip span) averaged ${agg.avgTrunk.toFixed(0)}/100 — consider sitting taller and slightly back from the camera.`
    );
  }

  const onlyThinSample =
    out.length === 1 &&
    out[0].includes("Only ") &&
    out[0].includes("pose frames were analyzed");
  const hasConcreteIssue = out.some(
    (line) =>
      !line.includes("Only ") &&
      !line.includes("No pose frames were captured")
  );

  if (agg.frameCount >= 25 && !hasConcreteIssue && !onlyThinSample) {
    out.push(
      "Pose metrics stayed in a neutral-to-good band — no major red flags from the automated check (this is not a substitute for human observation)."
    );
  }

  return out;
}
