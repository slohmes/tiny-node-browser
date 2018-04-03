const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'please enter a url: '
});

rl.prompt();

rl.on('line', (line) => {
  console.log(`ok, let's go to ${line}`);
  rl.prompt();
}).on('close', () => {
  console.log("happy browsing!");
  process.exit(0);
});
