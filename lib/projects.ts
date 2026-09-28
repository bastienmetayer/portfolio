export type ProjectKind = "pro" | "perso";

export type Project = {
  slug: string;
  kind: ProjectKind;
  year: string;
  title: string;
  client?: string;
  lead: string;
  body: string[];
  stack: string[];
  cover: string;
  gallery: { src: string; alt: string }[];
  playUrl?: string;
  playLabel?: string;
  demoVideo?: string;
};

export const projects: Project[] = [
  {
    slug: "laetitia-taraud",
    kind: "pro",
    year: "2026",
    title: "Laetitia Taraud",
    client: "Photographe - stage 2e année",
    lead: "Vitrine de mariage et CRM photo, conçus et développés de bout en bout à partir de maquettes et d’un cahier des charges.",
    body: [
      "Stage réalisé en autonomie pour The Digital Wave : un site public pour une photographe de mariage, plus un back-office qui sert vraiment au quotidien.",
      "La vitrine reprend des maquettes WordPress fournies. Le CRM, lui, est pensé from scratch : projets, collections de photos, espace client, et collections rendues publiques sur le site.",
      "Chaque projet peut regrouper plusieurs albums. Les clients voient uniquement leurs livrables. Les échanges avec le maître de stage ont cadré les besoins remontés par la cliente.",
    ],
    stack: ["Laravel 12", "Livewire 4", "Flux UI", "Tailwind", "SQLite"],
    cover: "/images/tdw/crm-dashboard.webp",
    gallery: [
      { src: "/images/tdw/vitrine-bio.webp", alt: "Vitrine publique : section à propos et portfolio de mariages" },
      { src: "/images/tdw/crm-dashboard.webp", alt: "Tableau de bord du CRM : photos, albums, projets" },
      { src: "/images/tdw/crm-photos.webp", alt: "CRM : gestion des photos importées (HD / Web)" },
      { src: "/images/tdw/crm-projets.webp", alt: "CRM : création et suivi des projets clients" },
    ],
  },
  {
    slug: "the-digital-wave",
    kind: "pro",
    year: "2025",
    title: "The Digital Wave",
    client: "Agence - stage 1re année",
    lead: "Site vitrine de l’agence et CRM interne, en équipe de trois développeurs.",
    body: [
      "En charge de la vitrine et de la partie « projets » du CRM (front et back).",
      "Côté client, le suivi de projet affiche les jalons validés et ceux qui restent, avec l’objectif d’une transparence réelle sur l’avancement.",
      "Des notifications partent automatiquement au client à chaque jalon validé.",
    ],
    stack: ["Laravel 12", "Livewire", "Flux UI", "SQLite"],
    cover: "/images/tdh/jalons-status.webp",
    gallery: [
      { src: "/images/tdh/hero.webp", alt: "Accueil de l'agence The Digital Wave" },
      { src: "/images/tdh/jalons-status.webp", alt: "CRM : suivi de projet avec jalons et code couleur (à faire / en cours / terminé)" },
      { src: "/images/tdh/jalons-projet.webp", alt: "CRM : jalons d'un projet, dans l'ordre, avec échéance et documents requis" },
      { src: "/images/tdh/jalons-creation.webp", alt: "CRM : création d'un jalon (échéance, validation, documents requis)" },
    ],
  },
  {
    slug: "geometry-dash",
    kind: "perso",
    year: "2023",
    title: "Geometry Dash",
    client: "NSI - lycée",
    lead: "Clone du rythme-game, en Python / Pygame : obstacles, timing, et boucle de jeu.",
    body: [
      "Développé en spécialité NSI. Le joueur traverse un niveau piégé, calé sur la musique, avec collisions sur blocs et piques.",
      "Le projet m’a forcé à structurer une boucle de jeu, gérer des assets (images, musiques, animations) et déboguer du timing jusqu’à ce que ça « se sente » bien.",
    ],
    stack: ["Python", "Pygame"],
    cover: "/images/gd/gameplay-1.webp",
    gallery: [
      { src: "/images/gd/gameplay-1.webp", alt: "Début de niveau : cube, sol et barre de progression" },
      { src: "/images/gd/gameplay-2.webp", alt: "Franchissement d'un bloc vertical entre deux séries de piques" },
      { src: "/images/gd/gameplay-3.webp", alt: "Enchaînement de piques et blocs en fin de niveau" },
    ],
  },
  {
    slug: "celeste",
    kind: "perso",
    year: "2023",
    title: "Celeste",
    client: "Projet perso - inspiré de Celeste",
    lead: "Jeu de plateformes 2D en Python : salles, collisions, et déplacement type Celeste.",
    body: [
      "Un petit monde de glace, plusieurs salles, un personnage inspiré de Madeline, et des collisions tuile par tuile.",
      "L’enjeu n’était pas le pixel-perfect d’un studio : c’était de faire tenir physique, caméra, sprites et enchaînement de niveaux dans un seul fichier Python lisible.",
    ],
    stack: ["Python", "Pygame"],
    cover: "/images/celeste/gameplay-1.webp",
    gallery: [
      { src: "/images/celeste/gameplay-1.webp", alt: "Madeline sur un plateau de glace, coucher de soleil en arrière-plan" },
      { src: "/images/celeste/gameplay-2.webp", alt: "Salle suivante, Madeline près des piliers de glace" },
      { src: "/images/celeste/gameplay-3.webp", alt: "Madeline face au soleil, en haut de la salle" },
    ],
  },
  {
    slug: "wario-gros",
    kind: "perso",
    year: "2023",
    title: "Wario Gros",
    client: "Projet perso - Pyxel",
    lead: "Plateformer pixel, inspiré de Mario Bros, jouable dans le navigateur.",
    body: [
      "Un niveau construit à la main : plateformes, gravité, saut, sprites animés, et drapeau d’arrivée.",
      "Fait avec Pyxel (fantasy console Python). Le jeu tourne en ligne, sans install.",
    ],
    stack: ["Python", "Pyxel"],
    cover: "/images/wario/gameplay-1.webp",
    gallery: [
      { src: "/images/wario/gameplay-1.webp", alt: "Début de niveau, plateformes flottantes et nuages" },
      { src: "/images/wario/gameplay-2.webp", alt: "Progression sur les plateformes, à l'approche du drapeau" },
      { src: "/images/wario/gameplay-3.webp", alt: "Wario proche du drapeau d'arrivée" },
    ],
    playUrl: "https://www.pyxelstudio.net/8rnajscu",
    playLabel: "Jouer sur Pyxel Studio",
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function projectsByKind(kind: ProjectKind) {
  return projects.filter((p) => p.kind === kind);
}
