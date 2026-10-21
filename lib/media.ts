export const MAX_MEDIA_BYTES = 50 * 1024 * 1024;
const MAX_EDGE = 1600;

export class MediaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MediaError";
  }
}

export type PreparedMedia = {
  kind: "image" | "video";
  blob: Blob;
  mime: string;
  poster?: Blob;
};

function sniff(file: File): "image" | "video" | "other" {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  const name = file.name.toLowerCase();
  if (/\.(png|jpe?g|gif|webp|bmp|avif|heic|heif)$/.test(name)) return "image";
  if (/\.(mp4|mov|webm|m4v|ogg|ogv|mkv|avi|3gp)$/.test(name)) return "video";
  return "other";
}

function tooHeavy(kind: "image" | "video"): MediaError {
  const noun = kind === "video" ? "clip" : "photo";
  return new MediaError(
    `that ${noun} is heavier than the notebook can hold. keep it under 50MB.`,
  );
}

export async function prepareMedia(file: File): Promise<PreparedMedia> {
  const kind = sniff(file);
  if (kind === "other") {
    throw new MediaError("this notebook takes a photo or a video.");
  }
  if (file.size > MAX_MEDIA_BYTES) throw tooHeavy(kind);
  if (kind === "video") {
    const poster = await capturePoster(file);
    return {
      kind: "video",
      blob: file,
      mime: file.type || "video/mp4",
      poster,
    };
  }
  const blob = await resizeImage(file);
  return { kind: "image", blob, mime: "image/jpeg" };
}

async function resizeImage(file: File): Promise<Blob> {
  const source = await decodeImage(file);
  const width = source instanceof ImageBitmap ? source.width : source.naturalWidth;
  const height = source instanceof ImageBitmap ? source.height : source.naturalHeight;
  if (!width || !height) {
    if (source instanceof ImageBitmap) source.close();
    throw new MediaError("this one would not open. try another photo.");
  }

  const scale = Math.min(1, MAX_EDGE / Math.max(width, height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width * scale));
  canvas.height = Math.max(1, Math.round(height * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    if (source instanceof ImageBitmap) source.close();
    throw new MediaError("this one would not open. try another photo.");
  }
  ctx.fillStyle = "#f7f6f3";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  if (source instanceof ImageBitmap) source.close();

  const blob = await canvasToJpeg(canvas);
  if (!blob) throw new MediaError("this one would not open. try another photo.");
  return blob;
}

async function decodeImage(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file, { imageOrientation: "from-image" });
    } catch {
      // Fall through to an Image element for formats the bitmap path rejects.
    }
  }

  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new MediaError("this one would not open. try another photo."));
    };
    img.src = url;
  });
}

function canvasToJpeg(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.84);
  });
}

function capturePoster(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.src = url;
    video.setAttribute("playsinline", "true");
    video.style.position = "fixed";
    video.style.left = "-9999px";
    video.style.width = "4px";
    video.style.height = "4px";
    document.body.appendChild(video);

    let settled = false;
    let seekTo = 0;
    let metadataReady = false;
    const timer = window.setTimeout(() => {
      fail("could not catch a frame from that clip.");
    }, 8000);

    const cleanup = () => {
      window.clearTimeout(timer);
      URL.revokeObjectURL(url);
      video.removeAttribute("src");
      video.load();
      video.remove();
    };

    const fail = (message: string) => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new MediaError(message));
    };

    const draw = () => {
      if (settled) return;
      const width = video.videoWidth;
      const height = video.videoHeight;
      if (!width || !height) {
        fail("could not catch a frame from that clip.");
        return;
      }
      settled = true;
      const scale = Math.min(1, MAX_EDGE / Math.max(width, height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(width * scale));
      canvas.height = Math.max(1, Math.round(height * scale));
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        settled = false;
        fail("could not catch a frame from that clip.");
        return;
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          cleanup();
          if (!blob) {
            reject(new MediaError("could not catch a frame from that clip."));
            return;
          }
          resolve(blob);
        },
        "image/jpeg",
        0.82,
      );
    };

    video.addEventListener("error", () => {
      fail("could not catch a frame from that clip.");
    });
    video.addEventListener("loadedmetadata", () => {
      const duration = video.duration;
      metadataReady = true;
      seekTo =
        Number.isFinite(duration) && duration > 0.25
          ? Math.min(0.4, Math.max(0.05, duration * 0.08))
          : 0;
      if (seekTo > 0) {
        try {
          video.currentTime = seekTo;
        } catch {
          draw();
        }
      } else if (video.readyState >= 2) {
        draw();
      }
    });
    video.addEventListener("seeked", draw);
    video.addEventListener("loadeddata", () => {
      if (metadataReady && seekTo === 0 && video.readyState >= 2) draw();
    });
    video.load();
  });
}
