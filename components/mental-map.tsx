import { SquareFace } from "@/components/square-face";
import { clusterByTheme } from "@/lib/cluster";
import type { Project } from "@/lib/types";

const FILLS = ["#c5d4bc", "#efd39a", "#f3b5a6", "#b7d6e8", "#f0dc96", "#f6edd0"];

function blobPath(seed: number) {
  const count = 9;
  const points: [number, number][] = [];
  for (let i = 0; i < count; i += 1) {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
    const jitter = 0.78 + ((Math.sin(seed * 0.17 + i * 1.9) + 1) / 2) * 0.28;
    points.push([
      100 + Math.cos(angle) * 78 * jitter,
      100 + Math.sin(angle) * 74 * jitter,
    ]);
  }
  let d = "";
  for (let i = 0; i < count; i += 1) {
    const current = points[i];
    const next = points[(i + 1) % count];
    const midX = (current[0] + next[0]) / 2;
    const midY = (current[1] + next[1]) / 2;
    if (i === 0) d += `M ${midX.toFixed(1)} ${midY.toFixed(1)}`;
    d += ` Q ${next[0].toFixed(1)} ${next[1].toFixed(1)} ${((next[0] + points[(i + 2) % count][0]) / 2).toFixed(1)} ${((next[1] + points[(i + 2) % count][1]) / 2).toFixed(1)}`;
  }
  return `${d} Z`;
}

function hash(value: string) {
  let h = 0;
  for (let i = 0; i < value.length; i += 1) h = (h * 33 + value.charCodeAt(i)) >>> 0;
  return h;
}

export function MentalMap({
  projects,
  stillUrls,
  onOpen,
}: {
  projects: Project[];
  stillUrls: Record<string, string>;
  onOpen: (project: Project) => void;
}) {
  const clusters = clusterByTheme(projects);

  if (clusters.length === 0) {
    return (
      <p className="px-4 py-16 text-center font-hand text-2xl text-[#1c140c]">
        nothing is pinned on the map yet.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2 px-1 pb-16" data-testid="theme-map">
      {clusters.map((cluster, index) => {
        const seed = hash(cluster.key);
        const tilt = ((seed % 50) - 25) / 12;
        return (
          <section key={cluster.key} className="relative mx-auto w-full max-w-3xl">
            <svg
              viewBox="0 0 200 200"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
              style={{ transform: `rotate(${tilt}deg)` }}
              aria-hidden="true"
            >
              <path
                d={blobPath(seed)}
                fill={FILLS[index % FILLS.length]}
                stroke="#1a1a1a"
                strokeWidth="3"
              />
            </svg>
            <div className="relative px-6 py-8 sm:px-10">
              <h2
                className="font-hand text-2xl leading-none text-[#1c140c] uppercase sm:text-3xl"
                style={{ transform: `rotate(${tilt / 2}deg)` }}
              >
                {cluster.label}
              </h2>
              <ul className="mt-4 flex flex-wrap gap-3">
                {cluster.projects.map((project) => (
                  <li key={project.id} className="w-24 sm:w-28">
                    <button
                      type="button"
                      data-testid={`map-project-${project.id}`}
                      onClick={() => onOpen(project)}
                      className="project-cell relative block aspect-square w-full overflow-hidden border-0 bg-[#f7f6f3] p-0 shadow-none outline-none ring-0 focus-visible:ring-0"
                      style={{ transform: `rotate(${project.rotation}deg)` }}
                      aria-label={`${project.title}, ${project.status}${project.kind === "video" ? ", video" : ""}`}
                    >
                      <SquareFace
                        project={project}
                        stillUrl={stillUrls[project.id]}
                        compact
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        );
      })}
    </div>
  );
}
