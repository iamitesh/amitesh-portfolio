import ThemeControls from "./theme-controls";
import MotionEngine from "./motion-engine";
import BrandLogos from "./brand-logos";
import PillFilter from "./pill-filter";
import ProjectBrand from "./project-brand";
import ProjectDisclosure from "./project-disclosure";
import ExperienceBrand from "./experience-brand";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const metrics = [
  { value: 60, suffix: "%", label: "smaller production bundle", index: "01" },
  { value: 85, suffix: "+", label: "enterprise components scaled", index: "02" },
  { value: 77, suffix: "", label: "AI quality checks", index: "03" },
];

const stages = [
  { index: "01", label: "Input", detail: "Design files" },
  { index: "02", label: "Tokens", detail: "Rules + themes" },
  { index: "03", label: "Component", detail: "Typed UI" },
  { index: "04", label: "Orchestrate", detail: "AI agents" },
  { index: "05", label: "Output", detail: "Production" },
];

const caseStudies = [
  {
    index: "01",
    company: "Caterpillar Inc.",
    domain: "Applied AI · Enterprise design system",
    title: "A-Blocks — spec-first AI-assisted engineering",
    summary:
      "Enterprise frontend infrastructure that combines spec-first AI generation, deterministic validation, design-token automation, and cross-framework delivery.",
    outcomes: ["77 automated checks", "85+ components", "~1,630 design tokens"],
    categories: ["caterpillar"],
    details: [
      "Engineered an Agentic Design Lifecycle (ADLC) using schema-driven component contracts, automated self-correction loops, deterministic Playwright validation, and custom Model Context Protocol integrations.",
      "Established a 77-check quality framework spanning component quality, runtime behavior, accessibility, security, and performance for AI-generated frontend components.",
      "Modernized core platform infrastructure across five environments by migrating Blocks and Atoms to Microsoft Entra ID and upgrading CloudFront/Lambda@Edge runtimes from Node.js 20.x to 24.x.",
      "Rolled out Brand Refresh and Dark Theme across 85+ components and approximately 1,630 design tokens across three themes; created Figma-to-token synchronization reaching roughly 80–90% automation.",
      "Architected virtualized hierarchical tables handling 1,000+ nested records, custom column resizing, and collapsible regions to eliminate rendering lag in large enterprise applications.",
      "Resolved seven high/medium Bug Bounty and PII-related vulnerabilities, led secret-leakage investigations, and supported production reliability across seven support rotations.",
      "Managed a 177-work-item engineering footprint, including 53 delegated stories and defects across 15+ cross-functional engineers.",
      "Created repository-hygiene and deployment-consolidation strategies that purged 2,664 stale branches and reduced 25 parallel deployment pipelines to six unified targets.",
    ],
    stack: ["TypeScript", "JavaScript", "Lit", "React", "Angular", "Next.js", "MCP", "JSON Schema", "Playwright", "Storybook", "Figma", "Nx", "Microsoft Entra ID", "AWS Lambda", "CloudFront", "Lambda@Edge", "Vitest", "WCAG 2.1 AA"],
    brand: "caterpillar" as const,
    featured: true,
  },
  {
    index: "02",
    company: "Caterpillar Inc.",
    domain: "Web Components · Platform engineering",
    title: "Blocks Frames — enterprise application shell",
    summary:
      "A reusable enterprise Web Component shell for application chrome, identity, localization, and consistent framework integration.",
    outcomes: ["30% less redundancy", "React + Angular + Next.js", "B2C + Entra ID"],
    categories: ["caterpillar"],
    details: [
      "Developed helios-frames, an enterprise Lit/Web Component library providing reusable Header, Footer, Profile, and Navigation infrastructure, reducing application-level code redundancy by approximately 30%.",
      "Built shared platform architecture supporting React, Angular, and Next.js applications inside a monorepo with reusable playgrounds and common engineering infrastructure.",
      "Integrated multi-authentication flows including B2C and Microsoft Entra ID alongside hybrid localization capabilities.",
    ],
    stack: ["Lit", "Web Components", "TypeScript", "React", "Angular", "Next.js", "Storybook", "Nx", "PNPM", "AWS", "Azure"],
    brand: "caterpillar" as const,
  },
  {
    index: "03",
    company: "EPAM Systems · Everest",
    domain: "Insurance · Reinsurance operations",
    title: "EverTech — underwriting workflow platform",
    summary:
      "Role-based dashboards for clients, brokers, underwriters, risk managers, and administrators to submit, review, and approve insurance contract forms.",
    outcomes: ["60% smaller bundle", "40% faster initial load", "Reusable component library"],
    categories: ["epam"],
    details: [
      "Led frontend architecture discovery and built a production React + TypeScript application from scratch using Webpack.",
      "Architected a private npm React component library with Material UI and Storybook to establish reusable UI foundations.",
      "Implemented Redux middleware, internationalization, REST API integration, and Azure/GitLab CI/CD.",
      "Reduced bundle size by 60% and improved initial load time by 40% using code splitting, tree shaking, lazy loading, and dependency optimization.",
      "Developed comprehensive unit tests with React Testing Library/Jest and built reusable hooks and utilities to improve engineering consistency.",
    ],
    stack: ["React", "TypeScript", "Webpack", "Redux", "Material UI", "Storybook", "AG Grid", "Styled Components", "Jest", "Azure", "GitLab", "SQL"],
    brand: "everest" as const,
  },
  {
    index: "04",
    company: "EPAM Systems · LSEG",
    domain: "Investment banking · Developer tooling",
    title: "Codebook — Jupyter developer experience",
    summary:
      "A cloud-hosted Python and JupyterLab environment for data-science and machine-learning professionals in investment banking.",
    outcomes: ["Custom JupyterLab extensions", "Reusable React widgets", "Python rendering package"],
    categories: ["epam"],
    details: [
      "Developed custom JupyterLab/Jupyter Notebook extensions to improve data-science workflows and notebook functionality.",
      "Managed a library of reusable React widgets integrated into Jupyter experiences.",
      "Designed and maintained a Python library responsible for rendering React widgets and supporting coordinated version releases.",
      "Collaborated across frontend, backend, cloud, and DevOps teams to resolve critical defects, deployment failures, and integration issues.",
      "Produced technical documentation and participated in code reviews to improve maintainability and onboarding.",
    ],
    stack: ["JupyterLab", "React", "Vue.js", "TypeScript", "JavaScript", "Webpack", "Python", "Docker", "Jenkins", "Jest", "AWS"],
    brand: "lseg" as const,
  },
  {
    index: "05",
    company: "EPAM Systems",
    domain: "E-commerce · MACH architecture",
    title: "Composable commerce platform",
    summary:
      "A microfrontend-based Next.js e-commerce experience supporting checkout, payments, and composable commerce workflows.",
    outcomes: ["Microfrontend delivery", "Headless commerce", "End-to-end checkout"],
    categories: ["epam"],
    details: [
      "Implemented a microfrontend-based Next.js storefront supporting checkout, payments, and CRED-related functionality.",
      "Worked with MACH-aligned architecture and composable commerce services including commercetools, Contentful, GraphQL, and Adyen.",
    ],
    stack: ["Next.js", "TypeScript", "Frontastic", "commercetools", "GraphQL", "Contentful", "Adyen", "Microfrontends", "MACH"],
    brand: "epam" as const,
  },
  {
    index: "06",
    company: "Cognizant · Discover Financial Services",
    domain: "Banking · Card member servicing",
    title: "Card Member Assistance — accessible banking workflows",
    summary:
      "Reusable React interfaces for account and card origination, management, servicing, and assisted repayment workflows for US card members.",
    outcomes: ["Reusable UI templates", "ADA accessibility", "Hooks-based modernization"],
    categories: ["cognizant"],
    details: [
      "Developed React applications for card members across multiple banking interfaces and reusable user journeys.",
      "Created common reusable React components and shared UI templates, contributed to project structure, and defined frontend standards used by multiple teams.",
      "Worked across analysis, design, development, testing, deployment support, and production support phases.",
      "Developed responsive interfaces using React, Redux Toolkit, JavaScript, TypeScript, HTML5, CSS3, Bootstrap, and SCSS.",
      "Migrated legacy class-based React implementations toward functional components and Hooks-based patterns.",
      "Improved frontend performance using React Hooks and React DevTools profiling.",
      "Implemented ADA/accessibility requirements and supported Jenkins/Git CI/CD, SiteCatalyst analytics, Playwright, and Sonar.",
    ],
    stack: ["React", "React Hooks", "Redux Toolkit", "TypeScript", "JavaScript", "HTML5", "CSS3", "SCSS", "Bootstrap", "Playwright", "SiteCatalyst", "Jenkins", "Git", "Sonar", "Accessibility"],
    brand: "discover" as const,
  },
  {
    index: "07",
    company: "Cognizant",
    domain: "Frontend · Responsive web application",
    title: "Bus Ticket Booking — responsive booking workflow",
    summary:
      "A responsive booking application for managing reservations, registered-user status, and printable ticket generation.",
    outcomes: ["Responsive UI", "Reservation workflow", "Printable tickets"],
    categories: ["cognizant"],
    details: [
      "Designed and created a responsive booking interface for end users.",
      "Managed reservation data and registered-user booking status to support ticket generation and printing workflows.",
    ],
    stack: ["React", "ES6", "CSS3", "HTML5", "Bootstrap", "Redux"],
    brand: "cognizant" as const,
  },
];

