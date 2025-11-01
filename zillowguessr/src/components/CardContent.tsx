// src/components/CardContent.tsx
"use client";

import React, { ReactNode } from "react";

interface CardContentProps {
  title: string;
  children: ReactNode;
  className?: string;
  cardClassName?: string;
  dividerClassName?: string;
}

export default function CardContent({
  title,
  children,
  className = "",
  cardClassName = "leaderboard-card",
  dividerClassName = "leaderboard-divider",
}: CardContentProps) {
  return (
    <div className={`${cardClassName} ${className}`}>
      <h2>{title}</h2>
      <hr className={dividerClassName} />
      {children}
    </div>
  );
}
