let v = [30, 17, 8, 3, 1];
let b = 23,
    m = 61;
let c = [14, 25, 89, 3, 65, 24, 3, 49, 89, 24, 41, 25, 68, 41]
let alp = []
for (let i = 0; i < 26; i++)
    alp.push(String.fromCodePoint(65 + i));
// alp.push(' ');
// alp.push('?');
// alp.push('!');
// alp.push('.');
// alp.push("'");
// alp.push('$');

function modulo(a, m) {
    while (a > m) a -= m;
    return a;
}
function wtov(b, m, w) {
    let v = w.map(a => modulo(a * b % m));
    return v;
}
function fitting(a, v) {
    let e = '';
    for (let i = 0; i < v.length; i++) {
        if (v[i] <= a) { a -= v[i]; e += '1'; }
        else e += '0';
    }
    return e;
}
function strToInt(a) {
    let v = 0;
    for (let i = 0; i < a.length; i++) {
        if (a[i] == 1) v += 2 ** (a.length - i - 1);
    }
    return v;
}
function decrypt(b, m, v, c) {
    let a = modulo(b * c, m);
    let e = fitting(a, v);
    return strToInt(e);
}
function showBin(c) {
    let a = 1;
    let k = '';
    while (a + 1 < c) a << 1;
    while (a != 0) {
        if (a < c) {
            c -= a;
            a >> 1;
            k += '1';
        }
        else k += '0';
    }
    return k;
}
function showPack(b, m, v, c) {
    let a = modulo(b * c, m);
    return fitting(a, v);
}
let str = '';
console.log();
for (let i = 0; i < c.length; i++) {
    let k = decrypt(b, m, v, c[i]);
    console.log(`${c[i]} => ${modulo(c[i] * b, m)} => ${showPack(b, m, v, c[i])}`);
    str += alp[k];
}
function Miller(a, b) {
    if (n < 5) return;
}
function One(a) {
    for (let i = 0; i < a; i++)
        if (a % i == 0 && 2 ** Two(a) == a)
            return [i, Two(a)]
}
function Two(a) {
    let b = 1;
    for (let i = 0; b < a; i++) b = 1 << i;
    return i;
}
Console.log(a);

console.log(str);