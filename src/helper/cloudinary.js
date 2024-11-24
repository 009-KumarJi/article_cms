// Description: Helper functions for cloudinary
// base64MimeType: Returns the mime type of base64 string
// helper/cloudinary.js
import {sout} from "../utils/utility.js";

export const getBase64 = (file) => {
    // sout("file: ", file)
    if (!file || !file.buffer) {
        throw new Error("Invalid file object or missing buffer property");
    }
    return `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
};