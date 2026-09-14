var express = require('express');
var path = require('path');
var logger = require('morgan');
var cors = require('cors');
var helmet = require('helmet');
var rateLimit = require('express-rate-limit');
require('dotenv').config();

var indexRouter = require('./routes/index');
var searchRoutes = require('./modules/search/searchRoutes')
var userRoutes = require('./modules/user/userRoutes');
var errorHandler = require('./middlewares/errorHandler')
var { csrfProtection } = require('./middlewares/csrf');

var app = express();

var allowedOrigins = (process.env.CORS_ORIGINS || process.env.CORS_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

var apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { success: false, message: 'Muitas requisições. Tente novamente mais tarde.', errors: [] }
});

app.use(logger('dev'));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Origem não permitida pelo CORS.'));
    },
    credentials: true
}));

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads'))); 

app.use('/api', apiLimiter);
app.use('/api', csrfProtection);
app.use('/api', indexRouter);
app.use('/api', searchRoutes);
app.use('/api', userRoutes)

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Rota não encontrada.',
        errors: []
    });
});

app.use(errorHandler)

module.exports = app;