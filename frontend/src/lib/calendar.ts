export function generateGoogleCalendarUrl(title: string, description: string, start: string) {
  const startDate = new Date(start);
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // +1 hour by default

  const formatGoogleDate = (date: Date) => {
    return date.toISOString().replace(/-|:|\.\d+/g, "");
  };

  const startStr = formatGoogleDate(startDate);
  const endStr = formatGoogleDate(endDate);

  const url = new URL("https://calendar.google.com/calendar/render");
  url.searchParams.append("action", "TEMPLATE");
  url.searchParams.append("text", title);
  url.searchParams.append("details", description || "");
  url.searchParams.append("dates", `${startStr}/${endStr}`);

  return url.toString();
}
