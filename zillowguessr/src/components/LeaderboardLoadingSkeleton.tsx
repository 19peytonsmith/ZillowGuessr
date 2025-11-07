"use client";

import React from "react";
import { Card } from "./Card";

type Props = {
  compact?: boolean; // when true, render only the list rows (no card/header)
};

export default function LeaderboardLoadingSkeleton({ compact }: Props) {
  const list = (
    <ul className="leaderboard-list leaderboard-skeleton-list">
      {[1, 2, 3, 4, 5].map((n) => (
        <li key={n} className="leaderboard-item skeleton-row">
          <span className="score-label">
            <div className="skeleton skeleton-chip" style={{ width: 90 }} />
          </span>
          <span className="score-value">
            <div className="skeleton" style={{ width: 60, height: 18 }} />
          </span>
        </li>
      ))}
    </ul>
  );

  if (compact) {
    // Compact mode: return only the list rows without the outer card so no shadow is rendered
    return list;
  }

  return (
    <Card className="rounded-xl">
      <div className="leaderboard-card">
        <h2 className="card-title">Leaderboard</h2>
        <hr className="leaderboard-divider" />
        {list}
      </div>
    </Card>
  );
}
