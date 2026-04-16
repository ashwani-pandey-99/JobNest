import multer from "multer";

const storage = multer.memoryStorage();
export const singleUpload = multer({storage}).single("file");
export const profileUploads = multer({ storage }).fields([
    { name: "resume", maxCount: 1 },
    { name: "profilePhoto", maxCount: 1 }
]);
