s = require('./simplicity')

function Fermats(n) {
    let s = Math.ceil(Math.sqrt(n))
    let a, b
    if (s ** 2 == n) { a = s; return a }
    let x = s
    let l = x ** 2 - n
    let k = 0
    let y
    while (true) {
        if (Math.sqrt(l) % 1 == 0) {
            y = Math.sqrt(l);
            a = x + y;
            b = x - y;
            break;
        }
        k++
        x++
        l = x ** 2 - n
    }
    return a
}

function Pollard_Rh0(n) {
    if (s.isPrime(n)) return n
    let x, y, d
    let f = x => x ** 2 + 1
    let c = true
    do {
        let o = x
        o = c ? Math.floor(Math.random() * (n - 1) + 1) : o
        if (c) { x = f(o) % n; y = f(x) % n }
        d = s.GCD(Math.abs(y - x), n)
        c = (d == n) ? true : false
        if (!c) { x = f(x) % n; let z = f(y) % n; y = f(z) % n }
    } while (d <= 1 || d >= n)
    return d
}

function Pollard_Rh1(n) {
    if (s.isPrime(n)) return n
    let a = 2, B = 95
    for (let j = 2; j < B; j++) {
        a = a ** j % n
        d = s.GCD(a - 1, n)
        if (d > 1 && d < n)
            return d
    }
    return 'Переполнение переменной'
}
module.exports = { Fermats, Pollard_Rh0, Pollard_Rh1 }