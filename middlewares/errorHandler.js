const { error } = require('./apiResponse');
module.exports = (err, req, res, next) => {
    if (process.env.NODE_ENV !== 'production') {
        console.error(err);
    }

    if (err.name === 'SequelizeUniqueConstraintError') {
        return error(res, 'Usuário ou e-mail já cadastrado.', 409);
    }

    if (err.name === 'SequelizeValidationError') {
        return error(res, 'Dados inválidos.', 400);
    }

    if (err.name === 'MulterError' || err.message?.includes('Apenas imagens')) {
        return error(res, err.message, 400);
    }

    const statusCode = err.status && err.status < 500 ? err.status : 500;
    const message = statusCode === 500 ? 'Ocorreu um erro inesperado.' : err.message;
    const errors = statusCode === 500 ? [] : (err.errors || []);
    return error(res, message, statusCode, errors);
};