import type { Project } from "./models";

export type ProjectWithTaskCount = Project & {
  taskCount: number;
};