const https = require('https');
const http = require('http');
const urlLib = require('url');

const printHtmlResponse = (res) => {
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
      console.log(rawData);
    } catch (e) {
      console.error(e.message);
    }
  });
};

const tryHttp = (url) => {
  http.get(url, printHtmlResponse)
  .on('error', (e) => {
    console.error(e.message);
  });
};

const goToUrl = (url) => {
  console.log(`ok, let's go to ${url}`);

  if (urlLib.parse(url).protocol === null) {
    url = 'https://' + url;
  }

  if (urlLib.parse(url).protocol === 'http:') {
    tryHttp(url);
  } else {
    https.get(url, printHtmlResponse)
    .on('error', (e) => {
      if (e.code === 'ERR_INVALID_PROTOCOL') {
        if (urlLib.parse(url).protocol !== 'http:') {
          url = (urlLib.parse(url).protocol = 'http:').toString();
        }
        tryHttp(url);
      } else {
        console.error(e.message);
      }
    });
  }

};

module.exports = goToUrl;
