import { parseISO, getDay } from 'date-fns';

/**
 * We define an enumeration for the 4 possible line combinations,
 * or we can just use string tuples like "Green->Green", "Green->Red", etc.
*/

type Line = 'Green' | 'Red';
type LineCombo = 'Green->Green' | 'Green->Red' | 'Red->Green' | 'Red->Red';

function isPeakTime(date: Date): boolean {
  // getDay() returns: Sunday=0, Monday=1, ..., Saturday=6
  const dayOfWeek = getDay(date);
  const hour = date.getHours();
  const minute = date.getMinutes();
  const totalMinutes = hour * 60 + minute;

  // Convert hour:minute => total minutes
  const toMins = (h: number, m: number) => h * 60 + m;

  // Monday to Friday => dayOfWeek in [1..5]
  //   08:00–10:00   => 480..600
  //   16:30–19:00  => 990..1140
  if (dayOfWeek >= 1 && dayOfWeek <= 5) {
    if (
      (totalMinutes >= toMins(8, 0) && totalMinutes < toMins(10, 0)) ||
      (totalMinutes >= toMins(16, 30) && totalMinutes < toMins(19, 0))
    ) {
      return true;
    }
    return false;
  }

  // Saturday => dayOfWeek=6
  //   10:00–14:00 => 600..840
  //   18:00–23:00 => 1080..1380
  if (dayOfWeek === 6) {
    if (
      (totalMinutes >= toMins(10, 0) && totalMinutes < toMins(14, 0)) ||
      (totalMinutes >= toMins(18, 0) && totalMinutes < toMins(23, 0))
    ) {
      return true;
    }
    return false;
  }

  // Sunday => dayOfWeek=0
  //   18:00–23:00 => 1080..1380
  if (dayOfWeek === 0) {
    if (totalMinutes >= toMins(18, 0) && totalMinutes < toMins(23, 0)) {
      return true;
    }
    return false;
  }

  return false;
}

// Return the line combo as a string
function getLineCombo(fromLine: Line, toLine: Line): LineCombo {
  return `${fromLine}->${toLine}` as LineCombo;
}


// Return the base fare for the given line combo and peak/off-peak.
function getBaseFare(combo: LineCombo, peak: boolean): number {
  switch (combo) {
    case 'Green->Green':
      return peak ? 2 : 1;
    case 'Green->Red':
      return peak ? 4 : 3;
    case 'Red->Green':
      return peak ? 3 : 2;
    case 'Red->Red':
      return peak ? 3 : 2;
  }
}

// Return the daily and weekly caps for the line combo
function getCaps(combo: LineCombo): { dailyCap: number; weeklyCap: number } {
  switch (combo) {
    case 'Green->Green':
      return { dailyCap: 8, weeklyCap: 55 };
    case 'Green->Red':
      return { dailyCap: 15, weeklyCap: 90 };
    case 'Red->Green':
      return { dailyCap: 15, weeklyCap: 90 };
    case 'Red->Red':
      return { dailyCap: 12, weeklyCap: 70 };
  }
}

function makeDayKey(date: Date): string {
  // Return the same "YYYY-MM-DD" format
  return date.toISOString().slice(0, 10);
}

function makeWeekKey(date: Date): string {
  const temp = new Date(date.getTime());
  const dayOfWeek = getDay(date); // Sunday=0, Monday=1, ...
  // shift so that we land on Monday
  // If dayOfWeek=0 (Sunday), we shift back 6 days to get Monday of that week
  // If dayOfWeek=1 (Monday), shift back 0 days, etc.
  let shiftDays = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  temp.setDate(temp.getDate() - shiftDays);

  // Return the same "YYYY-MM-DD" format
  return temp.toISOString().slice(0, 10);
}

export function calculateFare(csvLines: string[]): number {
  // We'll track how much has been spent per ,line combo per day
  // Structure:
  //   dailyUsage[combo][dayKey] = number
  //   weeklyUsage[combo][weekKey] = number
  const dailyUsage: Record<LineCombo, Record<string, number>> = {
    'Green->Green': {},
    'Green->Red': {},
    'Red->Green': {},
    'Red->Red': {},
  };

  const weeklyUsage: Record<LineCombo, Record<string, number>> = {
    'Green->Green': {},
    'Green->Red': {},
    'Red->Green': {},
    'Red->Red': {},
  };

  let totalFare = 0;

  for (const line of csvLines) {
    // Example line: "Green,Green,2021-03-24T07:58:30"
    const parts = line.split(',');
    if (parts.length < 3) {
      // Invalid line
      continue;
    }
    const fromLine = parts[0].trim() as Line;
    const toLine = parts[1].trim() as Line;
    const dateTimeStr = parts[2].trim();

    // Parse the dateTime string into a JS Date
    const dateObj = parseISO(dateTimeStr);
    if (isNaN(dateObj.getTime())) {
      console.error('Invalid date/time:', dateTimeStr);
      continue;
    }

    const combo = getLineCombo(fromLine, toLine);

    const peak = isPeakTime(dateObj);

    const baseFare = getBaseFare(combo, peak);

    const { dailyCap, weeklyCap } = getCaps(combo);

    const dayKey = makeDayKey(dateObj);
    const weekKey = makeWeekKey(dateObj);

    const currentDayTotal = dailyUsage[combo][dayKey] || 0;
    const currentWeekTotal = weeklyUsage[combo][weekKey] || 0;

    if (currentDayTotal >= dailyCap || currentWeekTotal >= weeklyCap) {
      // No charge for this trip
      continue;
    }

    // Calculate how much is left before hitting caps
    const availableDay = dailyCap - currentDayTotal;
    const availableWeek = weeklyCap - currentWeekTotal;

    // Actual fare for this trip
    let fareForThisTrip = baseFare;
    if (fareForThisTrip > availableDay) {
      fareForThisTrip = availableDay;
    }
    if (fareForThisTrip > availableWeek) {
      fareForThisTrip = availableWeek;
    }

    // Update daily/weekly usage
    dailyUsage[combo][dayKey] = currentDayTotal + fareForThisTrip;
    weeklyUsage[combo][weekKey] = currentWeekTotal + fareForThisTrip;

    totalFare += fareForThisTrip;
  }

  return totalFare;
}