const experience = [
  {
    period: "Jun 2025 — Present",
    company: "Caterpillar Inc.",
    brand: "caterpillar" as const,
    role: "Software Engineer II",
    summary:
      "Building enterprise frontend infrastructure across AI-assisted component generation, design-system scale, Web Components, identity modernization, performance, security, and platform governance.",
    tags: ["A-Blocks ADLC", "77-check validation", "Blocks Frames", "Design-token automation"],
  },
  {
    period: "Jul 2022 — May 2025",
    company: "EPAM Systems",
    brand: "epam" as const,
    role: "Software Engineer II",
    summary:
      "Built insurance platforms, Jupyter-based developer tooling, and composable commerce experiences across React, TypeScript, Next.js, Python, AWS, and microfrontend ecosystems.",
    tags: ["EverTech", "LSEG Codebook", "MACH commerce", "Frontend performance"],
  },
  {
    period: "Jan 2020 — Jun 2022",
    company: "Cognizant",
    brand: "cognizant" as const,
    role: "Associate",
    summary:
      "Developed accessible React banking workflows for Discover Financial Services, reusable UI templates, responsive applications, CI/CD, and frontend performance improvements.",
    tags: ["Card Member Assistance", "React modernization", "ADA accessibility", "Responsive UI"],
  },
];

