const http = require('http');

describe('goToUrl', () => {
  const goToUrl = require('../lib/goToUrl');

  it('should echo the url', () => {
    spyOn(http, 'get').and.callThrough();

    const exampleDotCom = 'http://www.example.com';
    goToUrl(exampleDotCom);
    expect(http.get).toHaveBeenCalled();
  });
});
