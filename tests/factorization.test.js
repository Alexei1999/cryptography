const { Fermats, Pollard_Rh1, Pollard_Rh0 } = require('../src/factorization')

describe('simplicity', () => {
    let number = {
        2021: [47, 43],
        3763: [71, 53],
    }
    let a = 2021
    let b = 3763
    let p = 17
    describe("Fermat's factorization", () => {
        it(`Fermats(${a}) should be equal to ${number[a].join(' or ')}`, () => {
            expect(number[a].includes(Fermats(a))).toBeTruthy()
        })
        it(`Fermats(${b}) should be equal to ${number[b].join(' or ')}`, () => {
            expect(number[b].includes(Fermats(b))).toBeTruthy()
        })
        it(`Fermats from prime number should return same number`, () => {
            expect(Fermats(p)).toEqual(p)
        })
    })
    describe("Pollard's rho factorization", () => {
        it(`Pollard_Rh0(${a}) should be equal to ${number[a].join(' or ')}`, () => {
            expect(number[a].includes(Pollard_Rh0(a))).toBeTruthy()
        })
        it(`Pollard_Rh0(${b}) should be equal to ${number[b].join(' or ')}`, () => {
            expect(number[a].includes(Pollard_Rh0(a))).toBeTruthy()
        })
        it(`Pollard_Rh0 from prime number should return same number`, () => {
            expect(Pollard_Rh0(p)).toEqual(p)
        })
    })
    describe("Pollard's p − 1 factorization", () => {
        it(`Pollard_Rh1(${a}) should be equal to ${number[a].join(' or ')}`, () => {
            expect(number[a].includes(Pollard_Rh1(a))).toBeTruthy()
        })
        it(`Pollard_Rh1(${b}) should be equal to ${number[b].join(' or ')}`, () => {
            expect(number[a].includes(Pollard_Rh1(a))).toBeTruthy()
        })
        it(`Pollard_Rh1 from prime number should return same number`, () => {
            expect(Pollard_Rh1(p)).toEqual(p)
        })
    })
})