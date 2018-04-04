const readline = require('readline');
const goToUrl = require('./goToUrl');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'please enter a url: '
});

rl.prompt();

rl.on('line', url => {
  goToUrl(url);
  rl.prompt();

}).on('close', () => {
  console.log('\n\nhappy browsing!');
  process.exit(0);
});
