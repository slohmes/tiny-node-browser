const http = require('http');
const https = require('https');
const { URL } = require('url');

const getHtml = (urlString) => (
  new Promise((resolve, reject) => {
    const url = new URL(urlString);
    const protocolLib = (url.protocol === 'http:') ? http : https;

    protocolLib.get(url, (response) => {
      response.setEncoding('utf8');
      if (response.statusCode < 200 || response.statusCode > 299) {
        reject(`HTTP request failed. Error ${response.statusCode}: ${response.statusMessage}`);
      }
      else {
        let body = '';
        response.on('data', (chunk) => body += chunk);
        response.on('end', () => {
          resolve(body);
        });
      }
    });
  })
);

module.exports = getHtml;
