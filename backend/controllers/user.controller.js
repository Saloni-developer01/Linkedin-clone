import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import PDFDocument from "pdfkit";
import fs from "fs"; // Importing fs to handle file system operations
import ConnectionRequest from "../models/connections.model.js";



const convertUserDataToPDF = async (userData)=>{
    const doc = new PDFDocument();

    const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf"; // Generating a random file name for the PDF

    const stream = fs.createWriteStream( "uploads/" + outputPath);

    doc.pipe(stream);

    doc.image(`uploads/${userData.userId.profilePicture}`, {align: 'center', width: 100}); // Adding profile picture to the PDF
    doc.fontSize(14).text(`Name: ${userData.userId.name}`);
    doc.fontSize(14).text(`Username: ${userData.userId.username}`);
    doc.fontSize(14).text(`Email: ${userData.userId.email}`);
    doc.fontSize(14).text(`Bio: ${userData.bio || "No bio available"}`); // Adding bio if available, otherwise default text
    doc.fontSize(14).text(`Current Position: ${userData.currentPost}`);

    doc.fontSize(14).text("Past Work: ")
    userData.pastWork.forEach((work, index) => {
        doc.fontSize(14).text(`Company Name: ${work.company}`);
        doc.fontSize(14).text(`Position: ${work.position}`);
        doc.fontSize(14).text(`Years: ${work.years}`);
    });

    doc.end();

    return outputPath;
}





export const register = async (req, res) => {

    try {

        const { name, email, password, username } = req.body;

        if (!name || !email || !password || !username) {
            return res.status(400).json({
                message: "Please fill all the fields"
            });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            username
        });

        await newUser.save();


        const profile = new Profile({ userId: newUser._id });

        await profile.save();

        return res.status(201).json({
            message: "User Created Successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Please fill all the fields"
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User does not exist"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        const token = crypto.randomBytes(32).toString("hex");

        await User.updateOne({ _id: user._id }, { token  /* setting token to user*/ });

        return res.json({ token: token})

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}


export const uploadProfilePicture = async (req, res) => {
    const { token } = req.body;

    try {

        const user = await User.findOne({ token: token });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.profilePicture = req.file.filename;

        await user.save();
        return res.json({ message: "Profile picture uploaded successfully" });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}


export const updateUserProfile = async (req, res) => {

    try {

        const { token, ...newUserData } = req.body; // ...newUserData will contain the rest of the user data jitne bhi fields humnai banaye hai user.model.js mai token ko chor kar sari fields ko le lega req.body sai or token ko esliye nikal rhe hai kyuki token ko hum use nahi karna chahte update karne ke liye token update hoga to user logout ho jayega

        const user = await User.findOne({ token: token });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const { username, email } = newUserData;

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });

        if (existingUser) {

            if (existingUser || String(existingUser._id) !== String(user._id)) {
                return res.status(400).json({
                    message: "User already exists"
                });
            }
        }

        Object.assign(user, newUserData); // This will update the user with the new data
        await user.save();

        return res.json({
            message: "User updated successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}


export const getUserAndProfile = async (req, res) => {
    try {
        const { token } = req.query;

        const user = await User.findOne({ token: token });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const userProfile = await Profile.findOne({ userId: user._id }).populate("userId", "name email username profilePicture"); // Populating userId sai name, email, username, and profilePicture
        
        return res.json(userProfile);

    }catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}


export const updateProfileData = async (req, res) => {

    try {
        const { token, ...newProfileData } = req.body;

        const userProfile = await User.findOne({ token: token });
        if (!userProfile) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const profile_to_update = await Profile.findOne({ userId: userProfile._id });
        
        Object.assign(profile_to_update, newProfileData);  // jo keys same hai wo new keys ki value sai change ho jayegi or agar key same nahi hai to jo existing value thi wahi rahegi

        await profile_to_update.save();
        return res.json({
            message: "Profile updated successfully"
        });

    }catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}


export const getAllUserProfile = async (req, res) => {
    try{

        const profiles = await Profile.find().populate("userId", "name email username profilePicture");

        return res.json({profiles});

    }catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}


export const downloadProfile = async (req, res) => {

    const user_id = req.query.id;

    const userProfile = await Profile.findOne({ userId: user_id }).populate("userId", "name email username profilePicture");

    let outputPath = await convertUserDataToPDF(userProfile);

    return res.json({"message": outputPath});

}


export const sendConnectionRequest = async (req, res) => {

    const {token, connectionId} = req.body;

    try{

        const user = await User.findOne({ token});

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const connectionUser = await User.findOne({ _id: connectionId });

        if (!connectionUser) {
            return res.status(404).json({
                message: "Connection user not found"
            });
        }

        const existingRequest = await ConnectionRequest.findOne({
            userId: user._id,
            connectionId: connectionUser._id
        })

        if (existingRequest) {
            return res.status(400).json({
                message: "Connection request already sent"
            });
        }

        const request = new ConnectionRequest({
            userId: user._id,
            connectionId: connectionUser._id
        });

        await request.save();

        return res.json({
            message: "Connection request sent successfully"
        });

    }catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}



export const getMyConnectionsRequests = async (req, res) => { // maine kis kis ko request bheji haii yee yahan sai pata chalega
    // console.log("Received request body:", req.query);
    const { token } = req.query;

    try {

        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const connection = await ConnectionRequest.find({userId: user._id}).populate("connectionId", "name email username profilePicture");

        return res.json(connection);

    }catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}


export const whatAreMyConnections = async (req, res) => { // kis kis nai mujhe request bheji hai yee yahan sai pata chalega

    const { token } = req.query;

    try {

        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const connections = await ConnectionRequest.find({ connectionId: user._id }).populate("userId", "name email username profilePicture");


        return res.json(connections);


    }catch (error) {
        return res.status(500).json({message: error.message});
    }
}


export const acceptConnectionRequest = async (req, res) => {

    const { token, requestId, action_type } = req.body;

    try{

        const user = await User.findOne({ token });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const connection = await ConnectionRequest.findOne({ _id: requestId});

        if (!connection) {
            return res.status(404).json({
                message: "Connection request not found"
            });
        }

        if(action_type === "accept") {
            connection.status_accepted = true;
        }else{
            connection.status_accepted = false;
        }

        await connection.save();
        
        return res.json({message: "Connection request updated successfully"});

    }catch(error){
        return res.status(500).json({message: error.message});
    }
}



export const getUserProfileAndUserBasedOnUsername = async(req,res)=>{
    
    const {username} = req.query;

    try{

        const user = await User.findOne({
            username
        });

        if(!user){
            return res.status(404).json({message: "User not found"})
        }

        const userProfile = await Profile.findOne({userId: user._id}).populate('userId', 'name username email profilePicture');

        return res.json({"profile": userProfile})
    }catch(error){
        return res.status(500).json({message: error.message})
    }
}
