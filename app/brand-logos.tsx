import {
  siAdyen,
  siAngular,
  siAnthropic,
  siApollographql,
  siBootstrap,
  siClaude,
  siConfluence,
  siContentful,
  siCss,
  siDocker,
  siFigma,
  siGit,
  siGithub,
  siGithubactions,
  siGraphql,
  siHtml5,
  siJavascript,
  siJenkins,
  siJira,
  siJupyter,
  siLit,
  siMongodb,
  siMui,
  siNextdotjs,
  siNodedotjs,
  siNpm,
  siPostman,
  siPython,
  siReact,
  siRedux,
  siStorybook,
  siStyledcomponents,
  siTypescript,
  siVite,
  siVuedotjs,
  siWebpack,
} from "simple-icons";
import type { CSSProperties } from "react";

type BrandIcon = {
  title: string;
  path: string;
  hex: string;
};

const brands: Array<{ icon: BrandIcon; label?: string; categories: string[] }> = [
  { icon: siReact, categories: ["frontend", "design-systems"] },
  { icon: siTypescript, categories: ["frontend", "backend", "design-systems"] },
  { icon: siJavascript, categories: ["frontend", "backend"] },
  { icon: siNextdotjs, categories: ["frontend", "backend", "cloud"] },
  { icon: siNodedotjs, categories: ["backend", "cloud"] },
  { icon: siNpm, categories: ["frontend", "backend", "devops"] },
  { icon: siHtml5, categories: ["frontend", "design-systems"] },
  { icon: siCss, label: "CSS3", categories: ["frontend", "design-systems"] },
  { icon: siBootstrap, categories: ["frontend", "design-systems"] },
  { icon: siMui, label: "Material UI", categories: ["frontend", "design-systems"] },
  { icon: siRedux, categories: ["frontend"] },
  { icon: siGraphql, categories: ["backend", "cloud"] },
  { icon: siApollographql, label: "Apollo GraphQL", categories: ["backend", "cloud"] },
  { icon: siGit, categories: ["devops"] },
  { icon: siGithub, categories: ["devops", "cloud"] },
  { icon: siGithubactions, label: "GitHub Actions", categories: ["devops", "cloud"] },
  { icon: siWebpack, categories: ["frontend", "devops"] },
  { icon: siVite, categories: ["frontend", "devops"] },
  { icon: siStorybook, categories: ["frontend", "design-systems"] },
  { icon: siStyledcomponents, label: "Styled Components", categories: ["frontend", "design-systems"] },
  { icon: siLit, label: "Lit", categories: ["frontend", "design-systems"] },
  { icon: siAngular, categories: ["frontend", "design-systems"] },
  { icon: siVuedotjs, label: "Vue.js", categories: ["frontend"] },
  { icon: siJupyter, label: "JupyterLab", categories: ["backend", "cloud", "ai"] },
  { icon: siPython, categories: ["backend", "ai"] },
  { icon: siMongodb, label: "MongoDB", categories: ["backend", "cloud"] },
  { icon: siDocker, categories: ["devops", "cloud"] },
  { icon: siJenkins, categories: ["devops", "cloud"] },
  { icon: siPostman, categories: ["backend", "devops"] },
  { icon: siFigma, categories: ["frontend", "design-systems"] },
  { icon: siContentful, categories: ["backend", "cloud"] },
  { icon: siAdyen, categories: ["backend", "cloud"] },
  { icon: siConfluence, categories: ["devops", "design-systems"] },
  { icon: siJira, categories: ["devops", "cloud"] },
  { icon: siAnthropic, categories: ["ai", "cloud"] },
  { icon: siClaude, categories: ["ai"] },
];

export default function BrandLogos() {
  return (
    <div className="brand-wall" aria-label="Skills and tools with brand logos">
      {brands.map(({ icon, label, categories }, index) => (
        <div
          className="brand-tile"
          key={`${icon.title}-${label ?? ""}`}
          data-filter-tags={categories.join(" ")}
          data-reveal
          style={{ "--brand-delay": `${(index % 6) * 45}ms` } as CSSProperties}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            role="img"
            style={{ "--brand-color": `#${icon.hex}` } as CSSProperties}
          >
            <path d={icon.path} />
          </svg>
          <span>{label ?? icon.title}</span>
        </div>
      ))}
    </div>
  );
}
