// src/components/Rounds.tsx
"use client";

import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

interface RoundsProps {
  round: number;
  handleClick: (round: number) => void;
  disabled?: boolean;
  totalRounds?: number;
  onCurrentClick?: () => void;
}

export default function Rounds({
  round,
  handleClick,
  disabled = false,
  totalRounds = 5,
  onCurrentClick,
}: RoundsProps) {
  const circles = Array.from({ length: totalRounds }, (_, i) => i + 1);

  return (
    <h5 className="d-flex gap-2 justify-content-center">
      Round
      {circles.map((circle, index) => {
        if (index < round - 1) {
          // Passed rounds → red "ban" icons
          return (
            <i
              key={index}
              className="bi bi-ban text-danger"
              onClick={!disabled ? () => handleClick(index + 1) : undefined}
              style={{
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.5 : 1,
              }}
            ></i>
          );
        } else if (index === round - 1) {
          // Current round → green filled circle
          const clickable = !!onCurrentClick && !disabled;
          return (
            <i
              key={index}
              className={`bi bi-${round}-circle text-success`}
              onClick={clickable ? onCurrentClick : undefined}
              style={{
                cursor: clickable ? "pointer" : "default",
                opacity: disabled ? 0.5 : 1,
              }}
              title={clickable ? `Return to round ${round}` : undefined}
            ></i>
          );
        } else {
          // Future rounds → blue outlined circles
          return (
            <i
              key={index}
              className={`bi bi-${index + 1}-circle text-info`}
            ></i>
          );
        }
      })}
    </h5>
  );
}
