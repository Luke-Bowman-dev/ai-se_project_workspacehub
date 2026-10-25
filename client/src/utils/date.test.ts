import { describe, expect, it } from "vitest";
import { formatDateMonthAndYear } from "./date";

describe("formatDateMonthAndYear", () => {
  it("formats a date as an abbreviated month and year", () => {
    expect(formatDateMonthAndYear("2026-01-15T12:00:00.000Z")).toBe("Jan 2026");
  });

  it("returns Not set for missing or invalid values", () => {
    expect(formatDateMonthAndYear(null)).toBe("Not set");
    expect(formatDateMonthAndYear(undefined)).toBe("Not set");
    expect(formatDateMonthAndYear("invalid date")).toBe("Not set");
  });
});
