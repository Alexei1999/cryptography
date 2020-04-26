const { factorizen } = require('./simplicity')

BGsteps = (p, a, b) => {
    p = BigInt(p), a = BigInt(a), b = BigInt(b)
    let h = BigInt(Math.ceil(Math.sqrt(Number(p))))
    let bat = [...Array(Number(h)).keys()].map((s, t) => b * a ** BigInt(t) % p)
    let ahl = [...Array(Number(h)).keys()].map((s, l) => (a ** h) ** BigInt(l + 1) % p)
    let ret = bat.filter(s => ahl.includes(s)).map(s => {
        let [t, l] = [bat.indexOf(s), ahl.indexOf(s) + 1]
        return Number(h) * l - t
    })
    return ret.length ? ret : 'Нет решений'
}

SilverPH = (p, a, b) => {
    p = BigInt(p), a = BigInt(a), b = BigInt(b)
    let dups = []
    let factors = factorizen(p - 1n)
    factors.forEach(s => dups[s] = 1 + (dups[s] || 0))
    factors = [...dups.keys()].map(s => ({ q: BigInt(s), a: BigInt(dups[s] || 0) })).filter(s => s.a)
    let rij = Array(factors.length).fill().map((s, i) => Array(Number(factors[i].q)).fill()).map((s, i) => s.map((s, j) => a ** (BigInt(j) * (p - 1n) / factors[i].q) % p))
    let findMod = (q, x) => BigInt(rij[q].indexOf(rij[q].find(s => s == x) || rij[q].find(s => s == x < 0 ? x + p : x - p)))
    let xs = factors.map((e, i) => {
        let x0 = findMod(i, b ** ((p - 1n) / e.q) % p)
        let x1 = findMod(i, BigInt(Number(b) * (Number(a) ** Number(-x0))) ** ((p - 1n) / (e.q ** 2n)) % p)
        let m = e.q ** e.a
        return { val: ((x0 + x1 * e.q) % m) ? ((x0 + x1 * e.q) % m) : 1, mod: m }
    })
    let x = 1n
    while ((x < p ** 2n) && !xs.every(s => x % s.mod == s.val)) x++;
    return x == p ** 2n - 1n ? 'Нет решений' : Number(x)
}

module.exports = { BGsteps, SilverPH }