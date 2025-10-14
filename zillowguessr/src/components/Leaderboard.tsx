// src/components/Leaderboard.tsx
"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function Leaderboard() {
  const [leaderboardScores, setLeaderboardScores] = useState<number[]>([]);

  useEffect(() => {
    const scoresFromCookie = Cookies.get("leaderboardScores");
    if (scoresFromCookie) {
      try {
        const parsedScores: number[] = JSON.parse(scoresFromCookie);
        // Sort scores from greatest to least
        parsedScores.sort((a, b) => b - a);
        setLeaderboardScores(parsedScores);
      } catch (error) {
        console.error("Failed to parse leaderboard scores:", error);
      }
    }
  }, []);

  return (
    <div style={styles.container}>
      <h1>Leaderboard</h1>
      {leaderboardScores.length > 0 ? (
        <div style={styles.scoreCard}>
          <h2>Your Total Scores</h2>
          <ul>
            {leaderboardScores.map((score, index) => (
              <li key={index}>
                Game {index + 1}: {score}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No scores available. Play the game to see your scores!</p>
      )}
    </div>
  );
}

const styles: {
  container: React.CSSProperties;
  scoreCard: React.CSSProperties;
} = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    fontFamily: "Arial, sans-serif",
  },
  scoreCard: {
    padding: "20px",
    backgroundColor: "#f0f0f0",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  },
};
