import mongoose from "mongoose";

const ConnectionSchema = new mongoose.Schema({
    userId:{ /// This is the user who sent the connection request (kisne bheji hai)
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    connectionId:{ /// This is the user who received the connection request (kis ke pass aayi hai)
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    status_accepted:{
        type: Boolean,
        default: null,
    },
});


const ConnectionRequest = mongoose.model("ConnectionRequest", ConnectionSchema);
export default ConnectionRequest;