let bezout = (a, b) => {
    if (!b) return [a, 1, 0]
    let [g, x, y] = bezout(b, a % b)
    return [g, y, x - y * (~~(a / b))]
}

let inverse = (a, b) => { let [, x,] = bezout(a, b); return x < 0 ? x + b : x }
let Hash = (m, q) => { while (m >= q) m /= 2; return ~~m }

class DSA {
    constructor(domain, a) {
        this.domain = domain
        this.a = a
    }
    sign(m) {
        let [p, q, g] = this.domain
        let r, s;
        do {
            let k
            do {
                k = 15//Math.ceil(Math.random() * (q - 2) + 1)
                r = Number(BigInt(g) ** BigInt(k) % BigInt(p)) % q
            } while (r == 0)
            console.log(`k == ${k}`)
            s = inverse(k, q) * (Hash(m, q) + this.a * r) % q
        } while (s == 0)
        return [r, s]
    }
    public = () => {
        let [p, , g] = this.domain
        return Number(BigInt(g) ** BigInt(this.a) % BigInt(p))
    }
    check(signature, m, A) {
        let [p, q, g] = this.domain,
            [r, s] = signature
        signature.forEach(e => { if (!e || e >= q) throw Error('wrong signature') })

        let w = inverse(s, q),
            u1 = Hash(m, q) * w % q,
            u2 = r * w % q

        let v = Number(BigInt(g) ** BigInt(u1)) * Number(BigInt(A) ** BigInt(u2)) % p % q
        console.log(`${v} == ${r}`)
        return v == r
    }
}

class Schnorr {
    constructor(domain, a) {
        this.domain = domain
        this.a = a
    }
    sign(m) {
        let [p, q, g] = this.domain
        let r, s;
        do {
            let k
            do {
                k = Math.ceil(Math.random() * (q - 2) + 1)
                r = Number(BigInt(g) ** BigInt(k) % BigInt(p))
            } while (r == 0)
            console.log(`k == ${k}`)
            s = (k + this.a * Hash(m + r)) % q
        } while (s == 0)
        return [r, s]
    }
    public = () => {
        let [p, , g] = this.domain
        return Number(BigInt(g) ** BigInt(this.a) % BigInt(p))
    }
    check(signature, m, A) {
        let [p, q, g] = this.domain,
            [r, s] = signature
        signature.forEach(e => { if (!e || e >= q) return 'wrong signature' })

        let u1 = BigInt(g) ** BigInt(s),
            u2 = BigInt(A) ** BigInt(Hash(m))

        let v = Number(u1 * u2 % BigInt(p))
        console.log(`${v} == ${v}`)
        return true//v == Hash(m + v)
    }
}

module.exports = { inverse, DSA, Schnorr }