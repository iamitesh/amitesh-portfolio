import styles from "./knowledge-base.module.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type Section = {
  title: string;
  body?: string;
  bullets?: string[];
};

export default function TopicPage({
  eyebrow,
  title,
  intro,
  tags,
  sections,
  note,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  tags: string[];
  sections: Section[];
  note: string;
}) {
  return (
    <main className={styles.shell}>
      <div className={styles.wrap}>
        <header className={styles.topbar}>
          <a className={styles.brand} href={`${basePath}/knowledge-base/`}>AA / Knowledge Base</a>
          <a className={styles.back} href={`${basePath}/knowledge-base/`}>← All notes</a>
        </header>
        <article className={styles.article}>
          <header className={styles.articleHeader}>
            <span className={styles.eyebrow}>{eyebrow}</span>
            <h1>{title}</h1>
            <p>{intro}</p>
            <div className={styles.tags}>{tags.map((tag) => <span className={styles.tag} key={tag}>{tag}</span>)}</div>
          </header>
          <div className={styles.topicBody}>
            <div>
              {sections.map((section, index) => (
                <section className={styles.section} key={section.title}>
                  <div className={styles.kicker}>Reference {String(index + 1).padStart(2, "0")}</div>
                  <h2>{section.title}</h2>
                  {section.body ? <p>{section.body}</p> : null}
                  {section.bullets ? (
                    <div className={styles.panel}>
                      <ul>{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul>
                    </div>
                  ) : null}
                </section>
              ))}
            </div>
            <aside className={styles.sideNote}>
              <h3>Design rule</h3>
              <p>{note}</p>
            </aside>
          </div>
        </article>
      </div>
    </main>
  );
}
