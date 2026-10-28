import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Arrangement, FOUR, NineOnALine, TEN } from "./components/Arrangement";
import { Body, CalcRow, Eyebrow, Formula, Heading, NC, Pill, Rise, Stage } from "./components/Bits";
import { inter, lora, theme } from "./theme";

export type SceneProps = { dur: number };

const card = (children: React.ReactNode, delay = 30): React.ReactNode => (
  <Rise delay={delay}>
    <div
      style={{
        background: "#f7f5ef",
        border: `2px solid ${theme.line}`,
        borderRadius: 18,
        padding: "22px 28px",
        marginTop: 26,
        fontFamily: inter,
        fontSize: 30,
        color: theme.body,
        lineHeight: 1.45,
      }}
    >
      {children}
    </div>
  </Rise>
);

/* ------------------------------------------------------------------ */
/* 1. title                                                            */
/* ------------------------------------------------------------------ */

export const TitleScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: theme.bg, alignItems: "center", justifyContent: "center", fontFamily: inter }}>
      <div style={{ position: "absolute", opacity: 0.14 * fade, transform: "translateX(520px)" }}>
        <Arrangement lines={TEN} size={820} dots="all" dotR={4} dotColor={theme.accentDark} lineWidth={3} />
      </div>
      <div style={{ width: 1180, textAlign: "center", position: "relative" }}>
        <Rise delay={2}>
          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: theme.faint,
            }}
          >
            RACE 04 &nbsp;·&nbsp; Permutations and combinations
          </div>
        </Rise>
        <Rise delay={10}>
          <h1
            style={{
              fontSize: 84,
              fontWeight: 800,
              color: theme.ink,
              letterSpacing: "-0.03em",
              lineHeight: 1.08,
              margin: "26px 0 0",
            }}
          >
            Ten lines,
            <br />
            forty five crossings
          </h1>
        </Rise>
        <Rise delay={22}>
          <div style={{ fontSize: 32, color: theme.muted, marginTop: 26 }}>
            Question four &nbsp;·&nbsp; join every crossing, count the lines
          </div>
        </Rise>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 2. the setup                                                        */
/* ------------------------------------------------------------------ */

export const SetupScene: React.FC<SceneProps> = () => (
  <Stage
    boardWidth={720}
    board={
      <Arrangement
        lines={TEN}
        size={720}
        accent={[4, 9]}
        mark={[4, 9]}
        markLabel="one point"
        reveal={22}
        dots="none"
      />
    }
  >
    <Eyebrow>Step one</Eyebrow>
    <Heading size={54}>Read the two conditions</Heading>
    <Body delay={26} size={31}>
      They are not decoration. Each one removes a case we would otherwise have to handle.
    </Body>
    <div style={{ display: "flex", gap: 16, marginTop: 30, flexWrap: "wrap" }}>
      <Rise delay={40}>
        <Pill tone="accent">no two parallel</Pill>
      </Rise>
      <Rise delay={52}>
        <Pill tone="accent">no three concurrent</Pill>
      </Rise>
    </div>
    <Body delay={64} size={29} muted>
      So every pair meets, and no meeting is ever shared by a third line.
    </Body>
  </Stage>
);

/* ------------------------------------------------------------------ */
/* 3. forty five points                                                */
/* ------------------------------------------------------------------ */

export const PointsScene: React.FC<SceneProps> = () => (
  <Stage
    boardWidth={720}
    board={<Arrangement lines={TEN} size={720} dots="all" dotR={3.8} reveal={26} />}
  >
    <Eyebrow>Step two</Eyebrow>
    <Heading size={54}>Count the crossing points</Heading>
    <Body delay={24} size={30}>
      One point for every pair of lines, and no point counted twice.
    </Body>
    <Rise delay={38}>
      <div style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 34 }}>
        <NC n={10} k={2} size={62} color={theme.accentDark} />
        <Formula size={54} color={theme.faint}>
          =
        </Formula>
        <span style={{ fontFamily: inter, fontSize: 76, fontWeight: 800, color: theme.ink, letterSpacing: "-0.02em" }}>
          45
        </span>
      </div>
    </Rise>
    <Body delay={56} size={29} muted>
      Forty five points, scattered across the plane.
    </Body>
  </Stage>
);

