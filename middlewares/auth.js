const { verifyToken } = require('../config/jwt');
const { error: errorResponse } = require('./apiResponse');
const User = require('../modules/user/userModel');

const isAuthenticated = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return errorResponse(res, 'Você precisa estar autenticado para acessar este recurso.', 401);
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = verifyToken(token);
        const user = await User.findByPk(decoded.id, { attributes: ['id', 'username', 'isAdmin', 'isBlocked'] });

        if (!user || user.isBlocked) {
            return errorResponse(res, 'Usuário não autorizado.', 403);
        }

        req.user = decoded;
        req.currentUser = user;
        return next();
    } catch (err) {
        return errorResponse(res, 'Token inválido ou expirado. Faça login novamente.', 401);
    }
};

const requireAdmin = (req, res, next) => {
    if (!req.currentUser || !req.currentUser.isAdmin) {
        return errorResponse(res, 'Acesso administrativo necessário.', 403);
    }
    return next();
};

const isOwnerOrAdmin = (req, res, next) => {
    if (req.currentUser && (req.currentUser.isAdmin || req.currentUser.id === Number(req.params.id))) {
        return next();
    }
    return errorResponse(res, 'Você não pode alterar este usuário.', 403);
};

module.exports = { isAuthenticated, requireAdmin, isOwnerOrAdmin };