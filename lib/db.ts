import { SEED_IDS, SEEDS } from "@/lib/seeds";
import type { MediaRecord, NotebookMeta, Project } from "@/lib/types";

const DB_NAME = "an-epic-saga";
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

function request<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error("IndexedDB request failed"));
  });
}

function transactionDone(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.addEventListener("complete", () => resolve());
    tx.addEventListener("error", () => reject(tx.error ?? new Error("IndexedDB transaction failed")));
    tx.addEventListener("abort", () => reject(tx.error ?? new Error("IndexedDB transaction aborted")));
  });
}

function openDb(): Promise<IDBDatabase> {
  if (typeof indexedDB === "undefined") {
    return Promise.reject(new Error("IndexedDB is not available"));
  }
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains("projects")) {
          db.createObjectStore("projects", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("media")) {
          db.createObjectStore("media", { keyPath: "projectId" });
        }
        if (!db.objectStoreNames.contains("meta")) {
          db.createObjectStore("meta", { keyPath: "key" });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => {
        dbPromise = null;
        reject(req.error ?? new Error("Could not open the notebook"));
      };
    });
  }
  return dbPromise;
}

async function readMeta(db: IDBDatabase): Promise<NotebookMeta | undefined> {
  const tx = db.transaction("meta", "readonly");
  const done = transactionDone(tx);
  const meta = (await request(tx.objectStore("meta").get("state"))) as
    | NotebookMeta
    | undefined;
  await done;
  return meta;
}

async function ensureSeeded(db: IDBDatabase): Promise<void> {
  const meta = await readMeta(db);
  if (meta?.seeded) return;

  const retired = new Set(meta?.retiredSeedIds ?? []);
  const tx = db.transaction(["projects", "meta"], "readwrite");
  const done = transactionDone(tx);
  const projects = tx.objectStore("projects");
  for (const seed of SEEDS) {
    if (!retired.has(seed.id)) projects.put(seed);
  }
  tx.objectStore("meta").put({
    key: "state",
    seeded: true,
    retiredSeedIds: [...retired],
  } satisfies NotebookMeta);
  await done;
}

export async function loadNotebook(): Promise<{
  projects: Project[];
  stills: Record<string, Blob>;
}> {
  const db = await openDb();
  await ensureSeeded(db);

  const projectTx = db.transaction("projects", "readonly");
  const projectsDone = transactionDone(projectTx);
  const projects = (
    (await request(projectTx.objectStore("projects").getAll())) as Project[]
  ).sort((a, b) => a.createdAt - b.createdAt);
  await projectsDone;

  const mediaTx = db.transaction("media", "readonly");
  const mediaDone = transactionDone(mediaTx);
  const media = (await request(mediaTx.objectStore("media").getAll())) as MediaRecord[];
  await mediaDone;

  const stills: Record<string, Blob> = {};
  for (const item of media) {
    if (item.kind === "image" && item.blob) stills[item.projectId] = item.blob;
    else if (item.kind === "video" && item.poster) stills[item.projectId] = item.poster;
  }

  return { projects, stills };
}

export async function getMedia(projectId: string): Promise<MediaRecord | null> {
  const db = await openDb();
  const tx = db.transaction("media", "readonly");
  const done = transactionDone(tx);
  const media = (await request(tx.objectStore("media").get(projectId))) as
    | MediaRecord
    | undefined;
  await done;
  return media ?? null;
}

export async function saveProject(
  project: Project,
  media?: MediaRecord | null,
): Promise<void> {
  const db = await openDb();
  const stores = media ? ["projects", "media"] : ["projects"];
  const tx = db.transaction(stores, "readwrite");
  const done = transactionDone(tx);
  tx.objectStore("projects").put(project);
  if (media) tx.objectStore("media").put(media);
  await done;
}

export async function deleteProject(id: string): Promise<void> {
  const db = await openDb();
  let retired: string[] | null = null;
  if (SEED_IDS.has(id)) {
    const meta = await readMeta(db);
    const ids = new Set(meta?.retiredSeedIds ?? []);
    ids.add(id);
    retired = [...ids];
  }
  const tx = db.transaction(["projects", "media", "meta"], "readwrite");
  const done = transactionDone(tx);
  tx.objectStore("projects").delete(id);
  tx.objectStore("media").delete(id);
  if (retired) {
    tx.objectStore("meta").put({
      key: "state",
      seeded: true,
      retiredSeedIds: retired,
    } satisfies NotebookMeta);
  }
  await done;
}

export function notebookErrorMessage(error: unknown): string {
  if (
    error instanceof DOMException &&
    (error.name === "QuotaExceededError" || error.name === "NS_ERROR_DOM_QUOTA_REACHED")
  ) {
    return "the notebook is full. this one would not fit.";
  }
  return "the page would not take the ink. try again.";
}
