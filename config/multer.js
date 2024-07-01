const multer = require('multer');
const path = require('path');

const fileTypes = {
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
    'image/png': 'png',
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let destination = 'public/uploads/';
            
        if(file.fieldname === 'gambar_gedung') {
            destination = 'public/uploads/gedung/';
        } else if(file.fieldname === 'gambar_ruangan') {
            destination = 'public/uploads/ruangan/'
        }
            
        cb(null, destination);
    },
    filename: function (req, file, cb) {
        let prefix = '';

        if(file.fieldname === 'gambar_gedung') {
            prefix = 'gedung_';
        } else if (file.fieldname === 'gambar_ruangan') {
            prefix = 'ruangan_';
        }       

        const uniqueFileName = `${prefix}${file.originalname}-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueFileName);
    }
})

const fileFilter = (req, file, cb) => {
    if (fileTypes[file.mimetype]) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});


module.exports = upload;