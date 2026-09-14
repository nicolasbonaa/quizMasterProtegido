const crypto = require('crypto');
const { error: errorResponse, success } = require('./apiResponse');

const CSRF_COOKIE = 'csrf_token';
const unsafeMethods = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

function parseCookies(cookieHeader = '') {
    return cookieHeader.split(';').reduce((cookies, pair) => {
        const separator = pair.indexOf('=');
        if (separator === -1) return cookies;
        const key = pair.slice(0, separator).trim();
        const value = pair.slice(separator + 1).trim();
        cookies[key] = decodeURIComponent(value);
        return cookies;
    }, {});
}

function setCsrfCookie(res, token) {
    const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
    res.setHeader(
        'Set-Cookie',
        `${CSRF_COOKIE}=${encodeURIComponent(token)}; Path=/; SameSite=Strict; Max-Age=3600${secure}`
    );
}

function issueCsrfToken(req, res) {
    const token = crypto.randomBytes(32).toString('hex');
    setCsrfCookie(res, token);
    return success(res, { csrfToken: token }, 'Token CSRF gerado.');
}

function csrfProtection(req, res, next) {
    if (!unsafeMethods.has(req.method)) {
        return next();
    }

    const cookies = parseCookies(req.headers.cookie);
    const cookieToken = cookies[CSRF_COOKIE];
    const headerToken = req.get('X-CSRF-Token');

    if (!cookieToken || !headerToken || cookieToken.length !== headerToken.length ||
        !crypto.timingSafeEqual(Buffer.from(cookieToken), Buffer.from(headerToken))) {
        return errorResponse(res, 'Token CSRF ausente ou inválido.', 403);
    }

    return next();
}

module.exports = { csrfProtection, issueCsrfToken };
