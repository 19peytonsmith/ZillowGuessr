"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faQuestion,
  faEnvelope,
  faBolt,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { Particles } from "@/components/ui/particles";

export default function SplashPage() {
  const playText = "Play".split("");
  const [showWhat, setShowWhat] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowWhat(false);
    };

    if (showWhat) {
      document.addEventListener("keydown", onKey);
      // prevent background scroll and add dimming class
      document.body.classList.add("modal-open");
      // focus the close button for accessibility
      setTimeout(() => closeBtnRef.current?.focus(), 0);
    } else {
      document.body.classList.remove("modal-open");
    }

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("modal-open");
    };
  }, [showWhat]);

  return (
    <div className="splash-wrap position-relative overflow-hidden">
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        aria-hidden
        style={{ zIndex: 1, pointerEvents: "none" }}
      >
        <Particles
          className="w-100 h-100"
          quantity={100}
          ease={60}
          color="#888"
          refresh
          style={{ position: "absolute", inset: 0, zIndex: 1 }}
        />
      </div>
      <div
        style={{ zIndex: 2 }}
        className="main-content splash-hero p-5 mx-auto position-relative text-center"
      >
        <div
          className="d-flex justify-content-between align-items-center"
          style={{ gap: 8 }}
        >
          <div className="header-left d-flex align-items-center">
            {/* left-aligned question button */}
            <button
              type="button"
              className="what-btn"
              aria-haspopup="dialog"
              aria-expanded={showWhat}
              aria-controls="what-modal"
              onClick={() => setShowWhat(true)}
              title="What is this?"
            >
              <FontAwesomeIcon icon={faQuestion} />
            </button>
          </div>

          <div className="header-right d-flex align-items-center gap-2">
            <ThemeToggle />

            <Link
              href="/contact-me"
              className="btn btn-outline-secondary"
              aria-label="Contact me"
            >
              <FontAwesomeIcon icon={faEnvelope} />
              <span className="ms-2">Contact Me</span>
            </Link>
          </div>
        </div>

        <h1 className="splash-title">
          ZillowGuessr
          <span className="subtle-mark" aria-hidden>
            ?
          </span>
        </h1>

        <p className="splash-lead">
          ZillowGuessr is a GeoGuessr-inspired game where you’re shown 5 random
          homes — complete with photos and details — and your challenge is
          simple: guess the price!
        </p>

        <div className="splash-cta">
          <Link
            href="/play"
            className="play-btn"
            aria-label="Play ZillowGuessr"
          >
            <span className="play-text">
              {playText.map((ch, idx) => (
                <span
                  key={idx}
                  className="play-letter"
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  {ch}
                </span>
              ))}
            </span>
          </Link>

          <Link
            href="/leaderboards"
            className="btn btn-lg btn-outline-secondary ghost-btn-accessible"
          >
            Leaderboards
          </Link>
        </div>

        <hr />

        <div className="meta-row">
          <div className="byline" aria-label="Author">
            By Peyton Smith
          </div>
          <div className="links d-flex gap-2 align-items-center">
            <a
              className="icon-link theme-like"
              href="https://github.com/19peytonsmith/zillowguessr-v2"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="GitHub repository link"
            >
              <FontAwesomeIcon icon={faGithub} />
              <span className="visually-hidden">GitHub</span>
            </a>

            {/* Buy-me-an-energy-drink button — placeholder link to BuyMeACoffee profile */}
            <a
              className="energy-btn"
              href="https://www.buymeacoffee.com/19peytonsmith"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Buy me an Energy Drink (tips)"
              title="Buy me an Energy Drink"
            >
              <FontAwesomeIcon icon={faBolt} />
              <span className="ms-2 buy-energy-text">
                Buy me an Energy Drink
              </span>
            </a>
          </div>
        </div>

        {showWhat &&
          createPortal(
            <div
              className="splash-modal-backdrop"
              role="presentation"
              onClick={(e) => {
                if (e.target === e.currentTarget) setShowWhat(false);
              }}
            >
              <div
                id="what-modal"
                className="splash-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="what-modal-title"
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <h2 id="what-modal-title">What is this?</h2>
                  <div>
                    <button
                      ref={closeBtnRef}
                      className="btn btn-outline-secondary modal-close"
                      onClick={() => setShowWhat(false)}
                      aria-label="Close dialog"
                    >
                      <FontAwesomeIcon icon={faXmark} aria-hidden />
                      <span className="visually-hidden">Close</span>
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: 12 }}>
                  <p>
                    ZillowGuessr is a small, educational project that shows a
                    set of publicly listed homes and asks players to guess their
                    listed price. The homes displayed are discovered by a
                    server-side process that programmatically collects publicly
                    available listing pages and extracts images and basic
                    metadata.
                  </p>
                  <h3>How are homes selected?</h3>
                  <p>
                    Homes are gathered from public listing pages using automated
                    scraping tools. The scraper visits publicly accessible pages
                    and extracts photos and non-sensitive listing details. The
                    selection is randomized from the collected pool so each
                    session shows a variety of properties.
                  </p>
                  <h3>Data sources & cadence</h3>
                  <p>
                    The project uses publicly available listing pages as its
                    source. Scraping runs periodically to refresh the pool of
                    properties; it does not continuously monitor a single
                    listing. Because listings and prices are frequently updated,
                    game data may not reflect the most recent changes on the
                    original listing sites.
                  </p>
                  <h3>Privacy & disclaimers</h3>
                  <p>
                    This project only uses information that is publicly
                    available on listing pages. It does not collect or expose
                    private user data. The game is for entertainment/educational
                    use. Prices shown are taken from listing metadata and may
                    differ from final sale prices. The project is not affiliated
                    with any listing platform.
                  </p>
                  <h3>Questions or concerns?</h3>
                  <p>
                    If you have questions about the data or want a listing
                    removed from the pool, please use the Contact link to get in
                    touch.
                  </p>
                </div>
              </div>
            </div>,
            document.body
          )}
      </div>
    </div>
  );
}
