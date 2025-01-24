import { parseISO, getDay } from 'date-fns';
import { fareRules, Line, LineCombo, FareRule } from './fareRules';
import { isPeakTime } from '../utils/dateUtils';

interface Usage {
  [combo: string]: {
    daily: Record<string, number>;
    weekly: Record<string, number>;
  };
}

export class FareCalculator {
  private usage: Usage = {};
  private totalFare: number = 0;

  constructor() {
    fareRules.forEach(rule => {
      this.usage[rule.combo] = {
        daily: {},
        weekly: {},
      };
    });
  }

  private getFareRule(combo: LineCombo): FareRule {
    const rule = fareRules.find(r => r.combo === combo);
    if (!rule) {
      throw new Error(`Fare rule not found for combo: ${combo}`);
    }
    return rule;
  }

  private makeDayKey(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  private makeWeekKey(date: Date): string {
    const temp = new Date(date.getTime());
    const dayOfWeek = getDay(date); // Sunday=0, Monday=1, ...
    let shiftDays = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    temp.setDate(temp.getDate() - shiftDays);
    return temp.toISOString().slice(0, 10);
  }

  public processJourney(fromLine: Line, toLine: Line, dateTimeStr: string): void {
    const dateObj = parseISO(dateTimeStr);
    if (isNaN(dateObj.getTime())) {
      console.error('Invalid date/time:', dateTimeStr);
      return;
    }

    const combo: LineCombo = `${fromLine}->${toLine}` as LineCombo;
    const peak = isPeakTime(dateObj);
    const fareRule = this.getFareRule(combo);
    const baseFare = peak ? fareRule.peakFare : fareRule.offPeakFare;
    const { dailyCap, weeklyCap } = fareRule;

    const dayKey = this.makeDayKey(dateObj);
    const weekKey = this.makeWeekKey(dateObj);

    const currentDayTotal = this.usage[combo].daily[dayKey] || 0;
    const currentWeekTotal = this.usage[combo].weekly[weekKey] || 0;

    if (currentDayTotal >= dailyCap || currentWeekTotal >= weeklyCap) {
      // No charge for this trip
      return;
    }

    const availableDay = dailyCap - currentDayTotal;
    const availableWeek = weeklyCap - currentWeekTotal;
    let fareForThisTrip = baseFare;

    if (fareForThisTrip > availableDay) {
      fareForThisTrip = availableDay;
    }
    if (fareForThisTrip > availableWeek) {
      fareForThisTrip = availableWeek;
    }

    // Update usage
    this.usage[combo].daily[dayKey] = currentDayTotal + fareForThisTrip;
    this.usage[combo].weekly[weekKey] = currentWeekTotal + fareForThisTrip;

    // Update total fare
    this.totalFare += fareForThisTrip;
  }

  public getTotalFare(): number {
    return this.totalFare;
  }
}
