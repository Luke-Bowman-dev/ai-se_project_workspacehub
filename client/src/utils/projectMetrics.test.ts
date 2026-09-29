import { describe, expect, it } from "vitest";
import type { Project, Task } from "../types/models";
import { buildProjectWithTaskCount } from "./projectMetrics";

const project: Project = {
  _id: "project-a",
  organizationId: "org-a",
  name: "Project A",
  description: "A test project.",
  createdBy: "user-a",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

const buildTask = (id: string, projectId: string): Task => ({
  _id: id,
  organizationId: "org-a",
  projectId,
  title: `Task ${id}`,
  description: "A test task.",
  status: "todo",
  priority: "medium",
  assignedTo: null,
  dueDate: null,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
});

describe("buildProjectWithTaskCount", () => {
  it("returns zero when there are no tasks", () => {
    expect(buildProjectWithTaskCount(project, [])).toEqual({
      ...project,
      taskCount: 0,
    });
  });

  it("returns zero when tasks belong to a different project", () => {
    const tasks = [buildTask("task-b1", "project-b")];

    expect(buildProjectWithTaskCount(project, tasks).taskCount).toBe(0);
  });

  it("counts only tasks belonging to the given project", () => {
    const tasks = [
      buildTask("task-a1", project._id),
      buildTask("task-b1", "project-b"),
      buildTask("task-a2", project._id),
    ];

    expect(buildProjectWithTaskCount(project, tasks).taskCount).toBe(2);
  });
});
