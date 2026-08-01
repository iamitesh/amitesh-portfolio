"use client";

import { useId, useState } from "react";

export default function ProjectDisclosure({
  title,
  details,
  stack,
}: {
  title: string;
  details: string[];
  stack: string[];
}) {
  const [expanded, setExpanded] = useState(false);
  const panelId = useId();

  return (
    <div className="case-study-details" data-expanded={expanded}>
      <button
        className="switch-pill project-breakdown-switch"
        type="button"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={() => setExpanded((current) => !current)}
      >
        <span>Project breakdown</span>
        <span className="switch-track" aria-hidden="true">
          <span className="switch-thumb" />
        </span>
      </button>
      <div
        className="case-study-details-panel"
        id={panelId}
        aria-hidden={!expanded}
      >
        <div className="case-study-breakdown">
          <p>Project breakdown</p>
          <ul>
            {details.map((detail) => <li key={detail}>{detail}</li>)}
          </ul>
        </div>
        <div className="case-study-stack" aria-label={`${title} technology stack`}>
          {stack.map((item) => <span key={item}>{item}</span>)}
        </div>
      </div>
    </div>
  );
}
