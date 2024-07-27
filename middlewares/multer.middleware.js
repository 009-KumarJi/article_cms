import multer from 'multer';

const multerUpload = multer({
    limits: {
        fileSize: 1024 * 1024 * 10,
    },
});

const singleMulter = multerUpload.single('file');
const multipleMulter = multerUpload.array('files', 5);

export {singleMulter, multipleMulter};