import { projects, projectsByKind } from "@/lib/projects";
import { techs } from "@/lib/techs";
import { Reveal } from "@/components/Reveal";
import { ProjectCatalog } from "@/components/ProjectCatalog";

export default function HomePage() {
  const proCount = projectsByKind("pro").length;

  return (
    <main>
      <section className="hero">
        <p className="kicker">Portfolio · 3e année CDA</p>
        <h1>
          Bastien
          <em>Metayer</em>
        </h1>
        <div className="hero-meta">
          <p>
            Applications web en PHP / Laravel.
            <br />
            Jeux et outils en Python, commencés au lycée.
          </p>
          <p>My Digital School, Beaucouzé</p>
        </div>
        <div className="hero-ctas">
          <a className="btn btn-solid" href="#projets">
            Voir les projets
          </a>
          <a className="btn" href="#contact">
            Me contacter
          </a>
        </div>
      </section>

      <div className="ticker" aria-hidden>
        <div className="ticker-track">
          {Array.from({ length: 6 }).map((_, groupIndex) => (
            <span className="tech-group" key={groupIndex}>
              {techs.map((tech) => (
                <span className="tech-item" key={tech.name}>
                  <svg className="tech-icon" viewBox="0 0 24 24">
                    <path d={tech.path} fill={`#${tech.hex}`} />
                  </svg>
                  <b style={{ color: `#${tech.hex}` }}>{tech.name}</b>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <section className="section" id="a-propos">
        <div className="section-head">
          <h2>
            <span className="idx">01</span> Profil
          </h2>
        </div>
        <Reveal className="about-grid">
          <div className="about">
            <p>
              Étudiant en 3e année de Bachelor Concepteur Développeur
              d’Applications à My Digital School (Beaucouzé). Curieux et
              autonome, j’apprends surtout en construisant de vrais projets,
              seul ou en équipe.
            </p>
            <p>
              Côté pro, je développe principalement en PHP / Laravel : sites
              vitrines, CRM, espaces clients. Côté perso, j’ai commencé par le
              jeu vidéo en Python au lycée (spécialité NSI), avec des
              plateformers et un clone de Geometry Dash.
            </p>
            <p>
              J’aime les produits qui servent quelqu’un : un client qui suit
              l’avancement de son projet, une photographe qui livre ses
              collections, un joueur qui finit un niveau.
            </p>
          </div>
          <ul className="facts">
            <li>
              <b>{projects.length}</b>
              <span>Projets livrés</span>
            </li>
            <li>
              <b>{proCount}</b>
              <span>Stages en agence</span>
            </li>
            <li>
              <b>{techs.length}</b>
              <span>Technos pratiquées</span>
            </li>
          </ul>
        </Reveal>
      </section>

      <section className="section" id="projets">
        <div className="section-head">
          <h2>
            <span className="idx">02</span> Projets
          </h2>
        </div>
        <ProjectCatalog projects={projects} />
      </section>

      <section className="contact" id="contact">
        <Reveal className="contact-inner">
          <div>
            <p className="kicker">Discuter</p>
            <h2>Me Contacter</h2>
          </div>
          <div className="actions">
            <a
              className="btn btn-solid"
              href="/cv.pdf"
              target="_blank"
              rel="noreferrer noopener"
            >
              Télécharger le CV
            </a>
            <a className="btn" href="mailto:bastien.metayer49@gmail.com">
              Écrire un mail
            </a>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
