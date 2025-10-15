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
  chosenColor = "#1976d2",
  actualColor = "#28a745",
  top = -20,
}: PriceIndicatorsProps) {
  const toPercent = (v: number) => `${(v / 1000) * 100}%`;

  // If the two indicators are very close in slider units (0-1000), consider
  // them overlapping and render the guessed indicator below the slider.
  const OVERLAP_THRESHOLD = 150; // units out of 1000 (~15%)
  const isOverlapping = Math.abs(value[0] - value[1]) <= OVERLAP_THRESHOLD;

  return (
    <>
      <div
        aria-hidden
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
        <div
          style={{
            background: "white",
            border: `1px solid ${chosenColor}`,
            color: chosenColor,
            padding: "2px 6px",
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 600,
            boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
          }}
        >
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
        <div
          style={{
            background: "white",
            border: `1px solid ${actualColor}`,
            color: actualColor,
            padding: "2px 6px",
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 600,
            boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
          }}
        >
          Actual: {prettyValue(value[1])}
        </div>
      </div>
    </>
  );
}
