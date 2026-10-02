import { describe, expect, it } from "vitest";
import type { User, UserRole } from "../types/models";
import { canCreateProject, isPrivilegedRole } from "./permissions";

const roleCases: Array<{ role: UserRole | null; expected: boolean }> = [
  { role: "owner", expected: true },
  { role: "admin", expected: true },
  { role: "member", expected: false },
  { role: null, expected: false },
];

const buildUser = (role: UserRole): User => ({
  _id: `user-${role}`,
  firstName: "Test",
  lastName: "User",
  email: `test-${role}@example.com`,
  organizationId: "org-test",
  role,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
});

describe("isPrivilegedRole", () => {
  it.each(roleCases)(
    "returns $expected for role $role",
    ({ role, expected }) => {
      expect(isPrivilegedRole(role)).toBe(expected);
    },
  );
});

describe("canCreateProject", () => {
  it.each(roleCases)(
    "returns $expected for role $role",
    ({ role, expected }) => {
      const user = role === null ? null : buildUser(role);

      expect(canCreateProject(user)).toBe(expected);
    },
  );
});
