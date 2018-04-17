const http = require('http');
const https = require('https');
const getHtml = require('../lib/getHtml');

describe('getHtml', () => {

  it('should throw an error when given an invalid url', (done) => {
    getHtml('invalid url').catch((res) => {
      expect(res).toBeDefined();
      done();
    });
  });

  it('should send an http get request when given a valid url', () => {
    spyOn(http, 'get');
    getHtml('http://www.example.com');
    expect(http.get).toHaveBeenCalled();
  });

  it('should use https when given a url with https', () => {
    spyOn(https, 'get');
    getHtml('https://www.example.com');
    expect(https.get).toHaveBeenCalled();
  });

  it('should throw an error when status code of http response is not 2xx', (done) => {
    spyOn(http, 'get').and.callFake((url, callback) => (callback({
        statusCode: 406,
        statusMessage: 'Not Acceptable'
      })
    ));
    getHtml('http://www.some-url.com').catch((err) => {
       expect(err).toContain('406');
       done();
    });
  });

  it('should return html when valid http response is returned', (done) => {
    const hostname = '127.0.0.1';
    const port = 3000;

    const testServer = http.createServer((req, res) => {
      res.writeHead(200);
      res.end('<html>hello world</html>');
    }).listen(port, hostname);

    getHtml(`http://${hostname}:${port}/`).then((response) => {
      expect(response).toContain('<html>');
      done();
    });
  });
});
