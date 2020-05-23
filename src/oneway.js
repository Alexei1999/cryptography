const { BigInteger: BigInt } = require('jsbn')
const Errors = require('./ElGamal/errors.js')
const Utils = require('./ElGamal/utils.js')

class ElGamal {
    /**
     * @type {BigInt}
     * @memberof ElGamal
     */
    p;

    /**
     * @type {BigInt}
     * @memberof ElGamal
     */
    g;

    /**
     * @type {BigInt}
     * @memberof ElGamal
     */
    y;

    /**
     * @type {BigInt}
     * @memberof ElGamal
     */
    x;

    /**
     * @param {BigInt|string|number} p Safe prime number.
     * @param {BigInt|string|number} g Generator.
     * @param {BigInt|string|number} y Public key.
     * @param {BigInt|string|number} x Private key.
     */
    constructor(p, g, y, x) {
        this.p = Utils.parseBigInt(p);
        this.g = Utils.parseBigInt(g);
        this.y = Utils.parseBigInt(y);
        this.x = Utils.parseBigInt(x);
    }

    /**
     * @param {string|BigInt|number} m
     * @param {BigInt|string|number} [k]
     * @returns {EncryptedValue}
     */
    async encryptAsync(m, k) {
        const tmpKey = Utils.parseBigInt(k) || await Utils.getRandomBigIntAsync(
            BigInt.ONE,
            this.p.subtract(BigInt.ONE)
        );
        const mBi = new DecryptedValue(m).bi;
        const p = this.p;

        const a = this.g.modPow(tmpKey, p);
        const b = this.y.modPow(tmpKey, p).multiply(mBi).remainder(p);

        return new EncryptedValue(a, b);
    }

    /**
     * @param {EncryptedValue} m
     * @throws {MissingPrivateKeyError}
     * @returns {DecryptedValue}
     */
    async decryptAsync(m) {
        if (!this.x) throw new Errors.MissingPrivateKeyError();

        const p = this.p;
        const r = await Utils.getRandomBigIntAsync(
            Utils.BIG_TWO,
            this.p.subtract(BigInt.ONE)
        );

        const aBlind = this.g.modPow(r, p).multiply(m.a).remainder(p);
        const ax = aBlind.modPow(this.x, p);

        const plaintextBlind = ax.modInverse(p).multiply(m.b).remainder(p);
        const plaintext = this.y.modPow(r, p).multiply(plaintextBlind).remainder(p);

        return new DecryptedValue(plaintext);
    }
}

generateAsync = async (primeBits = 2048) => {
    let q;
    let p;
    do {
        q = await Utils.getBigPrimeAsync(primeBits - 1);
        p = q.shiftLeft(1).add(BigInt.ONE);
    } while (!p.isProbablePrime());

    let g;
    do {
        g = await Utils.getRandomBigIntAsync(new BigInt('3'), p);
    } while (
        g.modPowInt(2, p).equals(BigInt.ONE) ||
        g.modPow(q, p).equals(BigInt.ONE) ||
        p.subtract(BigInt.ONE).remainder(g).equals(BigInt.ZERO) ||
        p.subtract(BigInt.ONE).remainder(g.modInverse(p)).equals(BigInt.ZERO)
    );

    const x = await Utils.getRandomBigIntAsync(
        Utils.BIG_TWO,
        p.subtract(BigInt.ONE)
    );

    const y = g.modPow(x, p);

    return new ElGamal(p, g, y, x);
}

class DecryptedValue {
    /**
     * @type BigInt
     * @memberof DecryptedValue
     */
    bi;

    constructor(m) {
        switch (typeof m) {
            case 'string':
                this.bi = new BigInt(new Buffer(m).toString('hex'), 16);
                break;
            case 'number':
                this.bi = new BigInt(`${m}`);
                break;
            default:
                this.bi = m;
        }
    }

    toString() {
        return new Buffer(this.bi.toByteArray()).toString();
    }
}

class EncryptedValue {
    /**
     * @type BigInt
     * @memberof EncryptedValue
     */
    a;

    /**
     * @type BigInt
     * @memberof EncryptedValue
     */
    b;

    constructor(a, b) {
        this.a = a;
        this.b = b;
    }

    /**
     * @param {EncryptedValue} encryptedValue
     * @returns {EncryptedValue}
     */
    multiply(encryptedValue) {
        return new EncryptedValue(
            this.a.multiply(encryptedValue.a),
            this.b.multiply(encryptedValue.b)
        );
    }
}

rabinEncryption = str => {
    let arr = new TextEncoder().encode(str)
    return arr.map(m => ((m ** 2n) % 2n))
}
rabinDecryption = (arr) => {
    m1 = c ** Math.round((p + 1) / 4) % p
    m2 = -1 * c ** Math.round((p + 1) / 4) % p
    m3 = c ** ((q + 1) / 4) % q
    m4 = -1 * c ** ((q + 1) / 4) % q

    a = q * (q ** (p - 2) % p)
    b = p * (q ** (q - 2) % q)

    m1 = (a * m1 + b * m3) % n
    m2 = (a * m1 + b * m4) % n
    m3 = (a * m2 + b * m3) % n
    m4 = (a * m2 + b * m4) % n

    return [mq, m2, m3, m4]
}

module.exports = { generateAsync, ElGamal, rabinEncryption, rabinDecryption }