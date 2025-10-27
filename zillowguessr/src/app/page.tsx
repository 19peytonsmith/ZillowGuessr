"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type { SliderProps } from "@mui/material/Slider";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import PropertySlider from "@/components/PropertySlider";
import PropertyCarousel from "@/components/PropertyCarousel";
import SubmitButton from "@/components/SubmitButton";
import Rounds from "@/components/Rounds";
import Confetti from "@/components/Confetti";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBed, faBathtub, faRuler } from "@fortawesome/free-solid-svg-icons";
import ThemeToggle from "@/components/ThemeToggle";

const ROUNDS = 5;

type PropertyInfo = {
  urls: string[];
  value: number;
  beds: number | string;
  baths: number | string;
  square_footage: string;
  address: string;
  city_state_zipcode: string;
  detailUrl?: string;
};

export default function HomePage() {
  const router = useRouter();
  const [showMap, setShowMap] = useState<boolean>(false);
  // Default zoom for Google Maps embed. Lower numbers = more zoomed out.
  const DEFAULT_MAP_ZOOM = 8;

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
  // displayTotal is what we show in the UI and will animate between values
  const [displayTotal, setDisplayTotal] = useState<number>(0);
  const [showDelta, setShowDelta] = useState<boolean>(false);
  const [lastDelta, setLastDelta] = useState<number>(0);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [animatingScore, setAnimatingScore] = useState<boolean>(false);
  const animRef = useRef<number | null>(null);
  // When true, prevent displayTotal from immediately jumping to `total`
  // This is used to keep the UI showing the previous total while we show
  // the +N delta and then animate the numeric increment.
  const [holdDisplayUntilAnimation, setHoldDisplayUntilAnimation] =
    useState<boolean>(false);

  // ease helper for nicer numeric animation
  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

  const startAnimateDisplay = (from: number, to: number) => {
    // cancel any existing
    if (animRef.current) {
      cancelAnimationFrame(animRef.current);
      animRef.current = null;
    }

    // We're about to begin the numeric animation — clear the hold so the
    // sync effect can operate normally after the animation finishes.
    setHoldDisplayUntilAnimation(false);

    const duration = 700; // ms
    const start = performance.now();
    setAnimatingScore(true);

    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = easeOutCubic(t);
      const value = Math.round(from + (to - from) * eased);
      setDisplayTotal(value);
      if (t < 1) {
        animRef.current = requestAnimationFrame(step);
      } else {
        animRef.current = null;
        setAnimatingScore(false);
      }
    };

    animRef.current = requestAnimationFrame(step);
  };

  // Keep displayTotal in sync when total changes but we are not animating
  useEffect(() => {
    // Only update the displayed total when we're not animating and when
    // there isn't an explicit hold requested (we hold while showing the
    // +N delta so the displayed number doesn't jump prematurely).
    if (!animatingScore && !holdDisplayUntilAnimation) {
      setDisplayTotal(total);
    }
  }, [total, animatingScore, holdDisplayUntilAnimation]);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  // Watch lastDelta (the per-round score that was last added). If it's >= 950,
  // trigger a short subtle confetti rain. We auto-hide after a short duration.
  useEffect(() => {
    if (lastDelta >= 950) {
      setShowConfetti(true);
      const id = window.setTimeout(() => setShowConfetti(false), 3000);
      return () => window.clearTimeout(id);
    }
    return;
  }, [lastDelta]);
  const [roundLocked, setRoundLocked] = useState<boolean>(false);
  const [pendingNextRound, setPendingNextRound] = useState<boolean>(false);
  const [color, setColor] = useState<SliderProps["color"] | string>("primary");
  const [getResults, setGetResults] = useState<boolean>(false);

  const currentData = useMemo(
    () => propertyDataQueue[currentIndex],
    [propertyDataQueue, currentIndex]
  );

  // Hide the map when the user navigates to a different round/property
  useEffect(() => {
    setShowMap(false);
  }, [currentIndex]);

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

    // Animate: show a +N delta, then increment the displayed score up to the new total
    const prevTotal = total;
    const newTotal = prevTotal + scoreForRound;

    // Prevent the UI from immediately jumping to the new total while we
    // show the +N delta. The numeric animation will clear this hold when it
    // starts.
    setHoldDisplayUntilAnimation(true);
    // store the authoritative total immediately so other logic sees it
    setTotal(newTotal);

    // show delta +N
    setLastDelta(scoreForRound);
    setShowDelta(true);

    // hide delta after 600ms then start increment animation
    window.setTimeout(() => {
      setShowDelta(false);
      // start numeric increment animation
      startAnimateDisplay(prevTotal, newTotal);
    }, 600);

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
          <b>Get Results</b>
        </button>
      );
    } else if (pendingNextRound) {
      return (
        <button className="btn btn-primary" onClick={handleNextRoundClick}>
          <b>Next Round</b>
        </button>
      );
    } else if (roundLocked) {
      return (
        <button
          className="btn btn-secondary"
          onClick={handleBackToOriginalRound}
        >
          <b>Go back to Round {originalIndex + 1}</b>
        </button>
      );
    } else {
      return (
        <SubmitButton
          onClick={() => currentData && handleSubmit(currentData.value)}
        >
          <b>Go!</b>
        </SubmitButton>
      );
    }
  };

  return (
    <div className="mx-auto my-auto d-flex">
      {/* Confetti overlay (client-only). Component returns null when inactive. */}
      <Confetti active={showConfetti} duration={3000} />
      {currentData ? (
        <div
          className="main-content p-4 mx-auto position-relative"
          style={{ backgroundColor: "var(--card-bg)" }}
        >
          <ThemeToggle />
          <h1 className="my-0">{currentData.address}</h1>
          <div className="d-flex justify-content-between">
            <h4>{currentData.city_state_zipcode}</h4>
            <div className="property-data d-flex gap-2">
              <h5 className="text-end">
                <FontAwesomeIcon icon={faBed} /> {currentData.beds}
                <span className="small-text">bd</span>
              </h5>
              <h5 className="text-end">
                <FontAwesomeIcon icon={faBathtub} /> {currentData.baths}
                <span className="small-text">ba</span>
              </h5>
              <h5 className="text-end">
                <FontAwesomeIcon icon={faRuler} /> {currentData.square_footage}
                <span className="small-text">
                  ft<sup>2</sup>
                </span>
              </h5>
            </div>
          </div>

          <hr />
          <div className="d-flex align-items-center justify-content-between">
            <h5>
              Score{" "}
              <span className="score-inline">
                <span
                  className={`score-number ${animatingScore ? "anim" : ""}`}
                  style={{ color: "var(--price-actual)" }}
                >
                  {displayTotal}
                </span>
                {showDelta ? (
                  <span className={`score-delta show`}>+{lastDelta}</span>
                ) : null}
                {/* show max possible score based on rounds */}
                <span className="score-max">/{ROUNDS * 1000}</span>
              </span>
            </h5>

            <div className="d-flex align-items-center gap-2">
              {/* Always-present button to toggle the embedded Google Map for this address */}
              {currentData.address ? (
                <button
                  className="btn btn-outline-primary icon-link"
                  onClick={() => setShowMap((s) => !s)}
                  aria-expanded={showMap}
                  aria-controls="property-map-embed"
                >
                  {showMap ? "Hide Map" : "Show on Map"}
                  <svg
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    className="bi"
                    fill="currentColor"
                  >
                    <path d="M11 16C11 16.5523 11.4477 17 12 17C12.5523 17 13 16.5523 13 16H11ZM8.21567 14.3922C8.75496 14.2731 9.09558 13.7394 8.97647 13.2001C8.85735 12.6608 8.32362 12.3202 7.78433 12.4393L8.21567 14.3922ZM16.2157 12.4393C15.6764 12.3202 15.1426 12.6608 15.0235 13.2001C14.9044 13.7394 15.245 14.2731 15.7843 14.3922L16.2157 12.4393ZM15 7C15 8.65685 13.6569 10 12 10V12C14.7614 12 17 9.76142 17 7H15ZM12 10C10.3431 10 9 8.65685 9 7H7C7 9.76142 9.23858 12 12 12V10ZM9 7C9 5.34315 10.3431 4 12 4V2C9.23858 2 7 4.23858 7 7H9ZM12 4C13.6569 4 15 5.34315 15 7H17C17 4.23858 14.7614 2 12 2V4ZM11 11V16H13V11H11ZM20 17C20 17.2269 19.9007 17.5183 19.5683 17.8676C19.2311 18.222 18.6958 18.5866 17.9578 18.9146C16.4844 19.5694 14.3789 20 12 20V22C14.5917 22 16.9861 21.5351 18.7701 20.7422C19.6608 20.3463 20.4435 19.8491 21.0171 19.2463C21.5956 18.6385 22 17.8777 22 17H20ZM12 20C9.62114 20 7.51558 19.5694 6.04218 18.9146C5.30422 18.5866 4.76892 18.222 4.43166 17.8676C4.0993 17.5183 4 17.2269 4 17H2C2 17.8777 2.40438 18.6385 2.98287 19.2463C3.55645 19.8491 4.33918 20.3463 5.2299 20.7422C7.01386 21.5351 9.40829 22 12 22V20ZM4 17C4 16.6824 4.20805 16.2134 4.96356 15.6826C5.70129 15.1644 6.81544 14.7015 8.21567 14.3922L7.78433 12.4393C6.22113 12.7846 4.83528 13.3285 3.81386 14.0461C2.81023 14.7512 2 15.747 2 17H4ZM15.7843 14.3922C17.1846 14.7015 18.2987 15.1644 19.0364 15.6826C19.792 16.2134 20 16.6824 20 17H22C22 15.747 21.1898 14.7512 20.1861 14.0461C19.1647 13.3285 17.7789 12.7846 16.2157 12.4393L15.7843 14.3922Z"></path>
                  </svg>
                </button>
              ) : null}
              {/* Zillow link remains conditional (only after guess and when available) */}
              {roundLocked && currentData.detailUrl ? (
                <a
                  className="btn btn-outline-success icon-link icon-link-hover"
                  href={currentData.detailUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  View on Zillow
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="bi"
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                    fill="currentColor"
                  >
                    <path d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
                  </svg>
                </a>
              ) : null}
            </div>
          </div>

          {/* Embedded Google Maps iframe — container always mounted; visibility controlled by CSS class */}
          {currentData.address ? (
            <div
              className={`map-embed-container mt-3 ${
                showMap ? "map-visible" : ""
              }`}
              id="property-map-embed"
            >
              <iframe
                className="map-embed"
                title={`Map for ${currentData.address}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  `${currentData.address}, ${currentData.city_state_zipcode}`
                )}&z=${DEFAULT_MAP_ZOOM}&output=embed`}
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          ) : null}
          <hr className="mt-0" />

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
      ) : (
        <LoadingSkeleton />
      )}
    </div>
  );
}
