import api from "../api/axios";

export const signup = async (data: {
    username: string;
    email: string;
    password: string;
}) => {
    return api.post("/auth/signup", data);
};

export const login = async (data: {
    email: string;
    password: string;
}) => {
    return api.post("/auth/login", data);
};

export const getMe = async () => {
    return api.get("/user/me");
};