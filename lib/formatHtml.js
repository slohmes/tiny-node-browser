const logErr = require('./logErr');

const formatHtml = (res) => {

  // tokenize html

  class Token {
    constructor(type) {
      this.type = type;
    }
  }

  class TagToken extends Token {
    constructor() {
      super('openTag');
      this.name = '';
      this.attributes = [];
    }
  }

  class CharToken extends Token {
    constructor(c) {
      super('char');
      this.data = c;
    }
  }

  let curToken;
  let curAttribute = '';
  let cState = 'data';
  const tokens = [];

  let i = 0;
  while (i < res.length) {
    let c = res[i];
    switch(cState) {

      case 'data':
        if (c === '<') {
          cState = 'tagOpen';
          curToken = new TagToken();
        } else {
          tokens.push(new CharToken(c));
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
          curToken.name += c;
        } else if (c === ' ') {
          cState = 'tagAttribute';
        } else {
          logErr(`weird character found: ${c}`);
        }
        break;

      case 'tagAttribute':
        switch(c) {
          case '>':
            cState = 'tagName';
            i -= 1;
            // fallthrough
          case ' ':
            curToken.attributes.push(curAttribute);
            curAttribute = '';
            break;
          default:
            curAttribute += c;
        }
        break;
    }
    i += 1;
  }

  // layout

  let Document = '';
  const openElements = [];
  const nonTextTypes = ['style', 'script'];

  tokens.forEach((token) => {
    switch(token.type) {
      case 'openTag':
        openElements.push(token.name);
        break;
      case 'char':
        if (!nonTextTypes.includes(openElements[openElements.length - 1])) {
          Document += token.data;
        }
        break;
      case 'closeTag':
        let i = openElements.length - 1;
        while (i > 0) {
          if (openElements[i] === token.name) {
            openElements.splice(i);
            i = 0;
          }
          i -= 1;
        }
        break;
      default:
        logErr(`weird token: ${token.type}`);
    }
  });
  return Document;
};

module.exports = formatHtml;
