# PKCS #11 Smartcard Sign

This module allows you to sign anything with a private key stored on PKCS #11 smartcard.  
For example, you can upload your key to YubiKey and generate signatures.

## How it works

It's using [`pkcs11-tool`](https://github.com/OpenSC/OpenSC/wiki/Using-pkcs11-tool-and-OpenSSL) 
from OpenSC to process signatures. If it's not installed, you will get an error. 

## Example

```javascript
const signer = require('pkcs11-smartcard-sign');

// Basic usage:
//  - SHA-256
//  - Read key with ID 02
//  - Prompt for PIN
signer.sign({
    data: Buffer.from('something')
}).then(signature => {
    console.log(signature.toString('hex'));
}).catch(err => {
    console.error(err);
});

// Advanced options
signer.sign({
    data,
    // predefined PIN
    pin: '0000',
    // ID of the key to use (on the smart card)
    key: '03',
    // algo: sha256 or sha512
    algo: 'sha512',
    // select N-th smart card reader configured by the system
    reader: 2,
    // verify with this public key after sign
    verifyKey: fs.readFileSync('your-public-key.pem'),
    // module to use
    module: '/usr/local/lib/libykcs11.1.dylib'
});
```
