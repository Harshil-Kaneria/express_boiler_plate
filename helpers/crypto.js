const crypto = require('crypto');

const SECRET_KEY = process.env.ENCRYPTION_SECRET_KEY;
const IV_LENGTH = 16;
const ALGORITHM = 'aes-256-cbc';

if (!SECRET_KEY || SECRET_KEY.length !== 64) {
    throw new Error('Invalid SECRET_KEY. It must be a 32-byte hex string.');
}

module.exports = (ref,type="encrypt") => {
    if (process.env.ENCRYPTION === "false" || (type !== "encrypt" && type !== "decrypt")) {
        return ref;
    }

    try {
        if (type === "encrypt") {
            const iv = crypto.randomBytes(IV_LENGTH);
            const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(SECRET_KEY, 'hex'), iv);
            let encrypted = cipher.update(JSON.stringify(ref), 'utf8', 'hex');
            encrypted += cipher.final('hex');
            return iv.toString('hex') + ':' + encrypted;
        } else if (type === "decrypt") {
            const parts = ref.split(':');
            const iv = Buffer.from(parts.shift(), 'hex');
            const encryptedTextBuffer = Buffer.from(parts.join(':'), 'hex');
            const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(SECRET_KEY, 'hex'), iv);
            let decrypted = decipher.update(encryptedTextBuffer, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            return JSON.parse(decrypted);
        }
    } catch (error) {
        console.error("Encryption/Decryption error:", error);
        return null;
    }
}