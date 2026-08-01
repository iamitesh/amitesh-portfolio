"use client";

import { useEffect } from "react";

type MotionDocument = Document & {
  startViewTransition?: (callback: () => void) => void;
};

export default function MotionEngine() {
  useEffect(() => {
    const root = document.documentElement;
    const doc = document as MotionDocument;
    let scrollFrame = 0;
    let pointerFrame = 0;
    const cleanups: Array<() => void> = [];

    const motionIsReduced = () => root.dataset.motion === "reduced";

    const updateScroll = () => {
      scrollFrame = 0;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      root.style.setProperty("--scroll-progress", String(progress));
      root.style.setProperty("--page-scroll", `${window.scrollY}px`);
      document.body.classList.toggle("has-scrolled", window.scrollY > 28);
    };

    const onScroll = () => {
      if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateScroll);
    };
    updateScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    cleanups.push(() => window.removeEventListener("scroll", onScroll));

    const onPointerMove = (event: PointerEvent) => {
      if (motionIsReduced() || event.pointerType === "touch") return;
      if (pointerFrame) window.cancelAnimationFrame(pointerFrame);
      pointerFrame = window.requestAnimationFrame(() => {
        root.style.setProperty("--pointer-x", `${event.clientX}px`);
        root.style.setProperty("--pointer-y", `${event.clientY}px`);
      });
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    cleanups.push(() => window.removeEventListener("pointermove", onPointerMove));

    const tiltItems = Array.from(
      document.querySelectorAll<HTMLElement>("[data-tilt]"),
    );
    tiltItems.forEach((item) => {
      const move = (event: PointerEvent) => {
        if (motionIsReduced() || event.pointerType === "touch") return;
        const rect = item.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        item.style.setProperty("--tilt-x", `${y * -3.5}deg`);
        item.style.setProperty("--tilt-y", `${x * 4.5}deg`);
        item.style.setProperty("--glow-x", `${(x + 0.5) * 100}%`);
        item.style.setProperty("--glow-y", `${(y + 0.5) * 100}%`);
      };
      const leave = () => {
        item.style.setProperty("--tilt-x", "0deg");
        item.style.setProperty("--tilt-y", "0deg");
      };
      item.addEventListener("pointermove", move);
      item.addEventListener("pointerleave", leave);
      cleanups.push(() => {
        item.removeEventListener("pointermove", move);
        item.removeEventListener("pointerleave", leave);
      });
    });

    const magneticItems = Array.from(
      document.querySelectorAll<HTMLElement>("[data-magnetic]"),
    );
    magneticItems.forEach((item) => {
      const move = (event: PointerEvent) => {
        if (motionIsReduced() || event.pointerType === "touch") return;
        const rect = item.getBoundingClientRect();
        const x = event.clientX - (rect.left + rect.width / 2);
        const y = event.clientY - (rect.top + rect.height / 2);
        item.style.setProperty("--magnetic-x", `${x * 0.12}px`);
        item.style.setProperty("--magnetic-y", `${y * 0.16}px`);
      };
      const leave = () => {
        item.style.setProperty("--magnetic-x", "0px");
        item.style.setProperty("--magnetic-y", "0px");
      };
      item.addEventListener("pointermove", move);
      item.addEventListener("pointerleave", leave);
      cleanups.push(() => {
        item.removeEventListener("pointermove", move);
        item.removeEventListener("pointerleave", leave);
      });
    });

    const countItems = Array.from(
      document.querySelectorAll<HTMLElement>("[data-count]"),
    );
    const renderFinalCount = (item: HTMLElement) => {
      const prefix = item.dataset.prefix ?? "";
      const suffix = item.dataset.suffix ?? "";
      const target = Number(item.dataset.count ?? "0");
      const decimals = Number.isInteger(target) ? 0 : 1;
      item.textContent = `${prefix}${target.toFixed(decimals)}${suffix}`;
    };
    const animateCount = (item: HTMLElement) => {
      if (item.dataset.counted === "true") return;
      item.dataset.counted = "true";
      if (motionIsReduced()) {
        renderFinalCount(item);
        return;
      }
      const prefix = item.dataset.prefix ?? "";
      const suffix = item.dataset.suffix ?? "";
      const target = Number(item.dataset.count ?? "0");
      const decimals = Number.isInteger(target) ? 0 : 1;
      const started = performance.now();
      const duration = 1200;
      const tick = (now: number) => {
        const elapsed = Math.min((now - started) / duration, 1);
        const eased = 1 - Math.pow(1 - elapsed, 4);
        item.textContent = `${prefix}${(target * eased).toFixed(decimals)}${suffix}`;
        if (elapsed < 1) window.requestAnimationFrame(tick);
      };
      window.requestAnimationFrame(tick);
    };

    if ("IntersectionObserver" in window) {
      const counterObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCount(entry.target as HTMLElement);
              counterObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.65 },
      );
      countItems.forEach((item) => counterObserver.observe(item));
      cleanups.push(() => counterObserver.disconnect());
    } else {
      countItems.forEach(renderFinalCount);
    }

    const onMotionChange = () => {
      if (!motionIsReduced()) return;
      root.style.setProperty("--tilt-x", "0deg");
      root.style.setProperty("--tilt-y", "0deg");
      countItems.forEach(renderFinalCount);
    };
    window.addEventListener("aa-motion-change", onMotionChange);
    cleanups.push(() => window.removeEventListener("aa-motion-change", onMotionChange));

    root.classList.add("motion-enhanced");
    return () => {
      cleanups.forEach((cleanup) => cleanup());
      if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
      if (pointerFrame) window.cancelAnimationFrame(pointerFrame);
      root.classList.remove("motion-enhanced");
      void doc;
    };
  }, []);

  return null;
}
