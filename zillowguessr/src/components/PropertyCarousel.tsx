// src/components/PropertyCarousel.tsx
"use client";

import * as React from "react";
import { Carousel } from "react-responsive-3d-carousel";
import "react-responsive-3d-carousel/dist/styles.css";

// lightbox
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

type PropertyCarouselProps = {
  urls: string[];
  startIndex: number;
  onChangeIndex?: (index: number) => void;
};

export default function PropertyCarousel({
  urls,
  startIndex,
  onChangeIndex,
}: PropertyCarouselProps) {
  const [curIndex, setCurIndex] = React.useState<number>(startIndex);

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

  React.useEffect(() => {
    setCurIndex(startIndex);
  }, [startIndex]);

  const onChange = React.useCallback(
    (index: number) => {
      setCurIndex(index);
      onChangeIndex?.(index);
    },
    [onChangeIndex]
  );

  return (
    <PhotoProvider>
      <Carousel
        autoPlay={false}
        showIndicators={false}
        showStatus={true}
        showArrows
        startIndex={curIndex}
        onChange={onChange}
        transformDuration={300}
        items={items}
      />
    </PhotoProvider>
  );
}
