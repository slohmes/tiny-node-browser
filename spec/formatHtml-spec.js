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
});
