import axios from "axios";

export const BASE_URL = "https://linkedin-clone-backend-o37d.onrender.com/"

export const clientServer = axios.create({
    baseURL: BASE_URL,
});