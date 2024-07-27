// server.js

import express from "express";
import cors from "cors";
import { connectDB } from "./utils/features.js";
import { sout } from "./utils/utility.js";
import { clientUrl, dbName, dbUrl, envMode, PORT, printAll } from "./utils/constants.js";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/error.middleware.js";

// Import route handlers
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import articleRoutes from "./routes/article.routes.js";
import fileRoutes from "./routes/file.routes.js";

// CORS configuration
const corsOptions = {
    origin: clientUrl,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
};
sout("CORS Options: ", corsOptions);

// Print initial server configuration
printAll();

// Connect to the database
connectDB(dbUrl, dbName);

const app = express();

// Middleware setup
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

// Log each request route
app.use((req, res, next) => {
    sout(`Route being hit: ${req.method} ${req.path}`);
    next();
});

// Route handlers
app.use("/api/auth", authRoutes); // Authentication Endpoints
app.use("/api/users", userRoutes); // User Endpoints
app.use("/api/articles", articleRoutes); // Article Endpoints
app.use("/api/files", fileRoutes); // File Endpoints

// Error handling middleware
app.use(errorMiddleware);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running in ${envMode} mode on port ${PORT}`);
    sout("Client URL: ", clientUrl);
    sout("DB URL: ", dbUrl);
    sout("DB Name: ", dbName);
});
