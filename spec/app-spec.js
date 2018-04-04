describe('goToUrl', () => {
  const goToUrl = require('../lib/goToUrl');

  it('should echo the url', () => {
    spyOn(console, 'log');

    const exampleDotCom = 'www.example.com';
    goToUrl(exampleDotCom);
    expect(console.log).toHaveBeenCalledWith(jasmine.stringMatching(`ok, let's go to ` + exampleDotCom));
  });
});
