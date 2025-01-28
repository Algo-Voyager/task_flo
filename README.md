# Fare Calculator System

A TypeScript-based public transport fare calculation system with both CLI and REST API interfaces.

## Features

- Calculate fares based on peak/off-peak timing
- Apply daily and weekly fare caps
- Handle different metro line combinations
- Support both CLI and REST API interfaces
- Input validation and error handling
- Logging and monitoring

## Prerequisites

- Node.js v18.20.5
- npm v10.8.2
- TypeScript v5.7.3

## Installation

1. **Clone the repository**
2. **Install dependencies:**
    ```bash
    npm install
    ```

## Usage

### CLI Mode

Run the application in CLI mode using the input CSV file:

```bash
npm run cli
```

The input CSV should follow this format:
```csv
FromLine,ToLine,DateTime
Green,Red,2021-03-29T09:00:00
```

### Server Mode

1. **Create a `.env` file:**
    ```env
    PORT=5000
    ```

2. **Start the server:**
    ```bash
    npm run serve
    ```

3. **Test the API using curl:**
    ```bash
    curl -X POST http://localhost:5000/calculate-fare \
    -H "Content-Type: application/json" \
    -d @testPayload.json
    ```

## API Endpoints

### POST `/calculate-fare`

Calculate fares for multiple journeys.

**Request Body:**
```json
{
    "journeys": [
        "Green,Red,2021-03-29T09:00:00",
        "Green,Red,2021-03-29T18:00:00"
    ]
}
```

**Response:**
```json
{
    "totalFare": 8
}
```

## Project Structure

```
src/
├── cli/          # CLI interface
├── controllers/  # Business logic
├── models/       # Data models
├── routes/       # API routes
├── utils/        # Helper functions
├── views/        # Output formatting
├── server.ts     # Express server
└── index.ts      # Entry point
```

## Scripts

- `npm run build` - Build TypeScript files
- `npm run start` - Run compiled JavaScript
- `npm run dev` - Run with nodemon for development
- `npm run cli` - Run in CLI mode
- `npm run serve` - Start the server

## Performance
- **Time Complexity:** O(N) where N is the number of trips (lines).
- **Space Complexity:** O(N) in the worst case due to storage of daily and weekly usage data.