"use client";

import React from "react";

interface ListBlurProps {
  height?: string;
}

export function ListBlur({ height = "40%" }: ListBlurProps) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: height,
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      {/* Progressive blur layers */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backdropFilter: "blur(1px)",
          WebkitBackdropFilter: "blur(1px)",
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 20%, rgba(0,0,0,0) 40%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 20%, rgba(0,0,0,0) 40%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(2px)",
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0) 20%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0) 60%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0) 20%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0) 60%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0) 80%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0) 80%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0) 60%, rgba(0,0,0,0.85) 80%, rgba(0,0,0,1) 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0) 60%, rgba(0,0,0,0.85) 80%, rgba(0,0,0,1) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0) 80%, rgba(0,0,0,1) 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0) 80%, rgba(0,0,0,1) 100%)",
        }}
      />
    </div>
  );
}
