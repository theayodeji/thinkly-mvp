import multer from "multer";

const storage = multer.memoryStorage();

// File size limit: 5MB
const limits = {
  fileSize: 5 * 1024 * 1024,
};

export const upload = multer({ storage, limits });
