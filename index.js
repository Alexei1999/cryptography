const { BGsteps } = require('./src/dlog')
// let a = BigInt(110)
// let b = BigInt(12)
// let p = BigInt(11807)

let a = 2n
let b = 28n
let p = 37n
console.log(`a = ${a}, b = ${b}, p = ${p}`)

let dups = []
let factors = factorize(p - 1n)
factors.forEach(s => dups[s] = 1 + (dups[s] || 0))
factors = [...dups.keys()].map(s => ({ q: BigInt(s), a: BigInt(dups[s] || 0) })).filter(s => s.a)
let rij = Array(factors.length).fill().map((s, i) => Array(Number(factors[i].q)).fill()).map((s, i) => s.map((s, j) => a ** (BigInt(j) * (p - 1n) / factors[i].q) % p))
let findMod = (q, x) => BigInt(rij[q].indexOf(rij[q].find(s => s == x) || rij[q].find(s => s == x < 0 ? x + p : x - p)))

let xs = factors.map((e, i) => {
    let x0 = findMod(i, b ** ((p - 1n) / e.q) % p)
    let x1 = findMod(i, BigInt(Number(b) * (Number(a) ** Number(-x0))) ** ((p - 1n) / (e.q ** 2n)) % p)
    let m = e.q ** e.a
    return { val: (x0 + x1 * e.q) % m, mod: m }
})

let x = xs.reduce((max, s) => max = max > s.mod ? max : s.mod) + 1n
while (!(!(x < p) || xs.every(s => x % s.mod == s.val))) x++;
console.log(`x = ${x}`)
console.log('...')
console.log(factors)
console.log(rij)
console.log(xs)

function factorize(n) {
    let factors = []
    let p = BigInt(2)
    do {
        while (n % p == 0 && n > 0) {
            factors.push(p)
            n = n / p
        }
        p++
    }
    while (p <= n / p)
    if (n > 1) factors.push(n)
    return factors
}