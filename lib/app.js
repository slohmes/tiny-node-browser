const readline = require('readline');
const getHtml = require('./getHtml');
const formatHtml = require('./formatHtml');
const logErr = require('./logErr');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'please enter a url: '
});

rl.prompt();

rl.on('line', url => {
  getHtml(url).then((response) => {
    console.log(formatHtml(response));
    rl.prompt();
  })
  .catch((err) => {
    console.log(`Uh-oh! Encountered ${err.name} trying to retrieve ${url}.`);
    logErr(`${err.message}\ntrying to retrieve ${url}`);
    rl.prompt();
  });

}).on('close', () => {
  process.exit(0);
});
