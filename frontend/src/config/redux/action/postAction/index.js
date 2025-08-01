import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const getAllPosts = createAsyncThunk(
    "post/getAllPosts",
    async (_, thunkAPI) => {
        try {

            const response = await clientServer.get("/posts")

            return thunkAPI.fulfillWithValue(response.data)

        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)


export const createPost = createAsyncThunk(
    "post/createPost",
    async (userData, thunkAPI) => {
        const { file, body } = userData;

        try {

            const formData = new FormData();
            formData.append('token', localStorage.getItem("token"))
            formData.append('body', body)
            formData.append('media', file)

            const response = await clientServer.post("/post", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                return thunkAPI.fulfillWithValue("Post Uploaded")
            } else {
                return thunkAPI.rejectWithValue("Post Not Uploaded")
            }

        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)


export const deletePost = createAsyncThunk(
    "post/deletePost",
    async (post_id, thunkAPI) => {
        try {

            const response = await clientServer.delete("/delete_post", { // "/delete_post" routes comes from posts.routes.js
                data: {
                    token: localStorage.getItem("token"),
                    post_id: post_id.post_id
                }
            });

            return thunkAPI.fulfillWithValue(response.data);

        } catch (error) {
            return thunkAPI.rejectWithValue("Something went wrong!")
        }
    }
)


export const incrementPostLike = createAsyncThunk(
    "post/incrementLike",
    async (post, thunkAPI) => {
        try {

            const response = await clientServer.post(`/increment_post_like`, {
                post_id: post.post_id
            })

            return thunkAPI.fulfillWithValue(response.data)

        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
)


export const getAllComments = createAsyncThunk(
    "post/getAllComments",
    async(postData, thunkAPI) => {
        try {
            
            const response = await clientServer("/get_comments", {
                params: {
                    post_id: postData.post_id // post_id posts.controller.js mai get_comments_by_post ess function mai jo post_id req.query sai lai rhe hai wahan sai aa rha hai
                }
            });

            return thunkAPI.fulfillWithValue({
                comments: response.data,
                post_id: postData.post_id // ye post_id postReducer mai addCase mai use kiya gya hai getAllComments wale case mai
            })

        } catch (error) {
            return thunkAPI.rejectWithValue("Something went wrong!");            
        }
    }
)


export const postComment = createAsyncThunk(
    "post/postComment", 
    async(commentData, thunkAPI) => {
        try {
            console.log({
                post_id: commentData.post_id,
                body: commentData.body
            })

            const response = await clientServer.post("/comment", {
                token: localStorage.getItem("token"), // token:, post_id:, commentBody: coming from posts.controller.js from inside commentPost function
                post_id: commentData.post_id,
                commentBody: commentData.body
            });

            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue("Something went wrong!")
        }
    }
)