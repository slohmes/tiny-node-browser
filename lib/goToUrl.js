const http = require('http');

const goToUrl = (url) => {
  console.log(`ok, let's go to ${url}`);
  http.get(url, res => {
    const {statusCode} = res;
    const contentType = res.headers['content-type'];

    let error;
    if (statusCode !== 200) {
      error = new Error('Request Failed. \n' + `Status Code: ${statusCode}`);
    } else if (!/^application\/json/.test(contentType)) {
      errror = new Error('Invalid content-type.\n' + `Expected application/json but recieved ${contentType}`);
    }
    if (error) {
      console.error(error.message);
      res.resume();
      return;
    }

    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', chunk => { rawData += chunk; });
    res.on('end', () => {
      try {
        console.log(res);
      } catch (e) {
        console.error(e.message);
      }
    });
  }).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
  });
};

module.exports = goToUrl;
