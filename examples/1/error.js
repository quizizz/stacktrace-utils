const { captureAndParseStackTrace } = require('../../');

class BaseError extends Error {
    constructor(message) {
      super(message);
      this.name = this.constructor.name;
      this.parsedStack = captureAndParseStackTrace({ startStackFunction: this.constructor });
    }
}

module.exports = BaseError;
