"use client";

import { useEffect, useState } from "react";

type Theme = "grid" | "midnight" | "editorial";

const themes: Array<{ id: Theme; label: string; description: string }> = [
  { id: "grid", label: "Grid", description: "Precision Grid theme" },
  { id: "midnight", label: "Signal", description: "Midnight Signal theme" },
  { id: "editorial", label: "Paper", description: "Systems on Paper theme" },
];

function applyMotionPreference(reduced: boolean) {
  document.documentElement.dataset.motion = reduced ? "reduced" : "full";
  window.localStorage.setItem("aa-motion-reduced", String(reduced));
  window.dispatchEvent(new Event("aa-motion-change"));
}

export default function ThemeControls() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof document === "undefined") return "grid";
    return (document.documentElement.dataset.theme ?? "grid") as Theme;
  });
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof document === "undefined") return false;
    return document.documentElement.dataset.motion === "reduced";
  });

  useEffect(() => {
    document.body.classList.add("motion-ready");
  }, []);

  useEffect(() => {
    const revealItems = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );

    if (reducedMotion || !("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    revealItems.forEach((item) => {
      if (!item.classList.contains("is-visible")) observer.observe(item);
    });
    return () => observer.disconnect();
  }, [reducedMotion]);

  const chooseTheme = (nextTheme: Theme) => {
    const applyTheme = () => {
      setTheme(nextTheme);
      document.documentElement.dataset.theme = nextTheme;
      window.localStorage.setItem("aa-theme", nextTheme);
    };
    const transitionDocument = document as Document & {
      startViewTransition?: (callback: () => void) => void;
    };
    if (!reducedMotion && transitionDocument.startViewTransition) {
      transitionDocument.startViewTransition(applyTheme);
    } else {
      applyTheme();
    }
  };

  const toggleMotion = () => {
    const nextReduced = !reducedMotion;
    setReducedMotion(nextReduced);
    applyMotionPreference(nextReduced);
  };

  return (
    <div className="appearance-controls" aria-label="Appearance controls">
      <div className="theme-picker" role="group" aria-label="Choose site theme">
        {themes.map((option) => (
          <button
            className={`theme-option theme-option-${option.id}`}
            type="button"
            key={option.id}
            aria-label={option.description}
            aria-pressed={theme === option.id}
            onClick={() => chooseTheme(option.id)}
          >
            <span className="theme-swatch" aria-hidden="true" />
            <span>{option.label}</span>
          </button>
        ))}
      </div>
      <button
        className="motion-toggle switch-pill"
        type="button"
        role="switch"
        aria-checked={reducedMotion}
        aria-label={reducedMotion ? "Enable full motion" : "Reduce motion"}
        onClick={toggleMotion}
      >
        <span>Reduce motion</span>
        <span className="switch-track" aria-hidden="true">
          <span className="switch-thumb" />
        </span>
      </button>
    </div>
  );
}
