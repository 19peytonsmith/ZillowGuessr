"use client";

import * as React from "react";
import Image from "next/image";
import { Carousel, Status } from "react-responsive-3d-carousel";
import "react-responsive-3d-carousel/dist/styles.css";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

export default function PropertyCarousel({
  urls,
  onChangeIndex,
}: {
  urls: string[];
  onChangeIndex?: (i: number) => void;
}) {
  const [curIndex, setCurIndex] = React.useState(0);

  const items = React.useMemo(
    () =>
      urls.map((url, idx) => (
        <PhotoView key={idx} src={url}>
          <Image
            src={url}
            alt={`Property image ${idx + 1}`}
            width={800}
            height={300}
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
    <PhotoProvider>
      <Carousel
        items={items}
        startIndex={0}
        height="auto"
        containerHeight="300px"
        autoPlay={false}
        showIndicators={false}
        showStatus={false}
        showArrows
        transformDuration={1000}
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
          <Status
            color="var(--status)"
            length={items.length}
            curIndex={curIndex}
          />
        </div>
      </Carousel>
    </PhotoProvider>
  );
}
