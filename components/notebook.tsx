"use client";

import { useEffect, useRef, useState } from "react";
import { MentalMap } from "@/components/mental-map";
import { ProjectDialog } from "@/components/project-dialog";
import { MapGlyph, PlusMark, SquareFace } from "@/components/square-face";
import { Button } from "@/components/ui/button";
import { deleteProject, loadNotebook, notebookErrorMessage, saveProject } from "@/lib/db";
import type { PreparedMedia } from "@/lib/media";
import type { Project, ProjectStatus } from "@/lib/types";

type Draft = {
  title: string;
  story: string;
  theme: string;
  status: ProjectStatus;
  media: PreparedMedia | null;
};

export function Notebook() {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [projects, setProjects] = useState<Project[]>([]);
  const [stillUrls, setStillUrls] = useState<Record<string, string>>({});
  const [view, setView] = useState<"grid" | "map">("grid");
  const [attempt, setAttempt] = useState(0);
  const [editor, setEditor] = useState<
    { mode: "create" } | { mode: "edit"; id: string } | null
  >(null);
  const liveUrls = useRef<Set<string>>(new Set());

  useEffect(() => {
    const urls = liveUrls.current;
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
      urls.clear();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const local: string[] = [];
    loadNotebook()
      .then(({ projects: loaded, stills }) => {
        const urls: Record<string, string> = {};
        for (const [id, blob] of Object.entries(stills)) {
          const url = URL.createObjectURL(blob);
          local.push(url);
          urls[id] = url;
        }
        if (cancelled) {
          local.forEach((url) => URL.revokeObjectURL(url));
          return;
        }
        local.forEach((url) => liveUrls.current.add(url));
        setProjects(loaded);
        setStillUrls(urls);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const editing =
    editor?.mode === "edit" ? projects.find((project) => project.id === editor.id) ?? null : null;

  function rememberStill(projectId: string, blob: Blob) {
    const url = URL.createObjectURL(blob);
    liveUrls.current.add(url);
    setStillUrls((previous) => {
      const old = previous[projectId];
      if (old && old !== url) {
        liveUrls.current.delete(old);
        queueMicrotask(() => URL.revokeObjectURL(old));
      }
      return { ...previous, [projectId]: url };
    });
  }

  async function handleSave(draft: Draft) {
    const now = Date.now();
    if (editor?.mode === "edit") {
      if (!editing) throw new Error("that square is already gone.");
      const next: Project = {
        ...editing,
        title: draft.title,
        story: draft.story,
        theme: draft.theme,
        status: draft.status,
        updatedAt: now,
      };
      if (draft.media) {
        next.kind = draft.media.kind;
        next.illustrationKey = undefined;
        next.standIn = false;
      }
      try {
        await saveProject(
          next,
          draft.media
            ? {
                projectId: next.id,
                kind: draft.media.kind,
                blob: draft.media.blob,
                mime: draft.media.mime,
                poster: draft.media.poster,
              }
            : null,
        );
      } catch (error) {
        throw new Error(notebookErrorMessage(error));
      }
      setProjects((previous) => previous.map((item) => (item.id === next.id ? next : item)));
      if (draft.media) {
        rememberStill(
          next.id,
          draft.media.kind === "video" ? draft.media.poster ?? draft.media.blob : draft.media.blob,
        );
      }
      return;
    }

    const id = crypto.randomUUID();
    const project: Project = {
      id,
      title: draft.title,
      story: draft.story,
      theme: draft.theme,
      status: draft.status,
      kind: draft.media?.kind ?? "illustration",
      illustrationKey: draft.media ? undefined : "blank",
      rotation: Math.round((Math.random() * 3 - 1.5) * 10) / 10,
      createdAt: now,
      updatedAt: now,
      standIn: false,
    };
    try {
      await saveProject(
        project,
        draft.media
          ? {
              projectId: id,
              kind: draft.media.kind,
              blob: draft.media.blob,
              mime: draft.media.mime,
              poster: draft.media.poster,
            }
          : null,
      );
    } catch (error) {
      throw new Error(notebookErrorMessage(error));
    }
    setProjects((previous) => [...previous, project]);
    if (draft.media) {
      rememberStill(
        id,
        draft.media.kind === "video" ? draft.media.poster ?? draft.media.blob : draft.media.blob,
      );
    }
  }

  async function handleDelete(project: Project) {
    try {
      await deleteProject(project.id);
    } catch (error) {
      throw new Error(notebookErrorMessage(error));
    }
    setProjects((previous) => previous.filter((item) => item.id !== project.id));
    setStillUrls((previous) => {
      const old = previous[project.id];
      if (!old) return previous;
      URL.revokeObjectURL(old);
      liveUrls.current.delete(old);
      const next = { ...previous };
      delete next[project.id];
      return next;
    });
  }

  return (
    <div className="relative z-10 min-h-full pb-16">
      <div className="sticky top-0 z-30 flex items-center justify-between gap-3 bg-[#f7f6f3]/95 px-3 py-2">
        {view === "map" ? (
          <Button
            type="button"
            variant="outline"
            data-testid="back-to-grid"
            className="min-h-12 rounded-none border-[3px] border-[#1c140c] bg-[#f6edd0] font-hand text-base uppercase"
            onClick={() => setView("grid")}
          >
            back to the grid
          </Button>
        ) : (
          <span className="sr-only">home</span>
        )}
        {view === "grid" && (
          <Button
            type="button"
            variant="outline"
            data-testid="open-map"
            aria-label="Open the mental map"
            className="ml-auto min-h-14 min-w-14 rounded-none border-[3px] border-[#1c140c] bg-[#f6edd0] p-1"
            onClick={() => setView("map")}
          >
            <MapGlyph />
          </Button>
        )}
      </div>

      <header className="px-4 pt-2 pb-5 text-center">
        <h1 className="font-title text-[2.45rem] leading-[0.95] text-[#1c140c] sm:text-6xl md:text-7xl">
          AN EPIC SAGA
        </h1>
        <p className="mt-2 font-hand text-xl text-[#1c140c] sm:text-2xl">personal projects</p>
      </header>

      {status === "loading" && (
        <p className="px-6 py-16 text-center font-hand text-2xl" role="status">
          finding the page…
        </p>
      )}

      {status === "error" && (
        <div className="px-6 py-16 text-center">
          <p className="font-hand text-2xl" role="alert">
            the notebook would not open.
          </p>
          <Button
            type="button"
            className="mt-4 min-h-12 rounded-none border-2 border-[#1c140c] font-hand uppercase"
            onClick={() => {
              setStatus("loading");
              setAttempt((value) => value + 1);
            }}
          >
            try again
          </Button>
        </div>
      )}

      {status === "ready" && view === "grid" && (
        <>
          {projects.length === 0 && (
            <p className="mx-auto mb-6 max-w-xs px-4 text-center font-hand text-2xl leading-snug">
              the squares are gone. the page is still yours.
            </p>
          )}
          <ul
            data-testid="project-grid"
            className="grid grid-cols-2 gap-x-3 gap-y-4 px-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5"
          >
            {projects.map((project) => (
              <li key={project.id} className="min-w-0">
                <Button
                  type="button"
                  variant="ghost"
                  data-testid={`project-${project.id}`}
                  aria-label={`${project.title}, ${project.status}${project.kind === "video" ? ", video" : ""}`}
                  onClick={() => setEditor({ mode: "edit", id: project.id })}
                  className="project-cell relative aspect-square h-auto w-full overflow-hidden rounded-none border-0 bg-[#f7f6f3] p-0 shadow-none outline-none ring-0 hover:bg-[#f7f6f3] focus-visible:ring-0"
                  style={{ transform: `rotate(${project.rotation}deg)` }}
                >
                  <SquareFace project={project} stillUrl={stillUrls[project.id]} />
                </Button>
              </li>
            ))}
            <li className="min-w-0">
              <Button
                type="button"
                variant="outline"
                data-testid="add-project"
                aria-label="Add a project"
                onClick={() => setEditor({ mode: "create" })}
                className="project-cell relative aspect-square h-auto w-full rounded-none border-0 bg-[#f6edd0] p-0 shadow-none outline-none ring-0 hover:bg-[#efe2b8] focus-visible:ring-0"
                style={{ transform: "rotate(-0.7deg)" }}
              >
                <PlusMark />
              </Button>
            </li>
          </ul>
        </>
      )}

      {status === "ready" && view === "map" && (
        <MentalMap
          projects={projects}
          stillUrls={stillUrls}
          onOpen={(project) => setEditor({ mode: "edit", id: project.id })}
        />
      )}

      <ProjectDialog
        open={editor !== null && (editor.mode === "create" || editing !== null)}
        mode={editor?.mode ?? "create"}
        project={editing}
        projects={projects}
        stillUrl={editing ? stillUrls[editing.id] : undefined}
        onOpenChange={(open) => {
          if (!open) setEditor(null);
        }}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
}
