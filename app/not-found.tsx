import Link from "next/link";

export const metadata = {
  title: "Page introuvable - Bastien Metayer",
};

export default function NotFound() {
  return (
    <main>
      <section className="error-page">
        <p className="kicker">Erreur 404</p>
        <p className="error-code">404</p>
        <h1>Page introuvable</h1>
        <p className="lede">
          Cette page n’existe pas ou plus. Vérifie l’adresse, ou repars depuis l’accueil.
        </p>
        <div className="hero-ctas">
          <Link className="btn btn-solid" href="/">
            Retour à l’accueil
          </Link>
          <Link className="btn" href="/#projets">
            Voir les projets
          </Link>
        </div>
      </section>
    </main>
  );
}
