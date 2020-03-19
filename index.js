const crypto = require('crypto');
const ps = require('child_process');

module.exports.sign = function(config) {
    return Promise.resolve().then(() => {
        if (!config) {
            throw 'Bad config';
        }
        const algo = config.algo || 'sha256';
        if (!algo.startsWith('sha')) {
            throw 'Bad algo: expected sha256 or sha512';
        }
        if (!config.data instanceof Buffer) {
            throw 'Bad data: expected Buffer';
        }

        const process = ps.spawn('pkcs11-tool', [
            '--sign',
            '--signature-format', 'openssl',
            '--mechanism', 'SHA' + algo.replace('sha', '') + '-RSA-PKCS',
            '--id', config.key || '02',
            config.pin ? '--pin' : '', config.pin || '',
            config.module ? '--module' : '', config.module || ''
        ], {stdio: 'pipe'});
        const stdout = [];
        const stderr = [];
        process.stderr.on('data', data => {
            stderr.push(data);
        });
        process.stdout.on('data', data => {
            stdout.push(data);
        });
        return new Promise((resolve, reject) => {
            process.stdout.on('end', () => {
                if (stdout.length) {
                    const signature = Buffer.concat(stdout);
                    resolve(signature);
                } else {
                    reject(Buffer.concat(stderr).toString() || 'pkcs11-crypt error');
                }
            });
            // if (config.pin) {
            //     process.stdin.write(config.pin + '\n');
            // }
            process.stdin.write(config.data);
            process.stdin.end();
        }).then(signature => {
            if (!config.verifyKey) {
                return signature;
            }
            const verify = crypto.createVerify(algo);
            verify.write(config.data);
            verify.end();
            if (verify.verify(config.verifyKey, signature)) {
                return signature
            } else {
                throw 'Validation error';
            }
        });
    });
};
