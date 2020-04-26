const { BGsteps } = require('./src/dlog')
// let a = BigInt(110)
// let b = BigInt(12)
// let p = BigInt(11807)

let a = 2
let b = 28
let p = 37
console.log(`a = ${a}, b = ${b}, p = ${p}`)

let dups = []
let factors = factorize(p - 1)
factors.forEach(s => dups[s] = 1 + (dups[s] || 0))
factors = [...dups.keys()].map(s => ({ q: s, a: dups[s] || 0 })).filter(s => s.a)
let rij = Array(factors.length).fill().map((s, i) => Array(factors[i].q).fill()).map((s, i) => s.map((s, j) => a ** (j * (p - 1) / factors[i].q) % p))

let findMod = (q, x) => rij[q].indexOf(rij[q].find(s => s == x) || rij[q].find(s => s == x < 0 ? x + p : x - p))

let xs = factors.map((e, i) => {
    let x0 = findMod(i, b ** ((p - 1) / e.q) % p)
    let x1 = findMod(i, (b * a ** -x0) ** ((p - 1) / (e.q ** 2)) % p)
    if (~x0 && ~x1) console.log('I cant compare numbers')
    let m = e.q ** e.a
    return { val: (x0 + x1 * e.q) % m, mod: m }
})

let x = 1
while (++x < p || xs.every(s => x % s.mod == s.val));
console.log(`x = ${x}`)
console.log('...')
console.log(factors)
console.log('...')
console.log(rij)
console.log('...')
console.log(xs)

function factorize(n) {
    let factors = []
    let p = 2
    do {
        while (n % p == 0 && n > 0) {
            factors.push(p)
            n = n / p
        }
        p += 1
    }
    while (p <= n / p)
    if (n > 1) factors.push(n)
    return factors
}