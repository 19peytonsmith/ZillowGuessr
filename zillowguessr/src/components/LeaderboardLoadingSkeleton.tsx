"use client";

import React from "react";

export default function LeaderboardLoadingSkeleton() {
  // 5-row leaderboard skeleton: left = game label, right = score
  return (
    <div className="leaderboard-card">
      <h2>Your Total Scores</h2>
      <hr className="leaderboard-divider" />

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
    </div>
  );
}
