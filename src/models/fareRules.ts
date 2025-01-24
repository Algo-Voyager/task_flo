export type Line = 'Green' | 'Red';
export type LineCombo = 'Green->Green' | 'Green->Red' | 'Red->Green' | 'Red->Red';

export interface FareRule {
  combo: LineCombo;
  peakFare: number;
  offPeakFare: number;
  dailyCap: number;
  weeklyCap: number;
}

export const fareRules: FareRule[] = [
  {
    combo: 'Green->Green',
    peakFare: 2,
    offPeakFare: 1,
    dailyCap: 8,
    weeklyCap: 55,
  },
  {
    combo: 'Green->Red',
    peakFare: 4,
    offPeakFare: 3,
    dailyCap: 15,
    weeklyCap: 90,
  },
  {
    combo: 'Red->Green',
    peakFare: 3,
    offPeakFare: 2,
    dailyCap: 15,
    weeklyCap: 90,
  },
  {
    combo: 'Red->Red',
    peakFare: 3,
    offPeakFare: 2,
    dailyCap: 12,
    weeklyCap: 70,
  },
];
