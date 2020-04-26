const { BGsteps } = require('../src/dlog')
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
})