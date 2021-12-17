const BaseError = require('./error');

class AnotherError extends BaseError {
    constructor(message) {
      super(message);
      this.name = this.constructor.name;
    }
}

module.exports = AnotherError;
