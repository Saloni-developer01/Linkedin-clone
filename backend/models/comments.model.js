import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    userId: { // This is the user who made the comment
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    postId: { // This is the post on which the comment was made
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
    },
    body:{
        type: String,
        required: true,
    }
});

const Comment = mongoose.model("Comment", CommentSchema);
export default Comment;