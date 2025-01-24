import { runCli } from './cli/fareCli';
import { runServer } from './server';

const args = process.argv.slice(2);

if (args.length > 0 && args[0] === 'cli') {
  const filePath = args[1] || 'input.csv';
  runCli(filePath);
} else {
  // Default action: start the server
  runServer();
}
