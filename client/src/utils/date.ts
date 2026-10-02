export const formatDateTime = (value: string | null | undefined) => {
  if (!value) {
    return "Not set";
  }

  return new Date(value).toLocaleString();
};

/**
 * Formats a date as an abbreviated month and year.
 * Example: formatDateMonthAndYear("2026-01-15") returns "Jan 2026".
 */
export const formatDateMonthAndYear = (value: string | null | undefined) => {
  if (!value) {
    return "Not set";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(date);
};

export const formatDateInput = (value: string | null | undefined) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const formatDateTimeInput = (value: string | null | undefined) => {
  if (!value) {
    return "";
  }

  return new Date(value).toISOString().slice(0, 16);
};
