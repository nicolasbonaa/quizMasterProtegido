const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET precisa estar definido no ambiente.');
}

function generateToken(payload) {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
        issuer: 'quizmaster-api'
    });
}

function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET, { issuer: 'quizmaster-api' });
}

module.exports = { generateToken, verifyToken };