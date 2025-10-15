"use client";

import * as React from "react";
import { Carousel, Status } from "react-responsive-3d-carousel";
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
  const [curIndex, setCurIndex] = React.useState(0);

  const items = React.useMemo(
    () =>
      urls.map((url, idx) => (
        <PhotoView key={idx} src={url}>
          <img
            src={url}
            alt={`Property image ${idx + 1}`}
            style={{
              width: "100%",
              height: "300px",
              objectFit: "cover",
              display: "block",
              cursor: "pointer",
            }}
          />
        </PhotoView>
      )),
    [urls]
  );

  const handleChange = React.useCallback(
    (index: number) => {
      setCurIndex(index);
      onChangeIndex?.(index);
    },
    [onChangeIndex]
  );

  return (
    <PhotoProvider key={`provider-${resetKey}`}>
      <Carousel
        key={`carousel-${resetKey}`}
        items={items}
        startIndex={0}
        height="auto"
        containerHeight="300px"
        autoPlay={false}
        showIndicators={false}
        showStatus={false}
        showArrows
        transformDuration={300}
        onChange={handleChange}
      >
        <div
          style={{
            position: "absolute",
            top: "0px",
            right: "0px",
            zIndex: 10,
          }}
        >
          <Status color="#000000" length={items.length} curIndex={curIndex} />
        </div>
      </Carousel>
    </PhotoProvider>
  );
}
