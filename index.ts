import * as fs from 'fs';
import { calculateFare } from './fareCalculator';

const csvContent = fs.readFileSync('input.csv', 'utf-8');
const csvLines = csvContent.split('\n').filter(line => line.trim() !== '');

const totalFare = calculateFare(csvLines);
console.log('Total fare applied:', totalFare);