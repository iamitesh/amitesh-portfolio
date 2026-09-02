"use client";

import { useEffect, useState } from "react";

const disciplineFilters = [
  { id: "all", label: "All", examples: "Everything" },
  { id: "frontend", label: "Frontend", examples: "React · Redux" },
  { id: "backend", label: "Backend", examples: "Node · Python" },
  { id: "devops", label: "DevOps", examples: "Jenkins · Docker" },
  { id: "cloud", label: "Cloud", examples: "AWS · Azure" },
  { id: "ai", label: "Applied AI", examples: "Agents · MCP" },
  { id: "design-systems", label: "Design systems", examples: "Lit · Storybook" },
];

const companyFilters = [
  { id: "all", label: "All companies", examples: "9 projects" },
  { id: "caterpillar", label: "Caterpillar", examples: "4 projects" },
  { id: "epam", label: "EPAM", examples: "3 projects" },
  { id: "cognizant", label: "Cognizant", examples: "2 projects" },
];

export default function PillFilter({
  targetId,
  label,
  variant = "discipline",
}: {
  targetId: string;
  label: string;
  variant?: "discipline" | "company";
}) {
  const [active, setActive] = useState("all");
  const [matchStats, setMatchStats] = useState<{ visible: number; total: number } | null>(null);
  const filters = variant === "company" ? companyFilters : disciplineFilters;

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;

    const items = Array.from(target.querySelectorAll<HTMLElement>("[data-filter-tags]"));
    let visibleCount = 0;
    items.forEach((item) => {
      const tags = (item.dataset.filterTags ?? "").split(" ");
      const matches = active === "all" || tags.includes(active);
      item.hidden = !matches;
      item.setAttribute("aria-hidden", String(!matches));
      if (matches) visibleCount++;
    });
    const frame = requestAnimationFrame(() => {
      setMatchStats({ visible: visibleCount, total: items.length });
    });
    return () => cancelAnimationFrame(frame);
  }, [active, targetId]);

  return (
    <div className="filter-panel" data-reveal>
      <div className="filter-header">
        <p className="filter-label">{label}</p>
        {matchStats && (
          <span className="filter-count-badge">
            Showing {matchStats.visible} of {matchStats.total}
          </span>
        )}
      </div>
      <div className="filter-pills" role="group" aria-label={label}>
        {filters.map((filter) => (
          <button
            className="filter-pill"
            type="button"
            key={filter.id}
            aria-controls={targetId}
            aria-pressed={active === filter.id}
            onClick={() => setActive(filter.id)}
          >
            <span>{filter.label}</span>
            <small>{filter.examples}</small>
          </button>
        ))}
      </div>
    </div>
  );
}
