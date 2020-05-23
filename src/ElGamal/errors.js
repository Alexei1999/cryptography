
ErrorBase = require('es6-error')

module.exports = class MissingPrivateKeyError extends ErrorBase {
    constructor() {
        super('No private key was specified for data decryption.');
    }
}