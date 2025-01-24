import { FareCalculator } from '../models/fareCalculator';

export async function handleFareCalculation(journeys: string[]): Promise<number> {
  const fareCalculator = new FareCalculator();

  for (const line of journeys) {
    const parts = line.split(',');
    if (parts.length < 3) {
      console.warn(`Skipping invalid line: ${line}`);
      continue;
    }
    const fromLine = parts[0].trim() as 'Green' | 'Red';
    const toLine = parts[1].trim() as 'Green' | 'Red';
    const dateTimeStr = parts[2].trim();

    fareCalculator.processJourney(fromLine, toLine, dateTimeStr);
  }

  const totalFare = fareCalculator.getTotalFare();
  return totalFare;
}
