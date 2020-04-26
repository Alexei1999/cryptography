const { BGsteps, SilverPH } = require('./src/dlog.js')
const { bench } = require('./src/bench')

let a = 110
let b = 12
let p = 11807
console.log('Variant 17')
console.log(`n = ${p}; a = ${a}; b = ${b};`)
console.log()

let table = {
    'Functions': [`a = ${a}`, 'Received', 'Ellapsed(ms)', `b = ${b}`, 'Received', 'Ellapsed(ms)'],
    "Fermath's": [, Fermats(a), bench(Fermats, a), , Fermats(b), bench(Fermats, b)],
    "Pollard's rho": [, Pollard_Rh0(a), bench(Pollard_Rh0, a), , Pollard_Rh0(b), bench(Pollard_Rh0, b)],
    "Pollard's p − 1": [, Pollard_Rh1(a), bench(Pollard_Rh1, a), , Pollard_Rh1(b), bench(Pollard_Rh1, b)],
}

console.log(SilverPH(p, a, b))
console.log(BGsteps(p, a, b))