/* ------------------------------------------------------------------ */
/* 4. the naive count                                                  */
/* ------------------------------------------------------------------ */

export const NaiveScene: React.FC<SceneProps> = () => (
  <Stage
    boardWidth={720}
    board={
      <Arrangement
        lines={TEN}
        size={720}
        dots="all"
        dotR={3.8}
        lineColor="#ded8c8"
        joins={[
          [0, 17],
          [5, 30],
          [12, 41],
          [7, 26],
          [21, 38],
          [3, 33],
        ]}
        reveal={20}
      />
    }
  >
    <Eyebrow>The tempting answer</Eyebrow>
    <Heading size={54}>Join every pair of points</Heading>
    <Body delay={24} size={30}>
      Any two points fix a line, so the count looks like forty five choose two.
    </Body>
    <Rise delay={38}>
      <div style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 30 }}>
        <NC n={45} k={2} size={58} color={theme.accentDark} />
        <Formula size={50} color={theme.faint}>
          =
        </Formula>
        <span style={{ fontFamily: inter, fontSize: 72, fontWeight: 800, color: theme.ink, letterSpacing: "-0.02em" }}>
          990
        </span>
      </div>
    </Rise>
    <Body delay={54} size={29} muted>
      Nine hundred and ninety pairs. But a pair of points can redraw a line we already had.
    </Body>
  </Stage>
);

/* ------------------------------------------------------------------ */
/* 5. nine points on one line                                          */
/* ------------------------------------------------------------------ */

export const CollinearScene: React.FC<SceneProps> = () => (
  <Stage boardWidth={720} board={<NineOnALine width={720} pick={[2, 6]} />}>
    <Eyebrow>Why it overcounts</Eyebrow>
    <Heading size={54}>One line, nine crossings</Heading>
    <Body delay={24} size={30}>
      Every original line already carries nine crossing points. Pick any two of them, and the line
      through them is the line you started with.
    </Body>
    <Rise delay={44}>
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 32 }}>
        <NC n={9} k={2} size={54} color={theme.accentDark} />
        <Formula size={46} color={theme.faint}>
          =
        </Formula>
        <span style={{ fontFamily: inter, fontSize: 62, fontWeight: 800, color: theme.ink }}>36</span>
        <span style={{ fontFamily: inter, fontSize: 26, fontWeight: 700, color: theme.faint, marginLeft: 6 }}>
          pairs
        </span>
        <Formula size={44} color={theme.faint}>
          →
        </Formula>
        <span style={{ fontFamily: inter, fontSize: 30, fontWeight: 700, color: theme.ink }}>one line</span>
      </div>
    </Rise>
  </Stage>
);

/* ------------------------------------------------------------------ */
/* 6. thirty five too many                                             */
/* ------------------------------------------------------------------ */

export const CorrectionScene: React.FC<SceneProps> = () => (
  <AbsoluteFill
    style={{
      background: theme.bg,
      alignItems: "center",
      justifyContent: "center",
      padding: "0 160px",
      fontFamily: inter,
    }}
  >
    <Eyebrow>The correction</Eyebrow>
    <Heading size={58}>Thirty six pairs, one line</Heading>
    <Body delay={22} size={32} style={{ textAlign: "center" }}>
      On each original line we counted thirty six, where the truth is one.
    </Body>
    <div style={{ marginTop: 44, display: "flex", alignItems: "center", gap: 34 }}>
      <Rise delay={36}>
        <div
          style={{
            background: theme.badSoft,
            border: `2px solid #f0c9b6`,
            borderRadius: 18,
            padding: "20px 34px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 58, fontWeight: 800, color: theme.bad, lineHeight: 1 }}>36</div>
          <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "0.12em", color: "#a85b3c", marginTop: 10 }}>
            COUNTED
          </div>
        </div>
      </Rise>
      <Rise delay={46}>
        <Formula size={54} color={theme.faint}>
          −
        </Formula>
      </Rise>
      <Rise delay={46}>
        <div
          style={{
            background: theme.okSoft,
            border: `2px solid #bfe3d5`,
            borderRadius: 18,
            padding: "20px 34px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 58, fontWeight: 800, color: theme.ok, lineHeight: 1 }}>1</div>
          <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "0.12em", color: "#3f7f74", marginTop: 10 }}>
            REAL
          </div>
        </div>
      </Rise>
      <Rise delay={58}>
        <Formula size={54} color={theme.faint}>
          =
        </Formula>
      </Rise>
      <Rise delay={58}>
        <div style={{ fontSize: 72, fontWeight: 800, color: theme.accentDark, letterSpacing: "-0.02em" }}>35</div>
      </Rise>
    </div>
    <Body delay={76} size={29} muted style={{ textAlign: "center" }}>
      Thirty five lines too many, on every single original line.
    </Body>
  </AbsoluteFill>
);

