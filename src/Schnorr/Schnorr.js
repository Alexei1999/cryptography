'use strict';

const assert = require('bsert');
const elliptic = require('bcrypto/vendor/elliptic');
const Signature = require('bcrypto/lib/internal/signature');
const BN = require('bcrypto/lib/bn.js');
const DRBG = require('bcrypto/lib/drbg');
const sha256 = require('bcrypto/lib/sha256');
const curve = elliptic.ec('secp256k1').curve;
const POOL64 = Buffer.allocUnsafe(64);
const schnorr = exports;

/**
 * Hash (r | M).
 * @param {Buffer} msg
 * @param {BN} r
 * @returns {Buffer}
 */

schnorr.hash = function hash(msg, r) {
    const R = r.toArrayLike(Buffer, 'be', 32);
    const B = POOL64;

    R.copy(B, 0);
    msg.copy(B, 32);

    return new BN(sha256.digest(B));
};

/**
 * Sign message.
 * @private
 * @param {Buffer} msg
 * @param {BN} priv
 * @param {BN} k
 * @param {Buffer} pn
 * @returns {Signature|null}
 */

schnorr.trySign = function trySign(msg, prv, k, pn) {
    if (prv.isZero())
        throw new Error('Bad private key.');

    if (prv.gte(curve.n))
        throw new Error('Bad private key.');

    if (k.isZero())
        return null;

    if (k.gte(curve.n))
        return null;

    let r = curve.g.mul(k);

    if (pn)
        r = r.add(pn);

    if (r.y.isOdd()) {
        k = k.umod(curve.n);
        k = curve.n.sub(k);
    }

    const h = schnorr.hash(msg, r.getX());

    if (h.isZero())
        return null;

    if (h.gte(curve.n))
        return null;

    let s = h.imul(prv);
    s = k.isub(s);
    s = s.umod(curve.n);

    if (s.isZero())
        return null;

    return toSignature(r.getX(), s);
};

/**
 * Sign message.
 * @param {Buffer} msg
 * @param {Buffer} key
 * @param {Buffer} pubNonce
 * @returns {Signature}
 */

schnorr.sign = function sign(msg, key, pubNonce) {
    const prv = new BN(key);
    const drbg = schnorr.drbg(msg, key, pubNonce);
    const len = curve.n.byteLength();

    let pn;
    if (pubNonce)
        pn = curve.decodePoint(pubNonce);

    let sig;
    while (!sig) {
        const k = new BN(drbg.generate(len));
        sig = schnorr.trySign(msg, prv, k, pn);
    }

    return sig;
};

/**
 * Verify signature.
 * @param {Buffer} msg
 * @param {Buffer} signature
 * @param {Buffer} key
 * @returns {Buffer}
 */

schnorr.verify = function verify(msg, signature, key) {
    const sig = fromSignature(signature);
    const h = schnorr.hash(msg, sig.r);

    if (h.gte(curve.n))
        throw new Error('Invalid hash.');

    if (h.isZero())
        throw new Error('Invalid hash.');

    if (sig.s.gte(curve.n))
        throw new Error('Invalid S value.');

    if (sig.r.gt(curve.p))
        throw new Error('Invalid R value.');

    const k = curve.decodePoint(key);
    const l = k.mul(h);
    const r = curve.g.mul(sig.s);
    const rl = l.add(r);

    if (rl.y.isOdd())
        throw new Error('Odd R value.');

    return rl.getX().eq(sig.r);
};

/**
 * Recover public key.
 * @param {Buffer} msg
 * @param {Buffer} signature
 * @returns {Buffer}
 */

schnorr.recover = function recover(signature, msg) {
    const sig = fromSignature(signature);
    const h = schnorr.hash(msg, sig.r);

    if (h.gte(curve.n))
        throw new Error('Invalid hash.');

    if (h.isZero())
        throw new Error('Invalid hash.');

    if (sig.s.gte(curve.n))
        throw new Error('Invalid S value.');

    if (sig.r.gt(curve.p))
        throw new Error('Invalid R value.');

    let hinv = h.invm(curve.n);
    hinv = hinv.umod(curve.n);

    let s = sig.s;
    s = curve.n.sub(s);
    s = s.umod(curve.n);

    s = s.imul(hinv);
    s = s.umod(curve.n);

    const R = curve.pointFromX(sig.r, false);
    let l = R.mul(hinv);
    let r = curve.g.mul(s);
    const k = l.add(r);

    l = k.mul(h);
    r = curve.g.mul(sig.s);

    const rl = l.add(r);

    if (rl.y.isOdd())
        throw new Error('Odd R value.');

    if (!rl.getX().eq(sig.r))
        throw new Error('Could not recover pubkey.');

    return Buffer.from(k.encode('array', true));
};

