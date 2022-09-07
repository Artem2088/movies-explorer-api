class ConnectTimedOut extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 522;
  }
}

module.exports = ConnectTimedOut;