const capabilities = [
  { number: "01", title: "Frontend architecture", body: "Scalable React and Next.js foundations, Web Components, microfrontends, state systems, frontend performance, and developer experience." },
  { number: "02", title: "Design systems", body: "Lit, design tokens, multi-theme architecture, Storybook, framework parity, Figma automation, accessibility, and enterprise adoption." },
  { number: "03", title: "Applied AI", body: "AI agents, Model Context Protocol, spec-first component architecture, JSON Schema contracts, deterministic validation, and developer tooling." },
  { number: "04", title: "Quality & delivery", body: "Playwright, Jest, Vitest, WCAG/ARIA, CI/CD, cloud platforms, security remediation, repository governance, and performance optimization." },
];

const achievements = [
  { index: "01", title: "Sprint Hero Award", source: "EPAM Systems" },
  { index: "02", title: "Doing the Right Thing the Right Way", source: "Cognizant Award" },
  { index: "03", title: "TED-like web talk speaker", source: "Cognizant" },
  { index: "04", title: "Student Coordinator", source: "NIST Counselling Service" },
];

const additionalTools = [
  { label: "Web Components", categories: ["frontend", "design-systems"] },
  { label: "MCP", categories: ["frontend", "backend"] },
  { label: "JSON Schema", categories: ["frontend", "backend"] },
  { label: "Playwright", categories: ["frontend", "devops"] },
  { label: "Vitest", categories: ["frontend", "devops"] },
  { label: "AG Grid", categories: ["frontend", "design-systems"] },
  { label: "Microsoft Entra ID", categories: ["cloud", "devops"] },
  { label: "CloudFront", categories: ["cloud", "devops"] },
  { label: "Lambda@Edge", categories: ["cloud", "devops"] },
  { label: "Azure", categories: ["cloud", "devops"] },
  { label: "AWS", categories: ["cloud", "devops"] },
  { label: "SQL", categories: ["backend", "cloud"] },
  { label: "REST APIs", categories: ["backend", "cloud"] },
  { label: "JupyterLab", categories: ["frontend", "backend"] },
  { label: "Python", categories: ["backend"] },
  { label: "Frontastic", categories: ["frontend", "cloud"] },
  { label: "commercetools", categories: ["backend", "cloud"] },
  { label: "SiteCatalyst", categories: ["frontend", "cloud"] },
];

