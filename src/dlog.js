BGsteps = (p, a, b) => {
    let h = Math.ceil(Math.sqrt(p))
    let bat = [...Array(h).keys()].map((s, t) => b * a ** t % p)
    let ahl = [...Array(h).keys()].map((s, l) => (a ** h) ** (l + 1) % p)
    return bat.filter(s => ahl.includes(s)).map(s => {
        let [t, l] = [bat.indexOf(s), ahl.indexOf(s) + 1]
        return h * l - t
    })
}

SilverPH = (p, a, b) => {

}

module.exports = { BGsteps }