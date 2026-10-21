import { Illustration } from "@/components/illustrations";
import type { Project, ProjectStatus } from "@/lib/types";

const STATUS_WASH: Record<ProjectStatus, string> = {
  started: "#7eb6d6",
  "in progress": "#e3b23c",
  finished: "#7d9a78",
};

export function PlayMark({ className = "size-8" }: { className?: string }) {
  return (
    <span className="pointer-events-none absolute top-1.5 right-1.5" aria-hidden="true">
      <svg viewBox="0 0 48 48" className={className}>
        <path
          d="M24 5c7 1 15 5 17 13 2 8-1 16-7 20-7 5-18 5-24 0C4 32 3 21 7 14 11 7 17 4 24 5z"
          fill="#f3e6c0"
          stroke="#1a1a1a"
          strokeWidth="3"
        />
        <path d="M19 16 L33 24 L19 32 Z" fill="#1a1a1a" />
      </svg>
    </span>
  );
}

export function PlusMark() {
  return (
    <svg viewBox="0 0 120 120" className="size-[68%]" aria-hidden="true">
      <path
        d="M54 16c2-6 12-5 12 2l1 28 30-3c6-1 9 7 4 10l-29 5 2 30c1 7-8 10-12 6l-4-29-30 4c-7 1-10-7-5-10l29-6-1-30c0-4 1-6 3-7z"
        fill="#1a1a1a"
      />
    </svg>
  );
}

export function MapGlyph() {
  return (
    <svg viewBox="0 0 64 64" className="size-10" aria-hidden="true">
      <path
        d="M8 16 L22 22 L40 12 L56 20 L56 50 L40 44 L22 52 L8 46 Z"
        fill="#f6edd0"
        stroke="#1a1a1a"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M22 22 V52 M40 12 V44" stroke="#1a1a1a" strokeWidth="2" />
      <circle cx="33" cy="30" r="4" fill="#e15a3a" stroke="#1a1a1a" strokeWidth="2" />
    </svg>
  );
}

export function SquareFace({
  project,
  stillUrl,
  compact = false,
}: {
  project: Project;
  stillUrl?: string;
  compact?: boolean;
}) {
  const painted = project.kind === "illustration" || !stillUrl;
  return (
    <span className="absolute inset-0 block overflow-hidden bg-[#f3e6c0] whitespace-normal">
      {painted ? (
        <Illustration
          name={project.illustrationKey}
          seed={project.id}
          className="size-full"
        />
      ) : (
        // Blob URLs are created in the browser and cannot go through next/image.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={stillUrl} alt="" className="size-full object-cover" />
      )}
      {project.kind === "video" && <PlayMark className={compact ? "size-6" : "size-8"} />}
      {project.standIn && (
        <span className="absolute top-1 left-1 -rotate-6 bg-[#f3e6c0]/85 px-1 font-hand text-[11px] leading-none text-[#1c140c]">
          stand-in
        </span>
      )}
      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#f3e6c0] via-[#f3e6c0]/95 to-transparent px-1.5 pt-6 pb-1.5">
        <span
          className={`block font-hand leading-none text-[#1c140c] ${compact ? "text-[11px]" : "text-sm"}`}
          style={{ boxShadow: `inset 0 -0.35em 0 ${STATUS_WASH[project.status]}` }}
        >
          {project.status}
        </span>
        <span
          className={`mt-1 block font-marker leading-tight text-[#1c140c] uppercase ${compact ? "text-xs" : "text-base sm:text-lg"} line-clamp-2`}
        >
          {project.title}
        </span>
      </span>
    </span>
  );
}
