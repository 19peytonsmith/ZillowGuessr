// src/components/Rounds.tsx
"use client";

import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

interface RoundsProps {
  round: number;
  handleClick: (round: number) => void;
  disabled?: boolean;
}

export default function Rounds({
  round,
  handleClick,
  disabled = false,
}: RoundsProps) {
  const circles = [1, 2, 3, 4, 5];

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
          return (
            <i key={index} className={`bi bi-${round}-circle text-success`}></i>
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
