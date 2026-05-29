import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import api from "../api/axios";
import {
    login as loginService,
    signup as signupService,
} from "../services/auth.service";

type User = {
    id: string;
    username: string;
    email: string;
};

type AuthContextType = {
    user: User | null;
    loading: boolean;

    login: (
        email: string,
        password: string
    ) => Promise<void>;

    signup: (
        username: string,
        email: string,
        password: string
    ) => Promise<void>;

    logout: () => void;
};

const AuthContext =
    createContext<AuthContextType | null>(
        null
    );

export const AuthProvider = ({
    children,
}: {
    children: ReactNode;
}) => {

    const [user, setUser] =
        useState<User | null>(null);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        const token =
            localStorage.getItem("token");

        if (!token) {
            setLoading(false);
            return;
        }

        api.defaults.headers.common[
            "Authorization"
        ] = `Bearer ${token}`;

        api.get("/user/me")
            .then((res) => {
                setUser(res.data);
            })
            .catch(() => {
                localStorage.removeItem(
                    "token"
                );
            })
            .finally(() => {
                setLoading(false);
            });

    }, []);

    const login = async (
        email: string,
        password: string
    ) => {

        const res =
            await loginService({
                email,
                password,
            });

        const token =
            res.data.token;

        localStorage.setItem(
            "token",
            token
        );

        api.defaults.headers.common[
            "Authorization"
        ] = `Bearer ${token}`;

        setUser(res.data.user);
    };

    const signup = async (
        username: string,
        email: string,
        password: string
    ) => {

        const res =
            await signupService({
                username,
                email,
                password,
            });

        const token =
            res.data.token;

        localStorage.setItem(
            "token",
            token
        );

        api.defaults.headers.common[
            "Authorization"
        ] = `Bearer ${token}`;

        setUser(res.data.user);
    };

    const logout = () => {

        localStorage.removeItem(
            "token"
        );

        delete api.defaults.headers.common[
            "Authorization"
        ];

        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                signup,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {

    const context =
        useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
};