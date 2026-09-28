"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Project, ProjectKind } from "@/lib/projects";
import { Reveal } from "./Reveal";

type Filter = "all" | ProjectKind;

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "Tous" },
  { key: "pro", label: "Professionnel" },
  { key: "perso", label: "Personnel" },
];

export function ProjectCatalog({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(
    () => projects.filter((p) => filter === "all" || p.kind === filter),
    [projects, filter]
  );

  return (
    <div>
      <div className="filter-pills" role="tablist" aria-label="Filtrer les projets">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={filter === key}
            className={"filter-pill" + (filter === key ? " active" : "")}
            onClick={() => setFilter(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="catalog-empty">Aucun projet dans cette catégorie pour le moment.</p>
      ) : (
        <div className="catalog">
          {filtered.map((project, i) => (
            <Reveal key={project.slug} delay={Math.min(i, 4) * 60}>
              <Link
                href={`/projets/${project.slug}/`}
                className={"row" + (i === filtered.length - 1 ? " row-last" : "")}
              >
                <span className="num">0{i + 1}</span>
                <div>
                  <p className="kind">
                    {project.kind === "pro" ? "Professionnel" : "Personnel"} · {project.year}
                  </p>
                  <h3>{project.title}</h3>
                  <p>{project.lead}</p>
                  <div className="chips">
                    {project.stack.map((s) => (
                      <span className="chip" key={s}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="thumb">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={project.cover} alt="" loading="lazy" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
