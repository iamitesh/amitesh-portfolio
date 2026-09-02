import ThemeControls from "./theme-controls";
import MotionEngine from "./motion-engine";
import BrandLogos from "./brand-logos";
import PillFilter from "./pill-filter";
import ProjectBrand from "./project-brand";
import ProjectDisclosure from "./project-disclosure";
import ExperienceBrand from "./experience-brand";
import ContactActions from "./contact-actions";

const metrics = [
  { value: 60, suffix: "%", label: "smaller production bundle", index: "01" },
  { value: 85, suffix: "%+", label: "automated test coverage", index: "02" },
  { value: 77, suffix: "", label: "AI quality checks", index: "03" },
];

const stages = [
  { index: "01", label: "Input", detail: "Design files" },
  { index: "02", label: "Tokens", detail: "Rules + themes" },
  { index: "03", label: "Component", detail: "Typed UI" },
  { index: "04", label: "Orchestrate", detail: "5 AI agents" },
  { index: "05", label: "Output", detail: "Production" },
];

const caseStudies = [
  {
    index: "01",
    company: "Caterpillar Inc.",
    domain: "Applied AI · Enterprise design system",
    title: "Spec-driven Blocks — AI-assisted component generation",
    summary:
      "An AI-assisted production pipeline that translates design intent into governed, framework-ready components while keeping accessibility, security, tokens, and human review inside the system.",
    outcomes: ["5 producer agents", "77 automated checks", "~70% projected time reduction"],
    categories: ["caterpillar"],
    details: [
      "Architected a multi-agent workflow spanning Figma analysis, Azure DevOps context, specification generation, React production, and quality review.",
      "Designed a 10-layer quality framework with 77 deterministic checks plus Playwright runtime validation.",
      "Defined framework-neutral spec.yaml contracts to preserve behavior and API parity across React, Angular, and future stacks.",
      "Built token and Style Dictionary workflows for reliable multi-theme output; the pilot projects a 2.8× improvement in first-pass validation.",
    ],
    stack: ["Claude", "MCP", "Figma", "React", "Angular", "Lit", "JSON Schema", "Playwright", "Azure DevOps"],
    brand: "caterpillar" as const,
    featured: true,
  },
  {
    index: "02",
    company: "Caterpillar Inc.",
    domain: "Web Components · Platform engineering",
    title: "Blocks Frames — enterprise application shell",
    summary:
      "A reusable shell for the essential surfaces around enterprise applications: header, footer, navigation, profile, authentication, and localization.",
    outcomes: ["30% less redundancy", "3 framework playgrounds", "2 identity models"],
    categories: ["caterpillar"],
    details: [
      "Engineered helios-frames as a Lit-based component system that can serve teams without coupling the shell to their application framework.",
      "Delivered reusable Header, Footer, Profile, and Navigation patterns with consistent responsive and accessible behavior.",
      "Integrated B2C and Microsoft Entra ID identity paths for consumer and enterprise application contexts.",
      "Created React, Angular, and Next.js playgrounds so teams could validate integrations early and adopt the platform with less friction.",
    ],
    stack: ["Lit", "Web Components", "TypeScript", "React", "Angular", "Next.js", "Storybook", "Nx"],
    brand: "caterpillar" as const,
  },
  {
    index: "03",
    company: "Caterpillar Inc.",
    domain: "Analytics · Enterprise platform",
    title: "Blocks Analytics — design-system intelligence",
    summary:
      "An analytics initiative within Blocks that turns component and application data into understandable, reusable enterprise experiences.",
    outcomes: ["Reusable analytics UI", "Token-aligned visuals", "Consistent data states"],
    categories: ["caterpillar"],
    details: [
      "Developed frontend surfaces for presenting analytics through reusable and accessible Blocks patterns.",
      "Connected typed UI components to application data while handling loading, error, empty, and populated states consistently.",
      "Kept analytics experiences aligned with Blocks tokens, themes, responsive behavior, and enterprise accessibility expectations.",
      "Collaborated across product, design, and engineering to translate analytics requirements into maintainable interface patterns.",
    ],
    stack: ["React", "TypeScript", "Blocks", "Design Tokens", "Data Visualization", "REST APIs", "Accessibility"],
    brand: "caterpillar" as const,
  },
  {
    index: "04",
    company: "Caterpillar Inc.",
    domain: "Design system · Component platform",
    title: "Blocks System — the enterprise UI foundation",
    summary:
      "Direct contribution to the Blocks design system itself: the shared components, tokens, documentation, and quality standards used by enterprise product teams.",
    outcomes: ["Shared UI foundations", "Multi-theme consistency", "Cross-framework adoption"],
    categories: ["caterpillar"],
    details: [
      "Built and maintained reusable components intended for consistent use across enterprise applications.",
      "Applied design tokens, theming, accessibility, and responsive behavior as core component requirements rather than afterthoughts.",
      "Supported documentation and examples that made component behavior and integration expectations clear to adopting teams.",
      "Helped maintain framework compatibility and governance across React, Angular, and Web Component consumers.",
    ],
    stack: ["Lit", "Web Components", "React", "Angular", "TypeScript", "Storybook", "Design Tokens", "Accessibility"],
    brand: "caterpillar" as const,
  },
  {
    index: "05",
    company: "EPAM Systems · Everest",
    domain: "Insurance · Reinsurance operations",
    title: "EverTech — underwriting workflow platform",
    summary:
      "A role-based insurance platform for clients, brokers, underwriters, and administrators to submit contracts, review risk data, and manage approvals.",
    outcomes: ["60% smaller bundle", "40% faster initial load", "85%+ test coverage"],
    categories: ["epam"],
    details: [
      "Architected a private npm React component library with Material UI and Storybook, reducing feature development time by 25% through reusable foundations.",
      "Built a production-ready React and TypeScript application from scratch with Webpack and role-specific dashboards for clients, brokers, underwriters, and administrators.",
      "Implemented Redux state management with middleware, internationalization (I18n), and Azure GitLab CI/CD pipelines for reliable multi-role releases.",
      "Partnered with backend engineers to integrate REST APIs and deliver reliable frontend-backend workflows for contract submissions and approvals.",
      "Optimized code splitting and build configuration, cutting bundle size by 60% and initial load time by 40%; maintained 85%+ coverage with React Testing Library.",
    ],
    stack: ["React", "TypeScript", "Webpack", "Redux", "Storybook", "AG Grid", "RC Dock", "Material UI", "Styled Components", "SQL", "Azure"],
    brand: "everest" as const,
  },
  {
    index: "06",
    company: "EPAM Systems · LSEG",
    domain: "Investment banking · Developer tooling",
    title: "Codebook — cloud notebook experience",
    summary:
      "A cloud-hosted Python scripting and notebook environment that gives data scientists and quantitative professionals richer analysis workflows inside JupyterLab.",
    outcomes: ["5+ custom extensions", "30+ React widgets", "25% fewer defects"],
    categories: ["epam"],
    details: [
      "Developed more than five custom JupyterLab extensions that added purpose-built workflows for financial analysis and increased user productivity.",
      "Managed a library of 30+ reusable React widgets and designed a Python rendering package for consistent integration and version releases.",
      "Worked across backend, cloud, and DevOps teams to diagnose critical defects in a complex distributed environment.",
      "Improved team knowledge sharing by 40% through technical documentation and reduced code defects by 25% through rigorous reviews.",
    ],
    stack: ["JupyterLab", "React", "Vue.js", "TypeScript", "Python", "Webpack", "Node.js", "AWS", "Docker", "Jenkins", "Refinitiv", "Confluence", "Jira"],
    brand: "lseg" as const,
  },
  {
    index: "07",
    company: "EPAM Systems",
    domain: "E-commerce · MACH architecture",
    title: "Composable commerce platform",
    summary:
      "A microfrontend e-commerce experience built around MACH principles, connecting content, commerce, payments, and checkout into a coherent customer journey.",
    outcomes: ["End-to-end checkout", "Microfrontend delivery", "Headless commerce"],
    categories: ["epam"],
    details: [
      "Implemented a Next.js storefront using a microfrontend architecture so commerce capabilities could evolve and deploy independently.",
      "Connected the full purchase cycle—from product and content experiences to cart, payment, and checkout—with API-first services.",
      "Integrated commercetools, Adyen, GraphQL, and Contentful within the Frontastic orchestration layer.",
      "Applied MACH principles—microservices, API-first, cloud-native SaaS, and headless delivery—to keep the platform modular and adaptable.",
    ],
    stack: ["Frontastic", "Next.js", "commercetools", "Adyen", "GraphQL", "Contentful", "Microfrontends", "MACH"],
    brand: "epam" as const,
  },
  {
    index: "08",
    company: "Cognizant · Discover Financial Services",
    domain: "Banking · Repayment planning",
    title: "Card Assistant System — CMA repayment workflow",
    summary:
      "A guided four-step experience within the wider CMA banking program for creating, validating, reviewing, signing, and downloading repayment plans for card and loan accounts.",
    outcomes: ["4-step workflow", "Flexible payment schedules", "Signed PDF report"],
    categories: ["cognizant"],
    details: [
      "Contributed within CMA, a suite covering bank-account types, card opening, and card-member management interfaces for Discover Financial Services.",
      "Step 1 captured the customer, eligible accounts, repayment method, total amount, installment period, and the start and end dates of the plan.",
      "Step 2 sent the plan to backend APIs for validation and returned a month-by-month schedule with dates and amounts.",
      "Supported two repayment strategies: an initial partial payment followed by installments, or an even split across the selected period.",
      "Step 3 presented the complete schedule for review, with the ability to return to earlier steps and edit before confirmation and signature.",
      "Step 4 generated the finalized signed report as a downloadable PDF, completing the end-to-end repayment application workflow.",
      "Migrated class-based interfaces to React 16.8 functional components and Hooks, while implementing web accessibility across the flow.",
    ],
    stack: ["React 16.8", "React Hooks", "JavaScript", "TypeScript", "Redux", "REST APIs", "Form Workflows", "PDF Generation", "Bootstrap", "Playwright", "SCSS", "SiteCatalyst", "React DevTools", "Accessibility"],
    brand: "discover" as const,
  },
  {
    index: "09",
    company: "Cognizant · Discover Financial Services",
    domain: "Banking · Fraud operations",
    title: "Fraud Detection — incident reporting workflow",
    summary:
      "A form-led application that helped operations teams classify fraud, capture incident information, and produce a structured case report for follow-up.",
    outcomes: ["Guided fraud intake", "Structured case data", "Case-ready incident report"],
    categories: ["cognizant"],
    details: [
      "Built guided forms for selecting the fraud type and recording the information required to report an incident.",
      "Used validation and conditional form states so the workflow could adapt to the selected fraud scenario while keeping required data complete.",
      "Connected the frontend workflow to backend APIs for submitting incident data and retrieving the resulting case information.",
      "Generated a structured report summarizing the incident and the information captured for the operational team handling the case.",
      "Applied reusable React patterns and accessibility practices so dense form interactions remained understandable and keyboard-friendly.",
    ],
    stack: ["React", "JavaScript", "TypeScript", "Redux", "REST APIs", "Form Validation", "HTML5", "SCSS", "Playwright", "Accessibility"],
    brand: "discover" as const,
  },
];

