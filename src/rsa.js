let { inverse } = require('./sign')

const RSAopen = (p1, p2, q1, q2, a, b, m) => {
    const ra = p1 * p2
    const rb = q1 * q2
    const fra = (p1 - 1) * (p2 - 1)
    const frb = (q1 - 1) * (q2 - 1)
    let alpha = inverse(a, fra)
    alpha < 0 && (alpha += fra)
    let betta = inverse(a, frb)
    betta < 0 && (betta += frb)
    let m1 = m ** b % rb
    let m2 = m ** betta % rb
    if (m2 == m) return 'correctly'
    return 'not correctly'
}

module.exports(RSAopen)