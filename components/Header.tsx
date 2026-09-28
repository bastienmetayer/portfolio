import Link from "next/link";

export function Header() {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link href="/" className="brand">
          <strong>Bastien Metayer</strong>
          <span>Concepteur développeur d’applications</span>
        </Link>
        <nav className="nav" aria-label="Principal">
          <Link href="/#a-propos">
            <i>01</i>À propos
          </Link>
          <Link href="/#projets">
            <i>02</i>Projets
          </Link>
          <Link href="/#contact">
            <i>03</i>Contact
          </Link>
          <a href="/cv.pdf" target="_blank" rel="noreferrer noopener">
            <i>04</i>CV
          </a>
        </nav>
      </div>
    </header>
  );
}
