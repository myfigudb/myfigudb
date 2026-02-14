import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';

const file_filter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowed_mimetypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    if (allowed_mimetypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, WEBP and GIF are allowed.'));
    }
};

export const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: file_filter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});