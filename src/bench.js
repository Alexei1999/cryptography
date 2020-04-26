function bench(f, k) {
    let start = Date.now();
    for (let i = 0; i < 1000; i++) f(k);
    return (Date.now() - start) / 1000;
}

module.exports = { bench }