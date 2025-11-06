"use client";

import React from "react";

export default function LoadingSkeleton() {
  return (
    <div className="main-content p-4 mx-auto bg-[var(--card-bg)]">
      {/* Header section */}
      <div className="play-page-header flex justify-between items-center mb-1">
        <div className="skeleton skeleton-title" />
        <div className="flex items-center gap-2">
          <div className="skeleton w-[80px] h-8 rounded-lg" />
          <div className="skeleton w-12 h-8 rounded-full" />
        </div>
      </div>

      {/* Property info row */}
      <div className="property-info-row flex justify-between">
        <div className="skeleton skeleton-subtitle" />
        <div className="property-data flex gap-2 my-2">
          <div className="skeleton skeleton-chip" />
          <div className="skeleton skeleton-chip" />
          <div className="skeleton skeleton-chip" />
        </div>
      </div>

      <hr />
      <div className="flex justify-between items-center my-2">
        <div className="skeleton skeleton-score" />
        <div className="skeleton skeleton-show-map" />
      </div>

      <hr className="mt-0" />

      <div className="carousel-stack">
        <div className="skeleton carousel-left-left" />
        <div className="skeleton carousel-left" />
        <div className="skeleton carousel-center" />
        <div className="skeleton carousel-right" />
        <div className="skeleton carousel-right-right" />
      </div>

      {/* Mobile thumbnail skeletons (visible on small screens) */}
      <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-2 md:hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="skeleton flex-shrink-0 w-20 h-14 rounded-md"
          />
        ))}
      </div>

      <div className="mt-3">
        <div className="skeleton skeleton-slider" />
        <div className="mt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 sm:justify-end">
          <div className="skeleton w-2.5 h-4 rounded-sm hidden sm:block" />
          <div className="skeleton w-full sm:w-[120px] h-8 rounded-md" />
        </div>
      </div>

      <div className="round-div mt-3 flex justify-center">
        <div className="skeleton skeleton-rounds" />
      </div>

      <div className="submit-btn text-center my-3">
        <div className="skeleton skeleton-button mx-auto" />
      </div>
    </div>
  );
}
