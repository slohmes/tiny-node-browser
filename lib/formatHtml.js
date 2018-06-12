const logErr = require('./logErr');
const tokenize = require('./tokenize');

const formatHtml = (res) => {

  let tokens = tokenize(res);

  let Document = '';
  const openElements = [];

  const addToDocument = (token) => {
    switch (openElements[openElements.length - 1]) {
      case 'style':
      case 'script':
        break;
      default:
        if (! openElements.includes('script')) {
          Document += token.data;
        }
    }
  };

  tokens.forEach((token) => {
    switch(token.type) {
      case 'openTag':
        openElements.push(token.name);
        break;
      case 'char':
        addToDocument(token);
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
