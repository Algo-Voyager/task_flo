import { readFile } from 'fs/promises';
import { handleFareCalculation } from '../controllers/fareController';
import { displayTotalFare, displayError } from '../views/fareView';

export async function runCli(filePath: string): Promise<void> {
  try {
    const csvContent = await readFile(filePath, 'utf-8');
    const csvLines = csvContent
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean);

    if (csvLines.length === 0) {
      throw new Error('Input file is empty');
    }

    const totalFare = await handleFareCalculation(csvLines);
    displayTotalFare(totalFare);
  } catch (error) {
    displayError(error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}
