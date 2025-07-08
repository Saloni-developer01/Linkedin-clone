import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import postsRoutes from "./routes/posts.routes.js";
import userRoutes from "./routes/user.routes.js";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // esko routes kai uper rakhna zaruri hai taki register karte time request body ko parse kar sake undefined na ho req.body
app.use(express.urlencoded());
app.use(postsRoutes);
app.use(userRoutes);
app.use(express.static("uploads")); // This will serve the files in the uploads folder
// This will allow us to access the files in the uploads folder using the URL http://localhost:9090/filename


const start = async () => {

    const connectDB = await mongoose.connect("mongodb+srv://LinkedinClone:LinkedinClone124@linkedinclonecluster.rccowgh.mongodb.net/?retryWrites=true&w=majority&appName=LinkedinCloneCluster");

    app.listen(9090, () => {
        console.log("Server is running on port 9090");
    })
}

start();
