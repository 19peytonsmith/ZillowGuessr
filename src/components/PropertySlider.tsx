// src/components/PropertySlider.tsx
"use client";

import * as React from "react";
import Slider, { SliderProps } from "@mui/material/Slider";

type PropertySliderProps = {
  value: number | number[];
  onChange: NonNullable<SliderProps["onChange"]>;
  color?: SliderProps["color"];
  disabled?: boolean;
};

const marks: NonNullable<SliderProps["marks"]> = [
  { value: 0, label: "$0" },
  { value: 250, label: "$100,000" },
  { value: 750, label: "$1M" },
  { value: 1000, label: "$20M" },
];

function calculateValue(v: number): number {
  if (v <= 250) {
    return (v / 250) * 100_000;
  } else if (v <= 750) {
    return 100_000 + ((v - 250) / 500) * (1_000_000 - 100_000);
  } else {
    return 1_000_000 + ((v - 750) / 250) * (20_000_000 - 1_000_000);
  }
}

function prettyValue(v: number): string {
  const money = calculateValue(v);
  return `$${Math.round(money).toLocaleString("en-US")}`;
}

export default function PropertySlider({
  value,
  onChange,
  color = "primary",
  disabled = false,
}: PropertySliderProps) {
  return (
    <Slider
      color={color}
      aria-label="Property price"
      valueLabelDisplay="auto"
      marks={marks}
      min={0}
      max={1000}
      valueLabelFormat={prettyValue}
      value={value}
      onChange={onChange}
      disabled={disabled}
    />
  );
}
