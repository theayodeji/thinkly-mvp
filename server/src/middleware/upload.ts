import multer from "multer";
import { getMaxUploadSizeBytes } from "@thinkly/shared";

const storage = multer.memoryStorage();

// File size limit: Dynamic (Default 5MB)
export const upload = multer({
  storage,
  limits: {
    get fileSize() {
      return getMaxUploadSizeBytes();
    },
  },
});