/**
 * Combine signatures.
 * @param {Buffer[]} sigs
 * @returns {Signature}
 */

schnorr.combineSigs = function combineSigs(sigs) {
    let s = new BN(0);
    let r, last;

    for (let i = 0; i < sigs.length; i++) {
        const sig = fromSignature(sigs[i]);

        if (sig.s.isZero())
            throw new Error('Bad S value.');

        if (sig.s.gte(curve.n))
            throw new Error('Bad S value.');

        if (!r)
            r = sig.r;

        if (last && !last.r.eq(sig.r))
            throw new Error('Bad signature combination.');

        s = s.iadd(sig.s);
        s = s.umod(curve.n);

        last = sig;
    }

    if (s.isZero())
        throw new Error('Bad combined signature.');

    return toSignature(r, s);
};

/**
 * Combine public keys.
 * @param {Buffer[]} keys
 * @returns {Buffer}
 */

schnorr.combineKeys = function combineKeys(keys) {
    if (keys.length === 0)
        throw new Error();

    if (keys.length === 1)
        return keys[0];

    let point = curve.decodePoint(keys[0]);

    for (let i = 1; i < keys.length; i++) {
        const key = curve.decodePoint(keys[i]);
        point = point.add(key);
    }

    return Buffer.from(point.encode('array', true));
};

/**
 * Partially sign.
 * @param {Buffer} msg
 * @param {Buffer} priv
 * @param {Buffer} privNonce
 * @param {Buffer} pubNonce
 * @returns {Buffer}
 */

schnorr.partialSign = function partialSign(msg, priv, privNonce, pubNonce) {
    const prv = new BN(priv);
    const k = new BN(privNonce);
    const pn = curve.decodePoint(pubNonce);
    const sig = schnorr.trySign(msg, prv, k, pn);

    if (!sig)
        throw new Error('Bad K value.');

    return sig;
};

/**
 * Schnorr personalization string.
 * @const {Buffer}
 */

schnorr.alg = Buffer.from('Schnorr+SHA256  ', 'ascii');

/**
 * Instantiate an HMAC-DRBG.
 * @param {Buffer} msg
 * @param {Buffer} priv
 * @param {Buffer} data
 * @returns {DRBG}
 */

schnorr.drbg = function drbg(msg, priv, data) {
    const pers = Buffer.allocUnsafe(48);

    pers.fill(0);

    if (data) {
        assert(data.length === 32);
        data.copy(pers, 0);
    }

    schnorr.alg.copy(pers, 32);

    return new DRBG(sha256, priv, msg, pers);
};

/**
 * Generate pub+priv nonce pair.
 * @param {Buffer} msg
 * @param {Buffer} priv
 * @param {Buffer} data
 * @returns {Buffer}
 */

schnorr.generateNoncePair = function generateNoncePair(msg, priv, data) {
    const drbg = schnorr.drbg(msg, priv, data);
    const len = curve.n.byteLength();

    let k = null;

    for (; ;) {
        k = new BN(drbg.generate(len));

        if (k.isZero())
            continue;

        if (k.gte(curve.n))
            continue;

        break;
    }

    return Buffer.from(curve.g.mul(k).encode('array', true));
};

/*
 * Helpers
 */

function toBuffer(n, size) {
    return n.toArrayLike(Buffer, 'be', size);
}

function toSignature(r, s) {
    const sig = new Signature();
    sig.r = toBuffer(r, 32);
    sig.s = toBuffer(s, 32);
    return sig.toDER(32);
}

function fromSignature(sig) {
    const { r, s } = Signature.fromDER(sig, 32);
    return {
        r: new BN(r),
        s: new BN(s)
    };
}