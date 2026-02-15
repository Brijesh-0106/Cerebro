import multer from "multer";


export const upload = multer({
    storage: multer.memoryStorage()
});

// import cloudinary from "./cloudinaryStore";
import cloudinary from "./cloudinaryStore.js";
export const uploadImage = (fileBuffer: Buffer): Promise<string> => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: "cerebro" },
            (error, result) => {
                if (error) return reject(error);
                resolve(result!.secure_url);
            }
        );

        stream.end(fileBuffer);
    });
};

