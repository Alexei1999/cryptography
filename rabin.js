const { ElGamal, generateAsync } = require('./src/oneway.js');

(async () => {
    console.time('example');
    const eg = await generateAsync();

    const secret = 'The quick brown fox jumps over the lazy dog';
    const encrypted = await eg.encryptAsync(secret);
    const decrypted = await eg.decryptAsync(encrypted);

    console.log(decrypted.toString() === secret);

    console.timeEnd('example');
})()