// PropertyCarousel.tsx
"use client";

import * as React from "react";
import { Carousel } from "react-responsive-3d-carousel";
import "react-responsive-3d-carousel/dist/styles.css";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

type Props = {
  urls: string[];
  resetKey: string | number;
  onChangeIndex?: (index: number) => void;
};

export default function PropertyCarousel({
  urls,
  resetKey,
  onChangeIndex,
}: Props) {
  const items = React.useMemo(
    () =>
      urls.map((url, idx) => (
        <PhotoView key={idx} src={url}>
          <img
            src={url}
            alt={`Property image ${idx + 1}`}
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              cursor: "pointer",
            }}
          />
        </PhotoView>
      )),
    [urls]
  );

  return (
    <PhotoProvider key={`provider-${resetKey}`}>
      <Carousel
        key={`carousel-${resetKey}`}
        items={items}
        startIndex={0}
        autoPlay={false}
        showIndicators={false}
        showStatus
        showArrows
        transformDuration={100}
        onChange={(i) => onChangeIndex?.(i)}
      />
    </PhotoProvider>
  );
}
