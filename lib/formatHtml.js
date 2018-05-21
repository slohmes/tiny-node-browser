const logErr = require('./logErr');

const formatHtml = (res) => {

  // tokenize html

  class Token {
    constructor(type, data) {
      this.type = type;
      this.data = data;
    }
  }

  let curToken;
  let cState = 'data';
  const tokens = [];

  let i = 0;

  while (i < res.length) {
    let c = res[i];

    switch(cState) {
      case 'data':
        if (c === '<') {
          cState = 'tagOpen';
          curToken = new Token('openTag', '');
        } else {
          tokens.push(new Token('char', c));
        }
        break;
      case 'tagOpen':
        if (c === '/') {
          cState = 'closeTagOpen';
          curToken.type = 'closeTag';
        } else if (c.match(/[a-z]/i)) {
          cState = 'tagName';
          i -= 1;
        } else {
          logErr(`Weird tag name character found: ${c}`);
        }
        break;
      case 'closeTagOpen':
        if (c.match(/[a-z]/i)) {
          cState = 'tagName';
          i -= 1;
        } else {
          logErr(`Weird close tag name character found: ${c}`);
        }
        break;
      case 'tagName':
        if (c === '>') {
          cState = 'data';
          tokens.push(curToken);
          curToken = undefined;
        } else if (c.match(/[a-z]/i)){
          curToken.data += c;
        } else {
          logErr(`weird character found: ${c}`);
        }
        break;
    }
    i += 1;
  }

  // layout

  let Document = '';
  const openElements = [];

  tokens.forEach((token) => {
    switch(token.type) {
      case 'openTag':
        openElements.push(token.type);
        break;
      case 'char':
        Document += token.data;
        break;
      case 'closeTag':
        Document += '\n';
        openElements.pop();
        break;
      default:
        logErr(`weird token: ${token.type}`);
    }
  });
  return Document;
};

module.exports = formatHtml;
