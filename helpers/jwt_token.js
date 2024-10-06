const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET_KEY;
const algorithm = "HS512";

if (!SECRET_KEY) throw new Error('Missing JWT_SECRET_KEY environment variable')

const generateToken = (payload,expiresIn=null) => {
    const options = expiresIn ? { expiresIn, algorithm: algorithm } : { algorithm: algorithm };
    return jwt.sign(payload, SECRET_KEY, options);
}

const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, SECRET_KEY, { algorithms: [`${algorithm}`] });
        return { valid: true, decoded };
    } catch (error) {
        return { valid: false, error: error.message };
    }
}

module.exports = { generateToken,verifyToken }