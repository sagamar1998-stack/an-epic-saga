"use client";

import { useEffect, useRef, useState } from "react";
import { Illustration } from "@/components/illustrations";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { themeChoices } from "@/lib/cluster";
import { getMedia } from "@/lib/db";
import { MediaError, prepareMedia, type PreparedMedia } from "@/lib/media";
import { STATUSES, type Project, type ProjectStatus } from "@/lib/types";

const fieldClass =
  "min-h-12 rounded-none border-2 border-[#1c140c] bg-[#f6edd0] px-3 font-hand text-lg text-[#1c140c] shadow-none";

type Pending = PreparedMedia & { previewUrl: string };

export function ProjectDialog({
  open,
  mode,
  project,
  projects,
  stillUrl,
  onOpenChange,
  onSave,
  onDelete,
}: {
  open: boolean;
  mode: "create" | "edit";
  project: Project | null;
  projects: Project[];
  stillUrl?: string;
  onOpenChange: (open: boolean) => void;
  onSave: (draft: {
    title: string;
    story: string;
    theme: string;
    status: ProjectStatus;
    media: PreparedMedia | null;
  }) => Promise<void>;
  onDelete: (project: Project) => Promise<void>;
}) {
  const formKey = mode === "edit" ? project?.id ?? "missing" : "create";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="saga-sheet top-0 left-0 flex h-[100dvh] w-screen max-w-none translate-x-0 translate-y-0 grid-rows-none flex-col gap-0 overflow-hidden rounded-none bg-[#f3e6c0] p-0 text-[#1c140c] ring-0 sm:top-1/2 sm:left-1/2 sm:h-[min(92dvh,900px)] sm:max-h-[92dvh] sm:w-[min(42rem,94vw)] sm:max-w-[42rem] sm:-translate-x-1/2 sm:-translate-y-1/2"
        style={{ backgroundColor: "#f3e6c0", display: "flex", flexDirection: "column" }}
      >
        {open && (
          <ProjectForm
            key={formKey}
            mode={mode}
            project={project}
            projects={projects}
            stillUrl={stillUrl}
            onOpenChange={onOpenChange}
            onSave={onSave}
            onDelete={onDelete}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function ProjectForm({
  mode,
  project,
  projects,
  stillUrl,
  onOpenChange,
  onSave,
  onDelete,
}: {
  mode: "create" | "edit";
  project: Project | null;
  projects: Project[];
  stillUrl?: string;
  onOpenChange: (open: boolean) => void;
  onSave: (draft: {
    title: string;
    story: string;
    theme: string;
    status: ProjectStatus;
    media: PreparedMedia | null;
  }) => Promise<void>;
  onDelete: (project: Project) => Promise<void>;
}) {
  const [title, setTitle] = useState(project?.title ?? "");
  const [story, setStory] = useState(project?.story ?? "");
  const [theme, setTheme] = useState(project?.theme ?? "");
  const [status, setStatus] = useState<ProjectStatus | null>(project?.status ?? null);
  const [pending, setPending] = useState<Pending | null>(null);
  const [playbackUrl, setPlaybackUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const pendingUrl = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (pendingUrl.current) URL.revokeObjectURL(pendingUrl.current);
    };
  }, []);

  useEffect(() => {
    if (!project || project.kind !== "video") return;
    let cancelled = false;
    let url: string | null = null;
    getMedia(project.id)
      .then((media) => {
        if (cancelled || !media) return;
        url = URL.createObjectURL(media.blob);
        setPlaybackUrl(url);
      })
      .catch(() => {
        if (!cancelled) setError("the clip would not come back off the page.");
      });
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [project]);

  const suggestions = themeChoices(projects);
  const showVideo = pending?.kind === "video" || (!pending && project?.kind === "video");
  const videoSrc = pending?.kind === "video" ? pending.previewUrl : playbackUrl;
  const imageSrc = pending?.kind === "image" ? pending.previewUrl : !pending && project?.kind === "image" ? stillUrl : undefined;

  async function onFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const prepared = await prepareMedia(file);
      if (pendingUrl.current) URL.revokeObjectURL(pendingUrl.current);
      const previewUrl = URL.createObjectURL(prepared.blob);
      pendingUrl.current = previewUrl;
      setPending({ ...prepared, previewUrl });
    } catch (caught) {
      setError(
        caught instanceof MediaError
          ? caught.message
          : "this one would not open. try another photo.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function save() {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("give this square a name.");
      return;
    }
    if (!status) {
      setError("mark where it stands: started, in progress, or finished.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await onSave({
        title: trimmedTitle,
        story: story.trim(),
        theme: theme.trim(),
        status,
        media: pending
          ? {
              kind: pending.kind,
              blob: pending.blob,
              mime: pending.mime,
              poster: pending.poster,
            }
          : null,
      });
      onOpenChange(false);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "the page would not take the ink.");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!project) return;
    setBusy(true);
    setError(null);
    try {
      await onDelete(project);
      onOpenChange(false);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "the page would not tear.");
      setBusy(false);
    }
  }

  return (
    <>
        <div data-testid="editor-scroll" className="min-h-0 flex-1 overflow-y-auto px-4 pt-4 pb-6">
          <DialogHeader className="pr-2 text-left">
            <DialogTitle className="font-marker text-3xl leading-none text-[#1c140c] uppercase">
              {mode === "create" ? "a new square" : title || "this square"}
            </DialogTitle>
            <DialogDescription className="font-hand text-lg text-[#1c140c]">
              {mode === "create"
                ? "a photo or a video, a few lines, and where it stands."
                : "change the lines, the status, or the picture."}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 flex max-h-[22dvh] items-center justify-center overflow-hidden border-[3px] border-[#1c140c] bg-[#e7d7a8] sm:max-h-[34dvh]">
            {showVideo && videoSrc ? (
              <video
                key={videoSrc}
                data-testid="playback"
                src={videoSrc}
                poster={!pending ? stillUrl : undefined}
                controls
                playsInline
                preload="metadata"
                className="max-h-[22dvh] w-full bg-[#1c140c] object-contain sm:max-h-[34dvh]"
              />
            ) : imageSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageSrc}
                alt=""
                className="max-h-[22dvh] w-full object-contain sm:max-h-[34dvh]"
              />
            ) : (
              <Illustration
                name={project?.illustrationKey}
                seed={project?.id ?? "new"}
                className="max-h-[22dvh] w-auto sm:max-h-[34dvh]"
              />
            )}
          </div>

          {project?.standIn && !pending && (
            <p className="mt-2 font-hand text-base text-[#5c4a32]">
              painted stand-in. swap in a real photo or video when you have one.
            </p>
          )}

          <label className="mt-4 block font-marker text-sm text-[#1c140c] uppercase">
            photo or video
            <Input
              data-testid="media-input"
              type="file"
              accept="image/*,video/*"
              onChange={onFile}
              disabled={busy}
              aria-label="Choose a photo or video"
              className={`${fieldClass} mt-1 file:mr-3 file:font-marker file:text-base file:text-[#1c140c]`}
            />
          </label>
          {busy && (
            <p className="mt-2 font-hand text-lg text-[#1c140c]">catching a frame…</p>
          )}

          <fieldset className="mt-4">
            <legend className="font-marker text-sm text-[#1c140c] uppercase">
              where it stands
            </legend>
            <div className="mt-2 grid grid-cols-3 gap-2" role="group" aria-label="Status">
              {STATUSES.map((option) => (
                <Button
                  key={option}
                  type="button"
                  variant={status === option ? "default" : "outline"}
                  aria-pressed={status === option}
                  data-testid={`status-${option.replace(" ", "-")}`}
                  className="min-h-12 whitespace-normal rounded-none border-2 border-[#1c140c] px-1 font-marker text-sm uppercase"
                  onClick={() => setStatus(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
          </fieldset>

          <label className="mt-4 block font-marker text-sm uppercase" htmlFor="project-title">
            title
          </label>
          <Input
            id="project-title"
            data-testid="title-input"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="name the square"
            autoComplete="off"
            className={`${fieldClass} mt-1`}
          />

          <label className="mt-4 block font-marker text-sm uppercase" htmlFor="project-story">
            what happened
          </label>
          <Textarea
            id="project-story"
            data-testid="story-input"
            value={story}
            onChange={(event) => setStory(event.target.value)}
            placeholder="a few lines, the concrete kind."
            rows={4}
            className={`${fieldClass} mt-1 min-h-28`}
          />

          <label className="mt-4 block font-marker text-sm uppercase" htmlFor="project-theme">
            theme
          </label>
          <Input
            id="project-theme"
            data-testid="theme-input"
            value={theme}
            onChange={(event) => setTheme(event.target.value)}
            placeholder="music, crochet, a theme you invent"
            list="theme-suggestions"
            autoComplete="off"
            className={`${fieldClass} mt-1`}
          />
          <datalist id="theme-suggestions">
            {suggestions.map((choice) => (
              <option key={choice} value={choice} />
            ))}
          </datalist>
          {suggestions.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {suggestions.map((choice) => (
                <Button
                  key={choice}
                  type="button"
                  variant="outline"
                  className="min-h-10 rounded-none border-2 border-[#1c140c] bg-[#f6edd0] font-hand text-base"
                  onClick={() => setTheme(choice)}
                >
                  {choice}
                </Button>
              ))}
            </div>
          )}

          {error && (
            <p role="alert" className="mt-4 font-hand text-xl text-[#a33b24]">
              {error}
            </p>
          )}
        </div>

        <DialogFooter className="mx-0 mb-0 flex w-full shrink-0 flex-row flex-wrap items-center justify-between gap-2 rounded-none border-t-[3px] border-[#1c140c] bg-[#f3e6c0] p-3">
          {confirmingDelete ? (
            <>
              <p className="font-hand text-lg">tear it out for good?</p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="min-h-12 rounded-none border-2 border-[#1c140c] font-marker uppercase"
                  onClick={() => setConfirmingDelete(false)}
                  disabled={busy}
                >
                  keep it
                </Button>
                <Button
                  type="button"
                  data-testid="confirm-delete"
                  className="min-h-12 rounded-none border-2 border-[#1c140c] bg-[#a33b24] font-marker text-[#f3e6c0] uppercase"
                  onClick={remove}
                  disabled={busy}
                >
                  tear it out
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="flex gap-2">
                <DialogClose
                  render={
                    <Button
                      type="button"
                      variant="outline"
                      className="min-h-12 rounded-none border-2 border-[#1c140c] font-marker uppercase"
                    />
                  }
                >
                  close
                </DialogClose>
                {mode === "edit" && (
                  <Button
                    type="button"
                    variant="outline"
                    data-testid="delete-project"
                    className="min-h-12 rounded-none border-2 border-[#1c140c] font-marker uppercase"
                    onClick={() => setConfirmingDelete(true)}
                    disabled={busy}
                  >
                    tear this out
                  </Button>
                )}
              </div>
              <Button
                type="button"
                data-testid="save-project"
                className="min-h-12 rounded-none border-2 border-[#1c140c] font-marker uppercase"
                onClick={save}
                disabled={busy}
              >
                save this square
              </Button>
            </>
          )}
        </DialogFooter>
    </>
  );
}
