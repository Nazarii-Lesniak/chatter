const MS_PER_DAY = 24 * 60 * 60 * 1000;

const clockFormat = new Intl.DateTimeFormat('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

const weekdayFormat = new Intl.DateTimeFormat('en-US', { weekday: 'short' });

const monthDayFormat = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
});

function toDayIndex(date: Date) {
  return Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / MS_PER_DAY,
  );
}

export function formatClockTime(dateString: string): string {
  const date = new Date(dateString);

  return Number.isNaN(date.getTime()) ? '' : clockFormat.format(date);
}

export function formatTimestamp(
  dateString?: string,
  now: Date = new Date(),
): string {
  if (!dateString) {
    return '';
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  const daysAgo = toDayIndex(now) - toDayIndex(date);

  if (daysAgo === 0) {
    return clockFormat.format(date);
  }

  if (daysAgo === 1) {
    return 'Yesterday';
  }

  if (daysAgo > 1 && daysAgo < 7) {
    return weekdayFormat.format(date);
  }

  return monthDayFormat.format(date);
}