/* ------------------------------------------------------------------ */
/* 7. ten lines                                                        */
/* ------------------------------------------------------------------ */

export const TenScene: React.FC<SceneProps> = () => (
  <Stage
    boardWidth={720}
    board={
      <Arrangement
        lines={TEN}
        size={720}
        dots="all"
        dotR={3.8}
        lineWidth={2}
        reveal={24}
      />
    }
  >
    <Eyebrow>The overcount</Eyebrow>
    <Heading size={54}>Ten lines, thirty five each</Heading>
    <CalcRow
      delay={34}
      items={[
        { big: "10", cap: "lines" },
        { big: "35", cap: "over each" },
        { big: "350", cap: "overcount", accent: true },
      ]}
      ops={["×", "="]}
    />
    <Body delay={58} size={29} muted>
      Three hundred and fifty pairs were drawing lines we already had.
    </Body>
  </Stage>
);

/* ------------------------------------------------------------------ */
/* 8. the total                                                        */
/* ------------------------------------------------------------------ */

export const TotalScene: React.FC<SceneProps> = () => (
  <AbsoluteFill
    style={{
      background: theme.bg,
      alignItems: "center",
      justifyContent: "center",
      padding: "0 140px",
      fontFamily: inter,
    }}
  >
    <Eyebrow>Put it together</Eyebrow>
    <div style={{ display: "flex", alignItems: "flex-end", gap: 34, marginTop: 18 }}>
      <Rise delay={10}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: lora, fontSize: 68, fontWeight: 600, color: theme.ink, lineHeight: 1 }}>990</div>
          <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: "0.12em", color: theme.faint, marginTop: 12 }}>
            ALL PAIRS
          </div>
        </div>
      </Rise>
      <Rise delay={20}>
        <div style={{ fontSize: 54, color: theme.faint, paddingBottom: 26 }}>−</div>
      </Rise>
      <Rise delay={20}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: lora, fontSize: 68, fontWeight: 600, color: theme.ink, lineHeight: 1 }}>350</div>
          <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: "0.12em", color: theme.faint, marginTop: 12 }}>
            OVERCOUNT
          </div>
        </div>
      </Rise>
      <Rise delay={32}>
        <div style={{ fontSize: 54, color: theme.faint, paddingBottom: 26 }}>=</div>
      </Rise>
      <Rise delay={32}>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: lora,
              fontSize: 104,
              fontWeight: 700,
              color: theme.accentDark,
              lineHeight: 0.9,
              letterSpacing: "-0.02em",
            }}
          >
            640
          </div>
          <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: "0.12em", color: theme.accent, marginTop: 12 }}>
            DISTINCT LINES
          </div>
        </div>
      </Rise>
    </div>
    <Rise delay={54}>
      <div
        style={{
          marginTop: 52,
          display: "inline-block",
          background: theme.accent,
          color: "#ffffff",
          fontSize: 40,
          fontWeight: 800,
          letterSpacing: "0.02em",
          padding: "18px 46px",
          borderRadius: 999,
        }}
      >
        Answer · option D
      </div>
    </Rise>
  </AbsoluteFill>
);

/* ------------------------------------------------------------------ */
/* 9. nothing else is collinear                                        */
/* ------------------------------------------------------------------ */

export const NothingElseScene: React.FC<SceneProps> = () => (
  <Stage
    boardWidth={720}
    board={<Arrangement lines={TEN} size={720} dots="all" dotR={3.8} accent={[3]} lineWidth={2} reveal={20} />}
  >
    <Eyebrow>The loose end</Eyebrow>
    <Heading size={54}>Could another line hold three?</Heading>
    <Body delay={24} size={30}>
      Each crossing belongs to exactly two lines. So a line carrying three crossings has to be one
      of the ten you started with.
    </Body>
    {card(
      <>
        Every collinear triple already sits on an <b>original line</b>. There is nothing left to
        subtract.
      </>,
      48
    )}
  </Stage>
);

