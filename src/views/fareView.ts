export function displayTotalFare(totalFare: number): void {
  console.log(`Total fare applied: $${totalFare.toFixed(2)}`);
}

export function displayError(message: string): void {
  console.error(`Error: ${message}`);
}
