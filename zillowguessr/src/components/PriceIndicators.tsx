// src/components/PriceIndicators.tsx
"use client";

import * as React from "react";

type PriceIndicatorsProps = {
  value: [number, number];
  prettyValue: (v: number) => string;
  chosenColor?: string;
  actualColor?: string;
  top?: number;
};

export default function PriceIndicators({
  value,
  prettyValue,
  chosenColor = "var(--price-chosen)",
  actualColor = "var(--price-actual)",
  top = -20,
}: PriceIndicatorsProps) {
  const toPercent = (v: number) => `${(v / 1000) * 100}%`;

  // If the two indicators are very close in slider units (0-1000), consider
  // them overlapping and render the guessed indicator below the slider.
  const OVERLAP_THRESHOLD = 200; // units out of 1000 (~20%)
  const isOverlapping = Math.abs(value[0] - value[1]) <= OVERLAP_THRESHOLD;

  // Trigger animation when the value changes (i.e., after a guess is made)
  const [animateKey, setAnimateKey] = React.useState(0);

  const guessed = value[0];
  const actual = value[1];

  React.useEffect(() => {
    // bump key to retrigger CSS animation when value changes
    setAnimateKey((k) => k + 1);
  }, [guessed, actual]);

  return (
    <>
      <div
        aria-hidden
        className={`price-indicator-container ${animateKey}`}
        style={{
          position: "absolute",
          // if overlapping, move guessed indicator below the slider by adding vertical offset
          top: isOverlapping ? top + 60 : top,
          left: toPercent(value[0]),
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pointerEvents: "none",
          zIndex: 10,
        }}
      >
        <div className="price-indicator-label price-indicator-animate">
          Your guess: {prettyValue(value[0])}
        </div>
      </div>

      <div
        aria-hidden
        style={{
          position: "absolute",
          top,
          left: toPercent(value[1]),
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pointerEvents: "none",
          zIndex: 10,
        }}
      >
        <div className="price-indicator-label price-indicator-animate actual">
          Actual: {prettyValue(value[1])}
        </div>
      </div>
    </>
  );
}
