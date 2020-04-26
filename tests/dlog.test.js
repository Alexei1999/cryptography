const { BGsteps, SilverPH } = require('../src/dlog')
const { factorizen } = require('../src/simplicity')

let h = 5
describe('dlog', () => {
    describe('bgteps', () => {
        it('h from 23 shold be 5', () => {
            expect(Math.ceil(Math.sqrt(23))).toEqual(5)
        })
        it('table for 9*2**t%23 when t = 0-4 should be [9,18,13,3,6]', () => {
            expect([...Array(h).keys()].map((s, t) => (9 * 2 ** t % 23))).toEqual([9, 18, 13, 3, 6])
        })
        it('table for (a ** h) ** (l + 1) % p when t = 1-5 should be [9,12,16,6,8]', () => {
            expect([...Array(h).keys()].map((s, l) => ((2 ** h) ** (l + 1) % 23))).toEqual([9, 12, 16, 6, 8])
        })
        it('First match of same elements in [9, 18, 13, 3, 6] and [9,12,16,6,8] shuld be on 0 and 1 positions', () => {
            let bat = [9, 18, 13, 3, 6]
            let ahl = [9, 12, 16, 6, 8]
            expect(bat.filter(s => ahl.includes(s)).map(s => [bat.indexOf(s), ahl.indexOf(s) + 1])[0]).toEqual([0, 1])
        })
        it('first solution of BGsteps(23, 2, 9) shuld be equal 5', () => {
            expect(BGsteps(23, 2, 9)[0]).toEqual(5)
        })
    })
    describe('silverph', () => {
        let p = 37n, a = 2n, b = 28n
        let findMod = (q, x) => BigInt(rij[q].indexOf(rij[q].find(s => s == x) || rij[q].find(s => s == x < 0 ? x + p : x - p)))
        let factors, rij, xs

        beforeAll(() => {
            let dups = []
            factors = factorizen(p - 1n)
            factors.forEach(s => dups[s] = 1 + (dups[s] || 0))
            factors = [...dups.keys()].map(s => ({ q: BigInt(s), a: BigInt(dups[s] || 0) })).filter(s => s.a)
            rij = Array(factors.length).fill().map((s, i) => Array(Number(factors[i].q)).fill()).map((s, i) => s.map((s, j) => a ** (BigInt(j) * (p - 1n) / factors[i].q) % p))
            xs = factors.map((e, i) => {
                let x0 = findMod(i, b ** ((p - 1n) / e.q) % p)
                let x1 = findMod(i, BigInt((b * BigInt(Math.ceil(Number(a) ** Number(-x0))))) ** (p - 1n) / (e.q ** 2n) % p)
                let m = e.q ** e.a
                return { val: (x0 + x1 * e.q) % m == 0 ? 1 : (x0 + x1 * e.q) % m, mod: m }
            })
        })

        it('factors from 36 shold be [ { q: 2n, a: 2n }, { q: 3n, a: 2n } ]', () => {
            let dups = []
            let factors = factorizen(p - 1n)
            factors.forEach(s => dups[s] = 1 + (dups[s] || 0))
            factors = [...dups.keys()].map(s => ({ q: BigInt(s), a: BigInt(dups[s] || 0) })).filter(s => s.a)
            expect(factors).toEqual([{ q: 2n, a: 2n }, { q: 3n, a: 2n }])
        })
        it('rij table from factors should be [ [ 1n, 36n ], [ 1n, 26n, 10n ] ]', () => {
            rij = Array(factors.length).fill().map((s, i) => Array(Number(factors[i].q)).fill()).map((s, i) => s.map((s, j) => a ** (BigInt(j) * (p - 1n) / factors[i].q) % p))
            expect(rij).toEqual([[1n, 36n], [1n, 26n, 10n]])
        })
        it('xs table from factors and rij should be [ { val: 2n, mod: 4n }, { val: 7n, mod: 9n } ]', () => {
            xs = factors.map((e, i) => {
                let x0 = findMod(i, b ** ((p - 1n) / e.q) % p)
                let x1 = findMod(i, BigInt((b * BigInt(Math.ceil(Number(a) ** Number(-x0))))) ** (p - 1n) / (e.q ** 2n) % p)
                let m = e.q ** e.a
                return { val: (x0 + x1 * e.q) % m, mod: m }
            })
            expect(xs).toEqual([{ val: 2n, mod: 4n }, { val: 7n, mod: 9n }])
        })
        it('solution of SilverPH(37, 2, 28) shuld be equal 35', () => {
            expect(SilverPH(37, 2, 28)).toEqual(35)
        })
    })
})