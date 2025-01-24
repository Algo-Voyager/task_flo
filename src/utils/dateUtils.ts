import { getDay } from 'date-fns';

/**
 * Determines if a given date is within peak hours.
 * Peak hours:
 * - Monday to Friday: 08:00-10:00, 16:30-19:00
 * - Saturday: 10:00-14:00, 18:00-23:00
 * - Sunday: 18:00-23:00
 */

export function isPeakTime(date: Date): boolean {
  const dayOfWeek = getDay(date); // Sunday=0, Monday=1, ..., Saturday=6
  const hour = date.getHours();
  const minute = date.getMinutes();
  const totalMinutes = hour * 60 + minute;

  const toMins = (h: number, m: number) => h * 60 + m;

  if (dayOfWeek >= 1 && dayOfWeek <= 5) {
    // Monday to Friday
    if (
      (totalMinutes >= toMins(8, 0) && totalMinutes < toMins(10, 0)) ||
      (totalMinutes >= toMins(16, 30) && totalMinutes < toMins(19, 0))
    ) {
      return true;
    }
  } else if (dayOfWeek === 6) {
    // Saturday
    if (
      (totalMinutes >= toMins(10, 0) && totalMinutes < toMins(14, 0)) ||
      (totalMinutes >= toMins(18, 0) && totalMinutes < toMins(23, 0))
    ) {
      return true;
    }
  } else if (dayOfWeek === 0) {
    // Sunday
    if (totalMinutes >= toMins(18, 0) && totalMinutes < toMins(23, 0)) {
      return true;
    }
  }

  return false;
}
