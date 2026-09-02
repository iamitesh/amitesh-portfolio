"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./knowledge-base.module.css";

// Same pinned CDN the article pipeline uses; mermaid renders client-side so
// the static export stays fully offline-capable (diagram code is shown in a
// styled fallback block when the CDN is unreachable).
const MERMAID_CDN = "https://cdn.jsdelivr.net/npm/mermaid@11.4.1/dist/mermaid.min.js";

type MermaidGlobal = {
  initialize: (config: Record<string, unknown>) => void;
  render: (id: string, code: string) => Promise<{ svg: string }>;
};

let loadPromise: Promise<MermaidGlobal> | null = null;

function loadMermaid(): Promise<MermaidGlobal> {
  const win = window as unknown as { mermaid?: MermaidGlobal };
  if (win.mermaid) return Promise.resolve(win.mermaid);
  if (!loadPromise) {
    loadPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = MERMAID_CDN;
      script.async = true;
      script.onload = () => {
        const mermaid = (window as unknown as { mermaid?: MermaidGlobal }).mermaid;
        if (!mermaid) {
          reject(new Error("mermaid failed to load"));
          return;
        }
        mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
          themeVariables: {
            darkMode: true,
            background: "#0b111d",
            primaryColor: "#101827",
            primaryTextColor: "#dce6fb",
            primaryBorderColor: "#3b4d70",
            secondaryColor: "#111a2a",
            tertiaryColor: "#0f1725",
            lineColor: "#7faeff",
            fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
            fontSize: "14px",
            actorBkg: "#101827",
            actorBorder: "#3b4d70",
            actorTextColor: "#dce6fb",
            signalColor: "#aeb9cf",
            signalTextColor: "#aeb9cf",
            labelBoxBkgColor: "#101827",
            labelBoxBorderColor: "#3b4d70",
            labelTextColor: "#dce6fb",
            noteBkgColor: "#111827",
            noteBorderColor: "#3b4d70",
            noteTextColor: "#dce6fb",
          },
        });
        resolve(mermaid);
      };
      script.onerror = () => reject(new Error("mermaid CDN unreachable"));
      document.head.appendChild(script);
    });
    loadPromise.catch(() => {
      loadPromise = null; // allow a retry on the next diagram
    });
  }
  return loadPromise;
}

export default function MermaidDiagram({
  code,
  caption,
}: {
  code: string;
  caption?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadMermaid()
      .then((mermaid) => {
        if (cancelled) return;
        const id = "kb-mmd-" + Math.random().toString(36).slice(2, 10);
        return mermaid.render(id, code).then(({ svg }) => {
          if (cancelled || !hostRef.current) return;
          hostRef.current.innerHTML = svg;
        });
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [code]);

  return (
    <figure className={styles.mermaidBox}>
      {failed ? (
        <pre className={styles.mermaidFallback}>{code}</pre>
      ) : (
        <div ref={hostRef} className={styles.mermaidHost} aria-label="Diagram" />
      )}
      {caption ? <figcaption className={styles.diagramCaption}>{caption}</figcaption> : null}
    </figure>
  );
}
