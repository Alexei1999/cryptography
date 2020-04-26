s = require('../src/simplicity')

describe('simplicity', () => {
    describe('factorize', () => {
        it('factorize(32*9*11*13*13) should equal to [2, 2, 2, 2, 2, 3, 3, 11, 13, 13]', () => {
            expect(s.factorize(32 * 9 * 11 * 13 * 13)).toEqual([2, 2, 2, 2, 2, 3, 3, 11, 13, 13])
        })
    })
    describe('legendre', () => {
        it('legendre(3,29) should equal to -1', () => {
            expect(s.Legendre(3, 29)).toEqual(-1)
        })
        it('legendre(111,41) should equal to -1', () => {
            expect(s.Legendre(111, 41)).toEqual(-1)
        })
        it('legendre(113,41) should equal to 1', () => {
            expect(s.Legendre(113, 41)).toEqual(1)
        })
        it('legendre(2,31) should equal to 1', () => {
            expect(s.Legendre(2, 31)).toEqual(1)
        })
        it('legendre(5,31) should equal to 1', () => {
            expect(s.Legendre(5, 31)).toEqual(1)
        })
        it('legendre(150,1009) should equal to 1', () => {
            expect(s.Legendre(150, 1009)).toEqual(1)
        })
        it('legendre(25,1009) should equal to 1', () => {
            expect(s.Legendre(25, 1009)).toEqual(1)
        })
        it('legendre(2,1009) should equal to 1', () => {
            expect(s.Legendre(2, 1009)).toEqual(1)
        })
        it('legendre(3,1009) should equal to 1', () => {
            expect(s.Legendre(3, 1009)).toEqual(1)
        })
    })
    describe('isPrime', () => {
        it('isPrime(13) should be truthty', () => {
            expect(s.isPrime(13)).toBeTruthy()
        })
        it('isPrime(12) should be falsy', () => {
            expect(s.isPrime(12)).toBeFalsy()
        })
    })
    describe('GCD', () => {
        it('GCD(30, 18) should equal to 6', () => {
            expect(s.GCD(30, 18)).toEqual(6)
        })
        it('GCD(30, 17) should equal to 1', () => {
            expect(s.GCD(30, 17)).toEqual(1)
        })
    })
})