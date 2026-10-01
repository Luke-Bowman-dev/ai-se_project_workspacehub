interface BookingFormState {
  title: string;
  description: string;
  startsAt: string;
  endsAt: string;
}

type BookingFormErrors = Partial<Record<keyof BookingFormState, string>>;

export const validateBookingFormState = (
  formState: BookingFormState,
): BookingFormErrors => {
  const errors: BookingFormErrors = {};

  if (formState.title.trim().length < 2) {
    errors.title = "Enter a booking title with at least 2 characters.";
  }

  if (!formState.description.trim()) {
    errors.description = "Enter a booking description.";
  }

  if (!formState.startsAt.trim()) {
    errors.startsAt = "Enter a start date and time.";
  }

  if (!formState.endsAt.trim()) {
    errors.endsAt = "Enter an end date and time.";
  }

  const startsAt = new Date(formState.startsAt);
  const endsAt = new Date(formState.endsAt);

  if (!errors.startsAt && Number.isNaN(startsAt.getTime())) {
    errors.startsAt = "Enter a valid start date and time.";
  }

  if (!errors.endsAt && Number.isNaN(endsAt.getTime())) {
    errors.endsAt = "Enter a valid end date and time.";
  }

  if (!errors.startsAt && !errors.endsAt && endsAt <= startsAt) {
    errors.endsAt = "The end time must be after the start time.";
  }

  return errors;
};
