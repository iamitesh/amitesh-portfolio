"use client";

import { useState } from "react";

export default function ContactActions() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("aamitesh.dev@gmail.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      // Fallback if clipboard API is restricted
      window.location.href = "mailto:aamitesh.dev@gmail.com";
    }
  };

  return (
    <div className="contact-actions">
      <a className="button button-primary" href="mailto:aamitesh.dev@gmail.com" data-magnetic>
        Start a conversation <span aria-hidden="true">↗</span>
      </a>
      <button
        className="button button-secondary copy-email-btn"
        type="button"
        onClick={copyEmail}
        aria-live="polite"
        data-magnetic
      >
        <span>{copied ? "Copied to clipboard!" : "Copy email"}</span>
        <span aria-hidden="true">{copied ? "✓" : "📋"}</span>
      </button>
      <a className="text-link" href="https://www.linkedin.com/in/amitesh-anand" target="_blank" rel="noreferrer">
        LinkedIn <span aria-hidden="true">↗</span>
      </a>
      <a className="text-link" href="https://github.com/iamitesh" target="_blank" rel="noreferrer">
        GitHub <span aria-hidden="true">↗</span>
      </a>
    </div>
  );
}
