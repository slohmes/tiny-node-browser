const http = require('http');
const https = require('https');
const { URL } = require('url');

const getHtml = (urlString) => (
  new Promise((resolve, reject) => {
    const url = new URL(urlString);
    const protocolLib = (url.protocol === 'http:') ? http : https;

    protocolLib.get(url, (response) => {
      const contentType = response.headers['content-type'];
      if (response.statusCode < 200 || response.statusCode > 299) {
          const httpReqError = new Error(`HTTP request failed. Error ${response.statusCode}: ${response.statusMessage}`);
          httpReqError.name = `${response.statusCode} Error`;
          reject(httpReqError);
      } else if (!(contentType.includes('text/html') || contentType.includes('text/plain'))) {
        const nonHtmlResErr = new Error(`Received non-html response: ${contentType}`);
        nonHtmlResErr.name = `Non-HTML Reponse Error`;
        reject(nonHtmlResErr);
      } else {
        response.setEncoding('utf8');
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
