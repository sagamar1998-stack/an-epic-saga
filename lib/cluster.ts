import type { Project } from "@/lib/types";

export type ThemeCluster = {
  key: string;
  label: string;
  projects: Project[];
};

export function themeChoices(projects: Project[]): string[] {
  const seen = new Map<string, string>();
  for (const project of projects) {
    const trimmed = project.theme.trim();
    if (!trimmed) continue;
    const key = trimmed.toLowerCase();
    if (!seen.has(key)) seen.set(key, trimmed);
  }
  return [...seen.values()].sort((a, b) => a.localeCompare(b));
}

export function clusterByTheme(projects: Project[]): ThemeCluster[] {
  const groups = new Map<string, ThemeCluster>();
  for (const project of projects) {
    const trimmed = project.theme.trim();
    const key = trimmed.toLowerCase() || "unsorted";
    const label = trimmed || "unsorted";
    const existing = groups.get(key);
    if (existing) existing.projects.push(project);
    else groups.set(key, { key, label, projects: [project] });
  }
  return [...groups.values()].sort((a, b) =>
    a.label.localeCompare(b.label),
  );
}