/* ------------------------------------------------------------------ */
/* 10. the four line check                                             */
/* ------------------------------------------------------------------ */

export const SmallCaseScene: React.FC<SceneProps> = () => (
  <Stage
    boardWidth={720}
    board={<Arrangement lines={FOUR} size={720} span={1.22} dots="all" dotR={9} diagonals reveal={26} />}
  >
    <Eyebrow>Sanity check</Eyebrow>
    <Heading size={52}>Try four lines</Heading>
    <Body delay={22} size={29}>
      Six crossings, so fifteen pairs. Each line carries three of them, so the overcount is four
      times two.
    </Body>
    <Rise delay={40}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 26 }}>
        <span style={{ fontFamily: inter, fontSize: 46, fontWeight: 800, color: theme.ink }}>15</span>
        <Formula size={38} color={theme.faint}>
          −
        </Formula>
        <span style={{ fontFamily: inter, fontSize: 46, fontWeight: 800, color: theme.ink }}>8</span>
        <Formula size={38} color={theme.faint}>
          =
        </Formula>
        <span style={{ fontFamily: inter, fontSize: 46, fontWeight: 800, color: theme.accentDark }}>7</span>
      </div>
    </Rise>
    <Body delay={56} size={27} muted>
      Four original lines, plus the three dashed diagonals. That is the complete quadrilateral.
    </Body>
  </Stage>
);

/* ------------------------------------------------------------------ */
/* 11. recap                                                           */
/* ------------------------------------------------------------------ */

export const RecapScene: React.FC<SceneProps> = () => (
  <AbsoluteFill
    style={{
      background: theme.bg,
      alignItems: "center",
      justifyContent: "center",
      padding: "0 150px",
      fontFamily: inter,
    }}
  >
    <Eyebrow>The whole method</Eyebrow>
    <Rise delay={6}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 4 }}>
        {["10 lines", "45 crossings", "990 pairs"].map((t, i) => (
          <React.Fragment key={t}>
            <span style={{ fontSize: 28, fontWeight: 700, color: theme.muted }}>{t}</span>
            {i < 2 ? <span style={{ fontSize: 26, color: theme.faint }}>→</span> : null}
          </React.Fragment>
        ))}
      </div>
    </Rise>
    <div style={{ display: "flex", alignItems: "flex-end", gap: 30, marginTop: 34 }}>
      {[
        { big: "990", cap: "PAIRS", accent: false },
        { big: "350", cap: "OVERCOUNT", accent: false },
        { big: "640", cap: "OPTION D", accent: true },
      ].map((it, i) => (
        <React.Fragment key={it.cap}>
          <Rise delay={18 + i * 12}>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: lora,
                  fontSize: it.accent ? 96 : 64,
                  fontWeight: 700,
                  color: it.accent ? theme.accentDark : theme.ink,
                  lineHeight: 1,
                }}
              >
                {it.big}
              </div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  color: it.accent ? theme.accent : theme.faint,
                  marginTop: 12,
                }}
              >
                {it.cap}
              </div>
            </div>
          </Rise>
          {i < 2 ? (
            <Rise delay={18 + i * 12}>
              <div style={{ fontSize: 46, color: theme.faint, paddingBottom: 28 }}>
                {i === 0 ? "−" : "="}
              </div>
            </Rise>
          ) : null}
        </React.Fragment>
      ))}
    </div>
    <Body delay={62} size={30} muted style={{ textAlign: "center", marginTop: 40 }}>
      Join the crossings, but never forget the lines you started with.
    </Body>
  </AbsoluteFill>
);

/* ------------------------------------------------------------------ */

export const SCENES: Record<string, React.FC<SceneProps>> = {
  "01-title": TitleScene,
  "02-setup": SetupScene,
  "03-points": PointsScene,
  "04-naive": NaiveScene,
  "05-collinear": CollinearScene,
  "06-correction": CorrectionScene,
  "07-ten": TenScene,
  "08-total": TotalScene,
  "09-nothing-else": NothingElseScene,
  "10-small": SmallCaseScene,
  "11-recap": RecapScene,
};
