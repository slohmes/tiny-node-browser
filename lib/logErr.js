const logErr = (errMessage, logLevel = 'notice') => {
  const logLevels = {
    // From RFC5424, The Syslog Protocol https://tools.ietf.org/html/rfc5424
    emerg: 0,
    alert: 1,
    crit: 2,
    error: 3,
    warning: 4,
    notice: 5,
    info: 6,
    debug: 7
  };
  const timestamp = new Date().toUTCString();
  const source = 'at ' + (new Error().stack).split("at ").slice(1).join('');

  console.error(timestamp, logLevel, '\n', errMessage, '\n', source, '\n');
};

module.exports = logErr;
