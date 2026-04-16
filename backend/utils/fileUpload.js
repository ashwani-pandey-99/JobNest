import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export const saveFileLocally = async (file, folderName) => {
    const extension = path.extname(file.originalname || "");
    const fileName = `${randomUUID()}${extension}`;
    const uploadDir = path.join(process.cwd(), "uploads", folderName);

    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(path.join(uploadDir, fileName), file.buffer);

    return {
        fileName,
        originalName: file.originalname,
        relativePath: `/uploads/${folderName}/${fileName}`
    };
};
