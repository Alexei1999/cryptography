let { inverse } = require('../src/sign')

describe('sign', () => {
    describe('Euclidean algorithm', () => {
        it(`inverse element in the ring modulo of [${39},${47}] should be ${41}`, () => {
            expect(inverse(39, 47)).toBe(41)
        })
    }
})