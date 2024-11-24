// features.js contains helper functions that are used in multiple places in the application
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import {jwtSecret, sessionId} from "./constants.js";
import {sout} from "./utility.js";
import {v2 as cloudinary} from 'cloudinary';
import {getBase64} from "../helper/cloudinary.js";
import {v4 as uuid} from "uuid";
import {generateAuthTokens} from "./jwt.js";



const connectDB = (uri, dbName) => {
    console.log("Attempting to connect to database...");
    mongoose.connect(uri, {
        dbName,
    })
        .then((data) => {
            console.log(`Successfully connected to the database at host: ${data.connection.host}`);
        })
        .catch((err) => {
            throw new Error(err);
        });
}

const uploadFilesToCloudinary = async (files = [], avatar = false) => {
    sout("Uploading files to cloudinary...", files);

    const uploadPromises = files.map((file) => {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload(
                getBase64(file),
                {
                    resource_type: "auto",
                    public_id: uuid(),
                },
                (error, result) => {
                    if (error) {
                        sout("Error uploading file to Cloudinary:", error);
                        return reject(error);
                    }
                    sout("File uploaded to Cloudinary:", result);
                    resolve(result);
                }
            );
        });
    });

    try {
        const results = await Promise.all(uploadPromises);
        sout("Files uploaded successfully!");
        sout("Upload results:", results);

        return results.map((result) => {
            const formattedResult = !avatar
                ? {
                    public_id: result.public_id,
                    url: result.secure_url,
                    type: result.format,
                    size: result.bytes,
                }
                : {
                    public_id: result.public_id,
                    url: result.secure_url,
                };
            sout("Formatted result:", formattedResult);
            return formattedResult;
        });
    } catch (error) {
        sout("Error during file upload process:", error);
        throw new Error("Oopsy-poopsy... Something got fused in upload process...");
    }
};

const deleteFilesFromCloudinary = async (publicIds) => {
    sout("Deleting files from cloudinary...");

    const deletePromises = publicIds.map((public_id) => {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.destroy(public_id, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            });
        });
    });

    try {
        await Promise.all(deletePromises);
        sout("Files deleted successfully!");
    } catch (error) {
        sout("An error occurred while deleting files from Cloudinary:", error);
    }
};


export {
    connectDB,
    uploadFilesToCloudinary,
    deleteFilesFromCloudinary,
    cookieOptions
};