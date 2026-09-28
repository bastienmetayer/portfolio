import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/lib/projects";
import { Carousel } from "@/components/Carousel";
import { Reveal } from "@/components/Reveal";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return { title: `${project.title} - Bastien Metayer` };
}

export default async function ProjectPage({ params }: { params: Params }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const currentIndex = projects.findIndex((p) => p.slug === project.slug);
  const nextProject = projects[(currentIndex + 1) % projects.length];

  return (
    <main>
      <article className="project-hero">
        <Link href="/#projets" className="back">
          ← Tous les projets
        </Link>
        <p className="kind">
          {project.kind === "pro" ? "Professionnel" : "Personnel"} · {project.year}
        </p>
        {project.client ? <p className="kind">{project.client}</p> : null}
        <h1>{project.title}</h1>
        <p className="lede">{project.lead}</p>
      </article>

      {project.demoVideo ? (
        <Reveal>
          <div className="cover-frame">
            <video
              src={project.demoVideo}
              poster={project.cover}
              autoPlay
              loop
              muted
              playsInline
              controls
            />
          </div>
          <div className="cover-caption">
            <span>Démo : gameplay (boucle ~8 s)</span>
            <span>Réf. {project.slug.toUpperCase()}</span>
          </div>
        </Reveal>
      ) : null}

      <Reveal delay={80}>
        <Carousel images={project.gallery} />
      </Reveal>

      <Reveal delay={120} className="article">
        <div>
          {project.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <aside className="side-card">
          <h3>Stack</h3>
          <ul>
            {project.stack.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          {project.playUrl ? (
            <p style={{ marginTop: "1.2rem" }}>
              <a href={project.playUrl} target="_blank" rel="noreferrer">
                {project.playLabel ?? "Jouer"} →
              </a>
            </p>
          ) : null}
        </aside>
      </Reveal>

      <nav className="project-nav" aria-label="Projet suivant">
        <Link href={`/projets/${nextProject.slug}/`} className="project-nav-link">
          <span className="kind">Projet suivant</span>
          <h3>{nextProject.title} →</h3>
        </Link>
      </nav>
    </main>
  );
}
