# Fare Calculator

A TypeScript application that calculates public transport fares based on journey details and time-based rules.

## Prerequisites

- **Node.js** v18.20.5
- **npm** v10.8.2
- **TypeScript** v5.7.3

## Setup

1. Install dependencies:
    ```bash
    npm install
    ```

2. Run the application:
    ```bash
    npx ts-node index.ts
    ```

## Input Format

The application reads from `input.csv` with the following format:
- Each line contains: `FromLine,ToLine,DateTime`
- Example: `Green,Red,2021-03-24T07:58:30`

## Implementation Details

- Implements peak/off-peak fare calculation
- Applies daily and weekly fare caps
- Handles different line combinations (Green-Green, Green-Red, Red-Green, Red-Red)
- Uses `date-fns` for datetime operations

## Performance

- **Time Complexity:** O(N) where N is the number of trips (lines).
- **Space Complexity:** O(N) in the worst case due to storage of daily and weekly usage data.

## Testing

Sample test cases are provided in the `input.csv` file.