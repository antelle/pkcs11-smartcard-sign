const fs = require('fs');
const signer = require('./index');

const data = Buffer.from('something');
const start = Date.now();

signer.sign({
    data,
    verifyKey: fs.readFileSync('keys/public-key.pem'),
    key: '05',
    module: '/usr/local/lib/libykcs11.1.dylib',
    pin: '123456'
}).then(signature => {
    console.log(signature.toString('hex'));
    console.log(signature.toString('hex') === signWithNode() ? 'OK' : 'ERROR', (Date.now() - start) + 'ms');
}).catch(err => {
    console.error(err);
});

function signWithNode() {
    const privateKey = fs.readFileSync('keys/private-key.pem');
    const sign = require('crypto').createSign('RSA-SHA256');
    sign.write(data);
    sign.end();
    return sign.sign(privateKey).toString('hex');
}
