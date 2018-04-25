const logErr = require('./logErr');

const formatHtml = (res) => {
  // tokenize html

  let tagNameAcc = [];
  let isOpenTag = true;
  let cState = 'data';
  const tokens = [];

  [...res].forEach((c) => {
      if (cState === 'data') {
        if (c === '<') {
          cState = 'tagOpen';
          isOpenTag = true;
        } else {
          tokens.push({char: c});
        }
      } else if (cState === 'tagOpen') {
        if (c === '/') {
          cState = 'closeTagOpen';
          isOpenTag = false;
        } else if (c.match(/[a-z]/i)) {
          tagNameAcc.push(c);
          cState = 'tagName';
        } else {
          logErr(`Weird tag name character found: ${c}`);
        }
      } else if (cState === 'closeTagOpen') {
        if (c.match(/[a-z]/i)) {
          tagNameAcc.push(c);
          cState = 'tagName';
        } else {
          logErr(`Weird close tag name character found: ${c}`);
        }
      } else if (cState === 'tagName') {
        if (c === '>') {
          cState = 'data';
          tokens.push(isOpenTag ? {openTag : tagNameAcc.join('')} : {closeTag : tagNameAcc.join('')});

          tagNameAcc = [];
        } else if (c.match(/[a-z]/i)){
          tagNameAcc.push(c);
        } else {
          logErr(`weird character found: ${c}`);
        }
      }
  });
  // layout

  let Document = '';
  const openElements = [];

  tokens.forEach((token) => {
        const tokenTitle = Object.keys(token)[0];

        if (tokenTitle === 'openTag') {
          openElements.push(tokenTitle);
        }
        else if (tokenTitle === 'char') {
          Document += token.char;
        }
        else if (tokenTitle === 'closeTag') {
          Document += '\n';
          openElements.pop();
        }
        else {
          logErr(`weird token: ${tokenTitle}`);
        }
  });
  return Document;
};

module.exports = formatHtml;
