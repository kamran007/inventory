const multer = require('multer');
const path = require('path');

const UPLOADS_FOLDER = path.resolve(__dirname, '../../src/uploads');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_FOLDER);
    },
    filename: (req, file, cb) => {
        const fileExt = path.extname(file.originalname);
        const filename = `${file.originalname.replace(fileExt, '').toLocaleLowerCase().split(' ').join('-')}-${Date.now()}`;
        const imageName = filename + fileExt;
        cb(null, imageName);
    },
});
const upload = multer({
    storage,
    limits: {
        fileSize: 1000000,
    },
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype === 'image/png' ||
            file.mimetype === 'image/jpg' ||
            file.mimetype === 'image/jpeg'
        ) {
            cb(null, true);
        } else {
            cb(new Error('Only .jpg, .png, .jpeg format allowed!'));
        }
    },
});
module.exports = upload;