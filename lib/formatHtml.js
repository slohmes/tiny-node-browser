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

  [...res].forEach((c) => {
      if (cState === 'data') {
        if (c === '<') {
          cState = 'tagOpen';
          curToken = new Token('openTag', '');
        } else {
          tokens.push(new Token('char', c));
        }
      } else if (cState === 'tagOpen') {
        if (c === '/') {
          cState = 'closeTagOpen';
          curToken.type = 'closeTag';
        } else if (c.match(/[a-z]/i)) {
          curToken.data += c;
          cState = 'tagName';
        } else {
          logErr(`Weird tag name character found: ${c}`);
        }
      } else if (cState === 'closeTagOpen') {
        if (c.match(/[a-z]/i)) {
          curToken.data += c;
          cState = 'tagName';
        } else {
          logErr(`Weird close tag name character found: ${c}`);
        }
      } else if (cState === 'tagName') {
        if (c === '>') {
          cState = 'data';
          tokens.push(curToken);
          curToken = undefined;
        } else if (c.match(/[a-z]/i)){
          curToken.data += c;
        } else {
          logErr(`weird character found: ${c}`);
        }
      }
  });

  // layout

  let Document = '';
  const openElements = [];

  tokens.forEach((token) => {
        if (token.type === 'openTag') {
          openElements.push(token.type);
        }
        else if (token.type === 'char') {
          Document += token.data;
        }
        else if (token.type === 'closeTag') {
          Document += '\n';
          openElements.pop();
        }
        else {
          logErr(`weird token: ${token.type}`);
        }
  });
  return Document;
};

module.exports = formatHtml;
