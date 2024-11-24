
// constants.js

import {sout} from "./utility.js";
import dotenv from "dotenv";

dotenv.config({path: "./.env"});

const envMode = process.env.NODE_ENV || "PRODUCTION";
const dbName = process.env.DB_NAME;
const dbUrl = process.env.MONGO_URI;
const clientUrl = process.env.CLIENT_URL;
const PORT = process.env.PORT;
const sessionId = "sessionId";
const avatarUrl = (gender = "male") => {
    const avatarNames = {
        male: ["Cali", "Mittens", "Boo", "Chester", "Tiger", "Jack", "Bandit", "Misty", "Patches", "Sophie"],
        female: ["Casper", "Princess", "Miss%20kitty", "Sammy", "Bear", "Zoey", "Peanut", "Bella", "Buster", "Lucky"]
    };
    if (!avatarNames[gender]) gender = "male";
    const randomName = avatarNames[gender][Math.floor(Math.random() * 10)];
    return `https://api.dicebear.com/9.x/adventurer/svg?seed=${randomName}`;
};

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const cloudApiKey = process.env.CLOUDINARY_API_KEY;
const cloudApiSecret = process.env.CLOUDINARY_API_SECRET;


const printAll = () => {
    sout({
        "EnvMode": envMode,
        "dbName": dbName,
        "dbUrl": dbUrl,
        "clientUrl": clientUrl,
        jwtSecret: {
            ACCESS: process.env.JWT_ACCESS_SECRET,
            REFRESH: process.env.JWT_REFRESH_SECRET
        },
        jwtExpiry: {
            ACCESS: process.env.JWT_ACCESS_EXPIRY,
            REFRESH: process.env.JWT_REFRESH_EXPIRY
        },
        PORT,
        sessionId
    })
}

export {
    envMode,
    dbName,
    dbUrl,
    clientUrl,
    PORT,
    sessionId,
    cloudName,
    cloudApiKey,
    cloudApiSecret,
    printAll,
    avatarUrl
};
