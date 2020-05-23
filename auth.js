let { DSA, Schnorr } = require('./src/sign')

//p, q, g
let domain = [283, 47, 60]
let a = 24,
    m = 82
let dsa = new DSA(domain, a)
let schnorr = new Schnorr(domain, a)

console.log('domain(p,q,g) -> ', domain)
console.log('private key a -> ', a)
console.log('message m -> ', m)


console.group('DSA alghoritm')
let check
let signature = dsa.sign(m)
console.log('signature -> ', signature)
let public = dsa.public()
console.log('public key -> ', public)
check = dsa.check(signature, m, public)
console.log('verified -> ', check)
console.groupEnd()


console.group('Schnorr alghoritm')
check
signature = schnorr.sign(m)
console.log('signature -> ', signature)
public = schnorr.public()
console.log('public key -> ', public)
check = schnorr.check(signature, m, public)
console.log('verified -> ', check)
console.groupEnd()