# Ten lines, forty five crossings

A narrated Remotion explainer for **RACE 04, Question 4** (JEE Main + Advanced 2028 nurture course,
Permutations and Combinations).

> Ten straight lines in a plane, no three concurrent and no two parallel. Joining the points of
> intersection of the lines, the maximum number of lines formed (including the old lines) is
> **(D) 640**.

## The solution

| step | count |
|---|---|
| intersection points, 10 choose 2 | 45 |
| pairs of points, 45 choose 2 | 990 |
| pairs on one original line, 9 choose 2 = 36 → 1 line, so 35 too many each | 10 × 35 = 350 |
| distinct lines | 990 − 350 = **640** |

Sanity check on four lines: 15 − 4×2 = 7 = 4 original lines + 3 diagonals (the complete
quadrilateral).

## Build

- 11 scenes, 1920×1080, 30 fps, English narration with Kokoro-82M voice `am_michael`.
- Scene lengths are derived from the measured audio (`scripts/tts_kokoro.py` writes
  `src/manifest.json`); nothing is hand-timed.
- Render happens in GitHub Actions (`.github/workflows/render.yml`): TTS → typecheck → Remotion →
  verify → upload artifact.

```bash
npm ci
python3 scripts/tts_kokoro.py --model kokoro-v1.0.onnx --voices voices-v1.0.bin
npx tsc --noEmit
npx remotion render src/index.ts Intersection out/intersection-lines.mp4 --gl=swangle
```
