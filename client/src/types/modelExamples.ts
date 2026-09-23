import type {
  AuthSession,
  Booking,
  FeatureFlags,
  MePayload,
  Organization,
  Project,
  Task,
  User,
} from "./models";
import type { ProjectWithTaskCount } from "./views";
import { buildProjectWithTaskCount } from "../utils/projectMetrics";

export const exampleFeatureFlags: FeatureFlags = {
  scheduling: true,
  advancedReports: false,
  customBranding: true,
};

export const exampleOrganization: Organization = {
  _id: "org-example-001",
  name: "Northstar Studio",
  slug: "northstar-studio",
  featureFlags: exampleFeatureFlags,
  createdAt: "2026-01-10T09:00:00.000Z",
  updatedAt: "2026-09-01T14:30:00.000Z",
};

export const exampleUser: User = {
  _id: "user-example-001",
  firstName: "Avery",
  lastName: "Morgan",
  email: "avery.morgan@example.com",
  organizationId: exampleOrganization._id,
  role: "owner",
  createdAt: "2026-01-10T09:15:00.000Z",
  updatedAt: "2026-08-20T11:45:00.000Z",
};

export const exampleProject: Project = {
  _id: "project-example-001",
  organizationId: exampleOrganization._id,
  name: "Client Portal",
  description: "Refresh the client portal experience for the next release.",
  createdBy: exampleUser._id,
  createdAt: "2026-02-03T10:00:00.000Z",
  updatedAt: "2026-08-28T16:20:00.000Z",
};

export const exampleTask: Task = {
  _id: "task-example-001",
  organizationId: exampleOrganization._id,
  projectId: exampleProject._id,
  title: "Review navigation changes",
  description: "Review the proposed navigation structure with the delivery team.",
  status: "in_progress",
  priority: "high",
  assignedTo: exampleUser._id,
  dueDate: "2026-10-15T17:00:00.000Z",
  createdAt: "2026-08-29T09:30:00.000Z",
  updatedAt: "2026-09-05T13:10:00.000Z",
};

export const exampleTasks: Task[] = [exampleTask];

export const exampleProjectWithTaskCount: ProjectWithTaskCount =
  buildProjectWithTaskCount(exampleProject, exampleTasks);



