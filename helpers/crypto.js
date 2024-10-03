const crypto = require('crypto');

const SECRET_KEY = process.env.ENCRYPTION_SECRET_KEY;
const IV_LENGTH = 16;
const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32; // 256 bits

if (!SECRET_KEY || SECRET_KEY.length !== 64) {
    throw new Error('Invalid SECRET_KEY. It must be a 32-byte hex string.');
}

const deriveKey = (secret, salt) => {
    return crypto.pbkdf2Sync(secret, salt, 100000, KEY_LENGTH, 'sha256');
};

const base64Encode = (data) => Buffer.from(data).toString('base64');
const base64Decode = (data) => Buffer.from(data, 'base64').toString('utf8');

module.exports = (ref, type = "encrypt") => {
    if (process.env.ENCRYPTION === "false" || (type !== "encrypt" && type !== "decrypt")) {
        return ref;
    }

    try {
        const salt = crypto.randomBytes(16).toString('hex');
        const key = deriveKey(SECRET_KEY, salt);

        if (type === "encrypt") {
            const iv = crypto.randomBytes(IV_LENGTH);
            const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
            let encrypted = cipher.update(base64Encode(base64Encode(JSON.stringify(ref))), 'utf8', 'hex');
            encrypted += cipher.final('hex');
            const tag = cipher.getAuthTag().toString('hex');

            return `${salt}:${iv.toString('hex')}:${tag}:${encrypted}`;
        } else if (type === "decrypt") {
            const [salt, ivHex, tagHex, encryptedTextHex] = ref.split(':');
            const iv = Buffer.from(ivHex, 'hex');
            const tag = Buffer.from(tagHex, 'hex');
            const encryptedTextBuffer = Buffer.from(encryptedTextHex, 'hex');
            const decipher = crypto.createDecipheriv(ALGORITHM, deriveKey(SECRET_KEY, salt), iv);
            decipher.setAuthTag(tag);
            const decrypted = decipher.update(encryptedTextBuffer, 'hex', 'utf8') + decipher.final('utf8');

            return JSON.parse(base64Decode(base64Decode(decrypted)));
        }
    } catch (error) {
        console.error("Encryption/Decryption error:", error.message);
        return null;
    }
};
