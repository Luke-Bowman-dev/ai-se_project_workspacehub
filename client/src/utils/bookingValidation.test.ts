import { describe, expect, it } from "vitest";
import { validateBookingFormState } from "./bookingValidation";

const validFormState = {
  title: "Planning session",
  description: "Plan the next project milestone.",
  startsAt: "2026-10-01T09:00",
  endsAt: "2026-10-01T10:00",
};

describe("validateBookingFormState", () => {
  it("reports all required fields when they are blank", () => {
    expect(
      validateBookingFormState({
        title: "",
        description: "",
        startsAt: "",
        endsAt: "",
      }),
    ).toEqual({
      title: "Enter a booking title with at least 2 characters.",
      description: "Enter a booking description.",
      startsAt: "Enter a start date and time.",
      endsAt: "Enter an end date and time.",
    });
  });

  it("rejects a title shorter than two characters", () => {
    expect(validateBookingFormState({ ...validFormState, title: "A" })).toEqual(
      {
        title: "Enter a booking title with at least 2 characters.",
      },
    );
  });

  it("reports an invalid start date string", () => {
    expect(
      validateBookingFormState({ ...validFormState, startsAt: "not-a-date" }),
    ).toEqual({
      startsAt: "Enter a valid start date and time.",
    });
  });

  it("requires the end time to be after the start time", () => {
    expect(
      validateBookingFormState({
        ...validFormState,
        startsAt: "2026-10-01T11:00",
        endsAt: "2026-10-01T10:00",
      }),
    ).toEqual({
      endsAt: "The end time must be after the start time.",
    });
  });

  it("rejects an end time exactly equal to the start time", () => {
    expect(
      validateBookingFormState({
        ...validFormState,
        startsAt: "2026-10-01T10:00",
        endsAt: "2026-10-01T10:00",
      }),
    ).toEqual({
      endsAt: "The end time must be after the start time.",
    });
  });

  it("returns no errors for a valid booking form", () => {
    expect(validateBookingFormState(validFormState)).toEqual({});
  });
});
