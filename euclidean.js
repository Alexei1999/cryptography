const { inverse } = require('./src/sign')

const Euclidean = (a, b) => {
    if (a < b) { let c = a; a = b; b = c; }
    let arr = {}
    const Parse = (a, b) => {
        let r = a % b
        arr[a % b] = `${a}-${Math.floor(a / b)}*${b}`
        console.log(`${a}=${Math.floor(a / b)}*${b}+${a % b}`)
        if (r > 1) Parse(b, r)
    }
    Parse(a, b)
    console.log('---')
    console.log(Object.entries(arr).map(s => s.join('=')).reverse().join('\n'))
    console.log('---')
    let res = ''
    let str = arr['1']
    while (Object.keys(arr).slice(1).some(s => str.match(new RegExp(`\\b${s}\\b`, 'g')))) {
        Object.keys(arr).slice(1).forEach(s => {
            res += str + '='
            str = str.replace(new RegExp(`\\b${s}\\b`, 'g'), `(${arr[s]})`)
        })
    }
    res = '1=' + res.split('\n').map(s => s.replace(/1\*/gm, '')).join('')
    console.log(res)
    // return str
}

let a = 107, b = 10200
Euclidean(a, b)
console.log('inverse element by module on the ring: ' + inverse(a, b))