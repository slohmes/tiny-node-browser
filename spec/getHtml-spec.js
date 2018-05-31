const http = require('http');
const https = require('https');
const getHtml = require('../lib/getHtml');

describe('getHtml', () => {
  const exampleDotCom = 'http://www.example.com';

  it('should throw an error when given an invalid url', (done) => {
    getHtml('invalid url').catch((res) => {
      expect(res).toBeDefined();
      done();
    });
  });

  it('should send an http get request when given a valid url', () => {
    spyOn(http, 'get');
    getHtml(exampleDotCom);
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
        statusMessage: 'Not Acceptable',
        headers: {'content-type': 'text/plain'}
      })
    ));
    getHtml(exampleDotCom).catch((err) => {
       expect(err.name).toContain('406');
       done();
    });
  });

  it('should throw error if response is not html or plain text', (done) => {
    spyOn(http, 'get').and.callFake((url, cb) => (cb({
      statusCode: 200,
      headers: {'content-type': 'audio/ogg'},
      setEncoding: () => {},
      on: () => {}
    })));
    getHtml(exampleDotCom).catch((err) => {
      expect(err).toBeDefined();
      done();
    });
  });

  it('should return text if response is plain text', (done) => {
    const hostname = '127.0.0.1';
    const port = 3000;

    const testServer = http.createServer((req, res) => {
      res.writeHead(200, {'content-type': 'text/plain'});
      res.end('la de dah');
    }).listen(port, hostname);

    getHtml(`http://${hostname}:${port}/`).then(res => {
      expect(res).toEqual('la de dah');
      done();
    })
  });

  it('should return html when valid http response is returned', (done) => {
    const hostname = '127.0.0.1';
    const port = 3001;

    const testServer = http.createServer((req, res) => {
      res.writeHead(200, {'content-type': 'text/html'});
      res.end('<html>hello world</html>');
    }).listen(port, hostname);

    getHtml(`http://${hostname}:${port}/`).then(res => {
      expect(res).toContain('<html>');
      done();
    });
  });

  it('should return html when http contentType header contains character encoding', (done) => {
    const hostname = '127.0.0.1';
    const port = 3002;

    const testServer = http.createServer((req, res) => {
      res.writeHead(200, {'content-type': 'text/html; charset=UTF-8'});
      res.end('<html>hello world</html>');
    }).listen(port, hostname);

    getHtml(`http://${hostname}:${port}/`).then(res => {
      expect(res).toContain('<html>');
      done();
    });
  });
});