function SectionHeading({ index, kicker, title }: { index: string; kicker: string; title: string }) {
  return (
    <div className="section-heading" data-reveal>
      <span>[{index}]</span>
      <p>{kicker}</p>
      <h2>{title}</h2>
    </div>
  );
}

export default function Home() {
  return (
    <main>
      <MotionEngine />
      <div className="scroll-progress" aria-hidden="true" />
      <div className="pointer-aura" aria-hidden="true" />
      <div className="ambient-field" aria-hidden="true">
        <span className="ambient-ring ambient-ring-one" />
        <span className="ambient-ring ambient-ring-two" />
        <span className="ambient-cross ambient-cross-one" />
        <span className="ambient-cross ambient-cross-two" />
      </div>
      <a className="skip-link" href="#content">Skip to content</a>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Amitesh Anand, home">AA <span>/</span></a>
        <div className="topbar-actions">
          <nav className="nav" aria-label="Primary navigation">
            <a href="#experience">Experience</a>
            <a href="#work">Projects</a>
            <a href="#capabilities">Stack</a>
            <a href="#contact">Contact</a>
          </nav>
          <ThemeControls />
        </div>
      </header>

      <div id="content">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">Frontend infrastructure · Design systems · Applied AI</p>
            <h1 id="hero-title" aria-label="I build systems that turn design intent into production software.">
              <span className="hero-line" aria-hidden="true"><span>I build systems</span></span>
              <span className="hero-line" aria-hidden="true"><span>that turn design intent</span></span>
              <span className="hero-line" aria-hidden="true"><span>into production software.</span></span>
            </h1>
            <p className="hero-summary">Software Engineer with 6+ years building frontend applications, enterprise design systems, developer tooling, reusable component libraries, and AI-assisted engineering workflows across manufacturing, insurance, finance, banking, and e-commerce.</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#work" data-magnetic>Explore seven case studies <span aria-hidden="true">↗</span></a>
              <a className="button button-secondary" href={`${basePath}/Amitesh-Anand-Resume.pdf`} download data-magnetic>Download résumé <span aria-hidden="true">↓</span></a>
            </div>
            <p className="current-role"><span aria-hidden="true" /> Currently: Software Engineer II at Caterpillar</p>
          </div>

          <div className="system-visual" aria-hidden="true">
            <span className="visual-scanner" />
            <div className="visual-heading"><span>System map</span><span>01—05</span></div>
            <div className="pipeline">
              {stages.map((stage, i) => (
                <div className={`stage stage-${i + 1}`} key={stage.index}>
                  <span className="stage-index">{stage.index}</span>
                  <div className="stage-symbol"><i /><i /><i /></div>
                  <strong>{stage.label}</strong>
                  <small>{stage.detail}</small>
                </div>
              ))}
              <div className="return-path"><span className="path-particle" /></div>
            </div>
            <div className="visual-footer"><span>Design</span><span>Validate</span><span>Ship</span></div>
          </div>
        </section>

        <section className="metric-strip" aria-label="Career impact" data-reveal>
          {metrics.map((metric) => (
            <article className="metric" key={metric.index}>
              <span className="metric-index">[{metric.index}]</span>
              <div>
                <strong data-count={metric.value} data-suffix={metric.suffix} aria-label={`${metric.value}${metric.suffix}`}>{metric.value}{metric.suffix}</strong>
                <span>{metric.label}</span>
              </div>
            </article>
          ))}
        </section>

        <div className="kinetic-marquee" aria-hidden="true"><div><span>Design systems</span><i>◆</i><span>Frontend architecture</span><i>◆</i><span>Applied AI</span><i>◆</i><span>Web Components</span><i>◆</i><span>Design systems</span><i>◆</i><span>Frontend architecture</span><i>◆</i><span>Applied AI</span><i>◆</i><span>Web Components</span></div></div>

        <section className="section experience-section" id="experience">
          <SectionHeading index="01" kicker="Experience" title="Six years of widening the scope of ownership." />
          <div className="experience-list">
            {experience.map((item, index) => (
              <article className="experience-row" key={item.company} data-reveal>
                <span className="experience-index">0{index + 1}</span>
                <p className="period">{item.period}</p>
                <div className="experience-main">
                  <h3>{item.company}</h3>
                  <ExperienceBrand brand={item.brand} />
                  <p className="role">{item.role}</p>
                  <p>{item.summary}</p>
                  <ul aria-label={`${item.company} focus areas`}>{item.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
                </div>
              </article>
            ))}
          </div>
          <div className="education-note" data-reveal>
            <span>Education</span>
            <div><strong>B.Tech. Electronics & Communication Engineering</strong><p>National Institute of Science & Technology, Berhampur · CGPA 8.02</p></div>
            <span>Aug 2015 — Apr 2019</span>
          </div>
          <div className="achievement-grid" aria-label="Awards and leadership">
            {achievements.map((achievement) => (
              <article key={achievement.index} data-reveal><span>{achievement.index}</span><h3>{achievement.title}</h3><p>{achievement.source}</p></article>
            ))}
          </div>
        </section>

        <section className="section work-section" id="work">
          <SectionHeading index="02" kicker="Project archive" title="Seven systems. Every layer, outcome, and decision." />
          <PillFilter targetId="project-filter-target" label="Filter projects by company" variant="company" />
          <div className="case-study-grid" id="project-filter-target">
            {caseStudies.map((project) => (
              <article className={`case-study${project.featured ? " case-study-featured" : ""}`} key={project.index} data-filter-tags={project.categories.join(" ")} data-reveal data-tilt>
                <ProjectBrand brand={project.brand} />
                <div className="case-study-topline"><span>[{project.index}]</span><span>{project.company}</span></div>
                <p className="case-study-domain">{project.domain}</p>
                <h3>{project.title}</h3>
                <p className="case-study-summary">{project.summary}</p>
                <div className="outcome-list" aria-label={`${project.title} outcomes`}>{project.outcomes.map((outcome) => <strong key={outcome}>{outcome}</strong>)}</div>
                <ProjectDisclosure title={project.title} details={project.details} stack={project.stack} />
                <span className="case-study-signal" aria-hidden="true" />
              </article>
            ))}
          </div>
        </section>

        <section className="section capabilities-section" id="capabilities">
          <SectionHeading index="03" kicker="Capabilities & stack" title="Deep frontend craft. A visible technology map." />
          <div className="capability-grid">
            {capabilities.map((capability) => (
              <article key={capability.number} data-reveal data-tilt><span>{capability.number}</span><h3>{capability.title}</h3><p>{capability.body}</p></article>
            ))}
          </div>
          <div className="brand-wall-heading" data-reveal><p>Technology index</p><span>Filter the original logo wall by development discipline.</span></div>
          <PillFilter targetId="skills-filter-target" label="Filter skills" />
          <div id="skills-filter-target">
            <BrandLogos />
            <div className="tool-cloud" aria-label="Additional technical skills" data-reveal>
              {additionalTools.map((tool) => <span key={tool.label} data-filter-tags={tool.categories.join(" ")}>{tool.label}</span>)}
            </div>
          </div>
        </section>

        <section className="principles-band" data-reveal>
          <p className="eyebrow">How I work</p>
          <blockquote>Make complexity explicit inside the system so people can feel calm outside it.</blockquote>
          <div><p><span>01</span> Clarity over cleverness.</p><p><span>02</span> Evidence over theatre.</p><p><span>03</span> Humans stay in the loop.</p></div>
        </section>

        <section className="contact-section" id="contact" data-reveal>
          <div className="contact-note"><span>[04]</span><p>Available for thoughtful conversations</p></div>
          <h2>Have an ambitious system to build?<br /> Let&apos;s compare notes.</h2>
          <p className="contact-copy">I’m interested in frontend platforms, design systems, applied AI, and forward-deployed product work with real-world consequence.</p>
          <div className="contact-actions">
            <a className="button button-primary" href="mailto:aamitesh.dev@gmail.com" data-magnetic>Start a conversation <span aria-hidden="true">↗</span></a>
            <a className="text-link" href="https://www.linkedin.com/in/amitesh-anand" target="_blank" rel="noreferrer">LinkedIn <span aria-hidden="true">↗</span></a>
            <a className="text-link" href="https://github.com/iamitesh" target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
          </div>
          <div className="human-note"><span>Beyond the screen</span><p>Reading books · Mentoring · Event anchoring · Team-activity planning · Long walks · Cycling</p></div>
        </section>
      </div>

      <footer>
        <a className="brand" href="#top" aria-label="Back to top">AA <span>/</span></a>
        <p>Designed as a system. Written as a human.</p>
        <span>© {new Date().getFullYear()} Amitesh Anand</span>
      </footer>
    </main>
  );
}