const experience = [
  {
    period: "Jun 2025 — Present",
    company: "Caterpillar Inc.",
    brand: "caterpillar" as const,
    role: "Software Engineer II",
    summary:
      "Leading frontend and AI architecture for an enterprise design system—spanning multi-agent generation, framework-neutral specifications, Web Components, identity, and quality automation.",
    tags: ["Spec-driven Blocks", "Blocks Frames", "Blocks Analytics", "Blocks System"],
  },
  {
    period: "Jul 2022 — May 2025",
    company: "EPAM Systems",
    brand: "epam" as const,
    role: "Software Engineer II",
    summary:
      "Built insurance platforms, Jupyter-based developer tools, and composable commerce experiences across React, Next.js, Python, AWS, and microfrontend ecosystems.",
    tags: ["EverTech", "Codebook", "MACH commerce", "Performance"],
  },
  {
    period: "Jan 2020 — Jun 2022",
    company: "Cognizant",
    brand: "cognizant" as const,
    role: "Associate",
    summary:
      "Developed accessible React workflows for Discover Financial Services across card and account management, repayment-plan orchestration, and fraud-incident reporting.",
    tags: ["Card Assistant (CME)", "Fraud reporting", "React modernization", "Accessibility"],
  },
];

const capabilities = [
  {
    number: "01",
    title: "Frontend architecture",
    body: "Scalable React and Next.js foundations, microfrontends, state systems, performance strategy, and developer experience.",
  },
  {
    number: "02",
    title: "Design systems",
    body: "Web Components, tokens, multi-theme architecture, Storybook, framework parity, accessibility, and adoption at enterprise scale.",
  },
  {
    number: "03",
    title: "Applied AI",
    body: "Multi-agent workflows, MCP integrations, LLM orchestration, structured specifications, validation, and model-backed product experiences.",
  },
  {
    number: "04",
    title: "Quality & delivery",
    body: "Playwright and Jest automation, CI/CD, Docker, cloud platforms, schema validation, and measurable performance optimization.",
  },
];

