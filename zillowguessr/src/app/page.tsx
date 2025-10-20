"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { SliderProps } from "@mui/material/Slider";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import PropertySlider from "@/components/PropertySlider";
import PropertyCarousel from "@/components/PropertyCarousel";
import SubmitButton from "@/components/SubmitButton";
import Rounds from "@/components/Rounds";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBed, faBathtub, faRuler } from "@fortawesome/free-solid-svg-icons";

const ROUNDS = 2;

type PropertyInfo = {
  urls: string[];
  value: number;
  beds: number | string;
  baths: number | string;
  square_footage: string;
  address: string;
  city_state_zipcode: string;
};

export default function HomePage() {
  const router = useRouter();

  const [propertyDataQueue, setPropertyDataQueue] = useState<PropertyInfo[]>(
    []
  );
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [originalIndex, setOriginalIndex] = useState<number>(0);
  const [, setCarouselIndex] = useState<number>(0);

  const [sliderValue, setSliderValue] = useState<number | number[]>(250);
  const [sliderValues, setSliderValues] = useState<Array<number | undefined>>(
    []
  );
  const [sliderResults, setSliderResults] = useState<
    Array<number[] | undefined>
  >([]);

  const [, setScores] = useState<number[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [roundLocked, setRoundLocked] = useState<boolean>(false);
  const [pendingNextRound, setPendingNextRound] = useState<boolean>(false);
  const [color, setColor] = useState<SliderProps["color"] | string>("primary");
  const [getResults, setGetResults] = useState<boolean>(false);

  const currentData = useMemo(
    () => propertyDataQueue[currentIndex],
    [propertyDataQueue, currentIndex]
  );

  const handlePropertySliderOnChange: React.ComponentProps<
    typeof PropertySlider
  >["onChange"] = (_e, newVal) => {
    if (!roundLocked) {
      setSliderValue(newVal as number | number[]);
    }
  };

  /**
   * Fetch property info with retries. This will call the API repeatedly until
   * a valid PropertyInfo is returned or attempts are exhausted. This prevents
   * a bad listing from being mounted and exposed to the user.
   */
  const fetchPropertyInfo = async (
    index: number,
    maxAttempts = 20,
    delayMs = 300
  ): Promise<PropertyInfo | null> => {
    const isValid = (data: unknown): data is PropertyInfo => {
      const d = data as Partial<PropertyInfo> | null | undefined;
      return (
        !!d &&
        typeof d.value === "number" &&
        Array.isArray(d.urls) &&
        d.urls.length > 2 &&
        typeof d.address === "string"
      );
    };

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        // add attempt/seed params to help the server avoid caching and for debugging
        const res = await fetch(
          `/api/property_info?page=${index}&attempt=${attempt}`,
          { cache: "no-store" }
        );

        if (!res.ok) {
          // server returned an HTTP error. Try again.
          console.warn(
            `property_info fetch not ok (status=${res.status}), attempt=${attempt}`
          );
        } else {
          const body = await res.json();
          if (isValid(body)) {
            return body;
          }
          // Not valid — maybe returned an error payload or malformed HTML — keep retrying.
          console.warn("property_info returned invalid data, retrying", body);
        }
      } catch (err) {
        console.warn("Error fetching property_info, retrying", err);
      }

      // delay before next attempt to avoid tight loop
      await new Promise((r) => setTimeout(r, delayMs));
    }

    console.error(
      `Failed to fetch a valid property after ${maxAttempts} attempts (seed=${index}).`
    );
    return null;
  };

  useEffect(() => {
    let isMounted = true;
    (async () => {
      for (let i = 0; i < ROUNDS; i++) {
        // For each round, keep trying (with retries inside fetchPropertyInfo) until we
        // either get a valid listing or we exhaust the attempts. This prevents a bad
        // listing from being mounted and prevents showing API errors to the user.
        const data = await fetchPropertyInfo(i, 20, 300);
        if (data && isMounted) {
          setPropertyDataQueue((prev) => [...prev, data]);
        } else {
          // If we failed to get a valid property after retries, log and continue.
          // The UI will remain in the loading state until enough items are available.
          console.error(`Could not load property for round ${i}`);
        }
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const calculateScore = (guessMoney: number, valueOfHome: number) => {
    const percentageError = (guessMoney - valueOfHome) / valueOfHome;
    return Math.round(1000 * Math.E ** -Math.abs(percentageError));
  };

  const convertValueToSliderValue = (moneyValue: number) => {
    if (moneyValue <= 100_000) {
      return (moneyValue / 100_000) * 250;
    } else if (moneyValue <= 1_000_000) {
      return (
        250 + ((moneyValue - 100_000) / (1_000_000 - 100_000)) * (750 - 250)
      );
    } else {
      return (
        750 +
        ((moneyValue - 1_000_000) / (20_000_000 - 1_000_000)) * (1000 - 750)
      );
    }
  };

  function calculateValue(v: number) {
    if (v <= 250) {
      return (v / 250) * 100_000;
    } else if (v <= 750) {
      return 100_000 + ((v - 250) / (750 - 250)) * (1_000_000 - 100_000);
    } else {
      return 1_000_000 + ((v - 750) / (1000 - 750)) * (20_000_000 - 1_000_000);
    }
  }

  const handleSubmit = (valueOfHome: number) => {
    const numericSlider = Array.isArray(sliderValue)
      ? sliderValue[0]
      : sliderValue;
    const scoreForRound = calculateScore(
      calculateValue(numericSlider),
      valueOfHome
    );

    setSliderValues((prev) => {
      const updated = [...prev];
      updated[currentIndex] = numericSlider;
      return updated;
    });

    setSliderResults((prev) => {
      const updated = [...prev];
      updated[currentIndex] = [
        numericSlider,
        convertValueToSliderValue(valueOfHome),
      ];
      return updated;
    });

    setScores((prev) => [...prev, scoreForRound]);
    setTotal((prev) => prev + scoreForRound);

    setSliderValue([numericSlider, convertValueToSliderValue(valueOfHome)]);

    setRoundLocked(true);
    if (currentIndex < ROUNDS - 1) {
      setPendingNextRound(true);
    } else {
      setGetResults(true);
    }
    setColor("warning");
  };

  const handleNextRoundClick = () => {
    setRoundLocked(false);
    setPendingNextRound(false);
    setColor("primary");
    setSliderValue(250);
    setCurrentIndex((i) => i + 1);
    setOriginalIndex(currentIndex + 1);
    setCarouselIndex(0);
  };

  const handleRoundClick = (round: number) => {
    setColor("secondary");
    if (!roundLocked) {
      setOriginalIndex(currentIndex);
      setRoundLocked(true);
    }
    setCurrentIndex(round - 1);
    const result = sliderResults[round - 1];
    if (result) {
      setSliderValue(result);
    } else {
      const sv = sliderValues[round - 1];
      setSliderValue(typeof sv === "number" ? sv : 250);
    }
  };

  const handleBackToOriginalRound = () => {
    setCurrentIndex(originalIndex);
    setRoundLocked(false);
    setSliderValue(250);
  };

  const handleGetResults = () => {
    const stored = Cookies.get("leaderboardScores");
    const existing: number[] = stored ? JSON.parse(stored) : [];
    const updated = [...existing, total];
    Cookies.set("leaderboardScores", JSON.stringify(updated), { expires: 7 });

    router.push("/leaderboards");
  };

  const buttonState = () => {
    if (getResults) {
      return (
        <button className="btn btn-success" onClick={handleGetResults}>
          Get Results
        </button>
      );
    } else if (pendingNextRound) {
      return (
        <button className="btn btn-primary" onClick={handleNextRoundClick}>
          Next Round
        </button>
      );
    } else if (roundLocked) {
      return (
        <button
          className="btn btn-secondary"
          onClick={handleBackToOriginalRound}
        >
          Go back to Round {originalIndex + 1}
        </button>
      );
    } else {
      return (
        <SubmitButton
          onClick={() => currentData && handleSubmit(currentData.value)}
        >
          Go!
        </SubmitButton>
      );
    }
  };

  return (
    <div className="mx-auto my-auto d-flex h-100">
      {currentData ? (
        <div className="d-flex gap-2 mx-auto" id="container">
          <div
            className="half-width p-lg-4 p-2"
            style={{ backgroundColor: "whitesmoke" }}
          >
            <h2 className="my-0">{currentData.address}</h2>
            <div className="d-flex justify-content-between">
              <h4>{currentData.city_state_zipcode}</h4>
              <div className="property-data d-flex gap-2">
                <h5>
                  <FontAwesomeIcon icon={faBed} /> {currentData.beds}
                  <span className="small-text">bd</span>
                </h5>
                <h5>
                  <FontAwesomeIcon icon={faBathtub} /> {currentData.baths}
                  <span className="small-text">ba</span>
                </h5>
                <h5>
                  <FontAwesomeIcon icon={faRuler} />{" "}
                  {currentData.square_footage}
                  <span className="small-text">
                    ft<sup>2</sup>
                  </span>
                </h5>
              </div>
            </div>

            <hr />
            <h5>
              Score: <span className="text-success">{total}</span>
            </h5>
            <hr />

            <PropertyCarousel
              key={`round-${currentIndex}`}
              urls={currentData.urls}
              onChangeIndex={setCarouselIndex}
            />

            <PropertySlider
              value={sliderValue}
              onChange={handlePropertySliderOnChange}
              disabled={roundLocked}
              color={color as SliderProps["color"]}
            />

            <div className="round-div">
              <Rounds
                round={originalIndex + 1}
                handleClick={handleRoundClick}
                disabled={pendingNextRound || getResults}
                totalRounds={ROUNDS}
                onCurrentClick={
                  currentIndex !== originalIndex
                    ? handleBackToOriginalRound
                    : undefined
                }
              />
            </div>

            <div className="submit-btn text-center my-3">{buttonState()}</div>
          </div>
        </div>
      ) : (
        <LoadingSkeleton />
      )}
    </div>
  );
}
