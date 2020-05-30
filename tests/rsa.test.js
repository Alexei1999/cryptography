const { RSAopen } = require('../src/rsa')
const { inverse, bezout } = require('../src/sign')





describe('RSA', () => {
    beforeAll(() => {
        let range = [30, 80],
            p1 = 19,
            p2 = 29,
            q1 = 5,
            q2 = 11,
            a = 5,
            b = 3,
            m = 6
    })
    describe('Euclidean algorithm', () => {
        it(`inverse element in the ring modulo of [${39},${47}] should be ${41}`, () => {
            expect(inverse(39, 47)).toBe(41)
        })
    }
})