const achievements = [
  { index: "01", title: "Sprint Hero Award", source: "EPAM Systems" },
  { index: "02", title: "Doing the Right Thing the Right Way", source: "Cognizant Award" },
  { index: "03", title: "TED-like web talk speaker", source: "Cognizant" },
  { index: "04", title: "Student Coordinator", source: "NIST Counselling Service" },
];

const additionalTools = [
  { label: "Web Components", categories: ["frontend", "design-systems"] },
  { label: "Playwright", categories: ["frontend", "devops"] },
  { label: "AG Grid", categories: ["frontend", "design-systems"] },
  { label: "RC Dock", categories: ["frontend", "design-systems"] },
  { label: "Azure", categories: ["cloud", "devops"] },
  { label: "AWS", categories: ["cloud", "devops"] },
  { label: "SQL", categories: ["backend", "cloud"] },
  { label: "NoSQL", categories: ["backend", "cloud"] },
  { label: "REST APIs", categories: ["backend", "cloud"] },
  { label: "Refinitiv Eikon", categories: ["backend", "cloud"] },
  { label: "Frontastic", categories: ["frontend", "cloud"] },
  { label: "commercetools", categories: ["backend", "cloud"] },
  { label: "SiteCatalyst", categories: ["frontend", "cloud"] },
  { label: "C", categories: ["backend"] },
  { label: "Data structures & algorithms", categories: ["backend"] },
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
            <p className="eyebrow">Frontend architecture · Design systems · Applied AI</p>
            <h1 id="hero-title" aria-label="I build systems that turn design intent into production software.">
              <span className="hero-line" aria-hidden="true"><span>I build systems</span></span>
              <span className="hero-line" aria-hidden="true"><span>that turn design intent</span></span>
              <span className="hero-line" aria-hidden="true"><span>into production software.</span></span>
            </h1>
            <p className="hero-summary">
              Software Engineer with 6+ years building resilient products across insurance, banking, finance, e-commerce, enterprise design systems, and AI-assisted delivery.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#work" data-magnetic>Explore nine case studies <span aria-hidden="true">↗</span></a>
              <a className="button button-secondary" href="/Amitesh-Anand-Resume.pdf" download data-magnetic>Download résumé <span aria-hidden="true">↓</span></a>
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
                <strong data-count={metric.value} data-suffix={metric.suffix} aria-label={`${metric.value}${metric.suffix}`}>
                  {metric.value}{metric.suffix}
                </strong>
                <span>{metric.label}</span>
              </div>
            </article>
          ))}
        </section>

        <div className="kinetic-marquee" aria-hidden="true">
          <div><span>Design systems</span><i>◆</i><span>Frontend architecture</span><i>◆</i><span>Applied AI</span><i>◆</i><span>Web Components</span><i>◆</i><span>Design systems</span><i>◆</i><span>Frontend architecture</span><i>◆</i><span>Applied AI</span><i>◆</i><span>Web Components</span></div>
        </div>

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
                  <ul aria-label={`${item.company} focus areas`}>
                    {item.tags.map((tag) => <li key={tag}>{tag}</li>)}
                  </ul>
                </div>
              </article>
            ))}
          </div>
          <div className="education-note" data-reveal>
            <span>Education</span>
            <div>
              <strong>B.Tech. Electronics & Communication Engineering</strong>
              <p>National Institute of Science & Technology, Berhampur · CGPA 8.02</p>
            </div>
            <span>Aug 2015 — Apr 2019</span>
          </div>

          <div className="achievement-grid" aria-label="Awards and leadership">
            {achievements.map((achievement) => (
              <article key={achievement.index} data-reveal>
                <span>{achievement.index}</span>
                <h3>{achievement.title}</h3>
                <p>{achievement.source}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section work-section" id="work">
          <SectionHeading index="02" kicker="Project archive" title="Nine systems. Every layer, outcome, and decision." />
          <PillFilter targetId="project-filter-target" label="Filter projects by company" variant="company" />
          <div className="case-study-grid" id="project-filter-target">
            {caseStudies.map((project) => (
              <article
                className={`case-study${project.featured ? " case-study-featured" : ""}`}
                key={project.index}
                data-filter-tags={project.categories.join(" ")}
                data-reveal
                data-tilt
              >
                <ProjectBrand brand={project.brand} />
                <div className="case-study-topline">
                  <span>[{project.index}]</span>
                  <span>{project.company}</span>
                </div>
                <p className="case-study-domain">{project.domain}</p>
                <h3>{project.title}</h3>
                <p className="case-study-summary">{project.summary}</p>
                <div className="outcome-list" aria-label={`${project.title} outcomes`}>
                  {project.outcomes.map((outcome) => <strong key={outcome}>{outcome}</strong>)}
                </div>
                <ProjectDisclosure
                  title={project.title}
                  details={project.details}
                  stack={project.stack}
                />
                <span className="case-study-signal" aria-hidden="true" />
              </article>
            ))}
          </div>
        </section>

        <section className="section capabilities-section" id="capabilities">
          <SectionHeading index="03" kicker="Capabilities & stack" title="Deep frontend craft. A visible technology map." />
          <div className="capability-grid">
            {capabilities.map((capability) => (
              <article key={capability.number} data-reveal data-tilt>
                <span>{capability.number}</span>
                <h3>{capability.title}</h3>
                <p>{capability.body}</p>
              </article>
            ))}
          </div>
          <div className="brand-wall-heading" data-reveal>
            <p>Technology index</p>
            <span>Filter the original logo wall by development discipline.</span>
          </div>
          <PillFilter targetId="skills-filter-target" label="Filter skills" />
          <div id="skills-filter-target">
            <BrandLogos />
            <div className="tool-cloud" aria-label="Additional technical skills" data-reveal>
              {additionalTools.map((tool) => (
                <span key={tool.label} data-filter-tags={tool.categories.join(" ")}>
                  {tool.label}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="principles-band" data-reveal>
          <p className="eyebrow">How I work</p>
          <blockquote>Make complexity explicit inside the system so people can feel calm outside it.</blockquote>
          <div>
            <p><span>01</span> Clarity over cleverness.</p>
            <p><span>02</span> Evidence over theatre.</p>
            <p><span>03</span> Humans stay in the loop.</p>
          </div>
        </section>

        <section className="contact-section" id="contact" data-reveal>
          <div className="contact-note"><span>[04]</span><p>Available for thoughtful conversations</p></div>
          <h2>Have an ambitious system to build?<br /> Let&apos;s compare notes.</h2>
          <p className="contact-copy">I’m interested in frontend platforms, design systems, applied AI, and forward-deployed product work with real-world consequence.</p>
          <ContactActions />
          <div className="human-note">
            <span>Beyond the screen</span>
            <p>Reading books · Mentoring · Event anchoring · Team-activity planning · Long walks · Cycling</p>
          </div>
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
