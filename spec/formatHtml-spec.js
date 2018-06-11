const formatHtml = require('../lib/formatHtml');

describe('formatHtml', () => {

  it('should return plain text unchanged', () => {
    expect(formatHtml('plain text response')).toEqual('plain text response');
  });
  it('should strip tags from html', () => {
    expect(formatHtml('<html><body>Hello world</body></html>')).not.toContain('<html><body>');
  });
  it('should strip css from html', () => {
    const mockResponse = '<!doctype html><html><head><style type="text/css">body {background-color: #f0f0f2;}</style></head></html>';
    expect(formatHtml(mockResponse)).not.toContain('body {background-color: #f0f0f2;}');
  });
  it('should strip js from html', () => {
    const mockResponse = '<!doctype html><html><head><script>alert("hello!");</script></head></html>';
    expect(formatHtml(mockResponse)).not.toContain('hello');
  });
  it('should ignore html tags within script tags', () => {
    const mockResponse = '<!doctype html><html><head><script>alert("<p>oops</p>");</script></head></html>';
    expect(formatHtml(mockResponse)).not.toContain('oops');
  });
});
