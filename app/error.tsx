"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main>
      <section className="error-page">
        <p className="kicker">Erreur</p>
        <p className="error-code">500</p>
        <h1>Une erreur est survenue</h1>
        <p className="lede">
          Quelque chose s’est mal passé pendant le chargement de cette page.
        </p>
        <div className="hero-ctas">
          <button type="button" className="btn btn-solid" onClick={() => reset()}>
            Réessayer
          </button>
          <Link className="btn" href="/">
            Retour à l’accueil
          </Link>
        </div>
      </section>
    </main>
  );
}
