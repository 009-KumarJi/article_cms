// features.js contains helper functions that are used in multiple places in the application
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import {jwtSecret, sessionId} from "./constants.js";
import {sout} from "./utility.js";

const cookieOptions = {
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    httpOnly: true,
    sameSite: "none",
    secure: true,
};

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

const sendToken = (res, user, code, message) => {
    const token = jwt.sign({id: user._id}, jwtSecret);
    return res
        .status(code)
        .cookie(sessionId, token, cookieOptions)
        .json({
            success: true,
            user,
            message
        });
};

const uploadFilesToCloudinary = async (files = []) => {
    sout("Uploading files to cloudinary...");
    const uploadPromises = files.map((file) => { // mapping over the files array
        return new Promise((resolve, reject) => { // creating a new promise for each file
            cloudinary.uploader.upload( // uploading the file to cloudinary
                getBase64(file), // passing the base64 data of the file
                { // options for the upload
                    resource_type: "auto",
                    public_id: uuid(),
                },
                (error, result) => { // callback function for the upload
                    if (error) return reject(error); // if there is an error, reject the promise
                    resolve(result); // if the upload is successful, resolve the promise
                });
        });
    });

    try {
        const results = await Promise.all(uploadPromises); // waiting for all the promises to resolve
        sout("Files uploaded successfully!"); // logging a success message
        return results.map((result) => { // formatting the results
            return {
                public_id: result.public_id,
                url: result.secure_url,
            };
        }); // returning the formatted results
    } catch (error) {
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


export {connectDB, sendToken, cookieOptions};