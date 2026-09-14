const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const uploadDirectory = path.join(__dirname, '../public/uploads/profiles');
const extensionByMimeType = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp'
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory);
    },
    filename: (req, file, cb) => {
        const extension = extensionByMimeType[file.mimetype];
        cb(null, `profile-${req.user.id}-${crypto.randomUUID()}${extension}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (extensionByMimeType[file.mimetype]) {
        cb(null, true);
    } else {
        cb(new Error('Apenas imagens JPEG, PNG ou WebP são permitidas!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }
});

module.exports = upload;