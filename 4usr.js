const { Legendre, isPrime } = require('./src/simplicity')
const { Fermats, Pollard_Rh1, Pollard_Rh0 } = require('./src/factorization')
const { bench } = require('./src/bench')

let a = 2537;
let b = 1763;
console.log('Variant 5')
console.log(`a = ${a}; b = ${b}`)
console.log()

let table = {
    'Functions': [`a = ${a}`, 'Received', 'Ellapsed(ms)', `b = ${b}`, 'Received', 'Ellapsed(ms)'],
    "Fermath's": [, Fermats(a), bench(Fermats, a), , Fermats(b), bench(Fermats, b)],
    "Pollard's rho": [, Pollard_Rh0(a), bench(Pollard_Rh0, a), , Pollard_Rh0(b), bench(Pollard_Rh0, b)],
    "Pollard's p − 1": [, Pollard_Rh1(a), bench(Pollard_Rh1, a), , Pollard_Rh1(b), bench(Pollard_Rh1, b)],
}

console.table(table)