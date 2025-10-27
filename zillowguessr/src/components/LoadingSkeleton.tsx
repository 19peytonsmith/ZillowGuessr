"use client";

import React from "react";

export default function LoadingSkeleton() {
  return (
    <div
      className="main-content p-4 mx-auto"
      style={{ backgroundColor: "var(--card-bg)" }}
    >
      <div className="skeleton skeleton-title" />

      <div className="d-flex justify-content-between align-items-center my-2">
        <div className="skeleton skeleton-subtitle" />
        <div className="d-flex gap-2">
          <div className="skeleton skeleton-chip" />
          <div className="skeleton skeleton-chip" />
          <div className="skeleton skeleton-chip" />
        </div>
      </div>

      <hr />

      <div className="skeleton skeleton-score" />

      <hr />

      <div className="carousel-stack">
        <div className="skeleton carousel-left-left" />
        <div className="skeleton carousel-left" />
        <div className="skeleton carousel-center" />
        <div className="skeleton carousel-right" />
        <div className="skeleton carousel-right-right" />
      </div>

      <div className="mt-3">
        <div className="skeleton skeleton-slider" />
      </div>

      <div className="round-div mt-3 d-flex justify-content-center">
        <div className="skeleton skeleton-rounds" />
      </div>

      <div className="submit-btn text-center my-3">
        <div className="skeleton skeleton-button mx-auto" />
      </div>
    </div>
  );
}
