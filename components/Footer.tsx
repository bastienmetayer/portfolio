import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-col">
            <strong className="footer-brand">Bastien Metayer</strong>
            
          </div>

          <div className="footer-col">
            <span className="footer-heading">Navigation</span>
            <nav className="footer-links">
              <Link href="/#a-propos">À propos</Link>
              <Link href="/#projets">Projets</Link>
              <Link href="/#contact">Contact</Link>
              <a href="/cv.pdf" target="_blank" rel="noreferrer noopener">
                CV
              </a>
            </nav>
          </div>

          <div className="footer-col">
            <span className="footer-heading">Contact</span>
            <nav className="footer-links">
              <a href="mailto:bastien.metayer49@gmail.com">
                bastien.metayer49@gmail.com
              </a>
              <a
                href="https://github.com/bastienmetayer"
                target="_blank"
                rel="noreferrer noopener"
              >
                github.com/bastienmetayer
              </a>
            </nav>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Bastien Metayer</span>
          <span className="scale-bar" aria-hidden>
            {Array.from({ length: 8 }).map((_, i) => (
              <i key={i} />
            ))}
          </span>
          <span>Feuille CDA · 2026</span>
        </div>
      </div>
    </footer>
  );
}
