export const STATUSES = ["started", "in progress", "finished"] as const;

export type ProjectStatus = (typeof STATUSES)[number];

export type MediaKind = "illustration" | "image" | "video";

export type Project = {
  id: string;
  title: string;
  story: string;
  theme: string;
  status: ProjectStatus;
  kind: MediaKind;
  illustrationKey?: string;
  rotation: number;
  createdAt: number;
  updatedAt: number;
  standIn: boolean;
};

export type MediaRecord = {
  projectId: string;
  kind: "image" | "video";
  blob: Blob;
  mime: string;
  poster?: Blob;
};

export type NotebookMeta = {
  key: "state";
  seeded: boolean;
  retiredSeedIds: string[];
};
