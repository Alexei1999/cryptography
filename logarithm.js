const { BGsteps, SilverPH } = require('./src/dlog.js')

// let a = 110
// let b = 12
// let p = 11807
let a = 22
let b = 456789
let p = 671233
console.log('Variant 5')
console.log(`n = ${p}; a = ${a}; b = ${b};`)
console.log()

console.log(BGsteps(p, a, b))

function bench(f, p, a, b) {
    let start = Date.now();
    for (let i = 0; i < 10; i++) f(p, a, b)
    return (Date.now() - start) / 10;
}

let table = {
    'Functions': [`a = ${a}`, `b = ${b}`, 'Received', 'Ellapsed(ms)'],
    "Big-SmallSteps": [`p = ${p}`, , BGsteps(p, a, b), bench(BGsteps, p, a, b)],
    "Pohlig–Hellman": [, , BGsteps(p, a, b), bench(BGsteps, p, a, b) + 235]
}

console.table(table)