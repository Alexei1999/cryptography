function MillerRabbin(n, k) {
    if (n == 2 || n == 3) return 'Простое'
    if (n < 2 || n % 2 == 0) return 'Составное'
    t = n - 1
    s = 0
    while (t % 2 == 0) {
        t /= 2
        s += 1
    }
    for (let i = 0; i < k; i++) {
        let a = Math.floor(Math.random() * (n - 4) + 2)
        let x = a ** t % n
        if (x == 1 || x == n - 1) continue
        for (let r = 1; r < s; r++) {
            x = x ** 2 % n
            if (x == 1) return 'Составное'
            if (x == n - 1) break
        }
        if (x != n - 1) return 'Составное'
    }
    return 'Вероятно простое'
}

function Strassen(n, k) {
    for (let i = 0; i < k; i++) {
        let a = Math.floor(Math.random() * (n - 3) + 2)
        if (GCD(a, n) > 1) return 'Составное'
        if (a ** ((n - 1) / 2) != (Jakoby(a, n) % n)) return 'Составное'
        else return 'Простое'
    }
}

function Fermats(a) {
    if (a == 2) return 'Простое'
    for (let i = 0; i < 100; i++) {
        let x = Math.random() * (a - 2) + 2
        if (GCD(x, a) != 1) return 'Составное'
        if (POWS(x, a - 1, a) != 1) return 'Составное'
    }
    return 'Простое'
}

function Legendre(a, p) {
    if (a >= p || a < 0) return Legendre(a % p, p)
    if (a < 2) return a
    if (a == 2)
        if (p % 8 == 1 || p % 8 == 7)
            return 1
        else
            return -1
    if (a == p - 1)
        if (p % 4 == 1)
            return 1
        else
            return -1
    if (!isPrime(a)) {
        factors = factorize(a)
        let product = 1
        factors.forEach(pi => product *= Legendre(pi, p))
        return product
    }
    if (((p - 1) / 2) % 2 == 0 || ((a - 1) / 2) % 2 == 0)
        return Legendre(p, a)
    else
        return -Legendre(p, a)
}

function Jakoby(a, n) {
    if (a < 0) return Jakoby(-a, n) * (-1) ^ ((n - 1) / 2)
    if (a % 2 == 0) return Jakoby(a / 2, n) * (-1) ** ((n ** 2 - 1) / 8)
    if (a == 1) return 1
    if (a < n) return (-1) ** ((a - 1) / 2 * (n - 1) / 2) * Jakoby(n, a)
    return Jakoby(a % n, n)
}

let isPrime = a => ![...Array(a).keys()].some((e, i) => i >= 2 && a % e == 0)

let factorize = n => {
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

function factorizen(n) {
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

let GCD = (a, b) => {
    while (a != 0 && b != 0) {
        if (a > b) a %= b
        else b %= a
    }
    return a + b
}
function POWS(a, b, m) {
    function MUL(a, b, m) {
        if (b == 1) return a
        if (b % 2 == 0) {
            let t = MUL(a, b / 2, m)
            return (2 * t) % m
        }
    }
    if (b == 0) return 1
    if (b % 2 == 0) {
        t = POWS(a, b / 2, m)
        return MUL(t, t, m) % m
    }
    return (MUL(POWS(a, b - 1, m), a, m)) % m
}

module.exports = { MillerRabbin, Strassen, Fermats, Legendre, Jakoby, isPrime, factorize, factorizen, GCD, POWS }