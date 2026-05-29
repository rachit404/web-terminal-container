import bcrypt from "bcryptjs";

import prisma from "../lib/prisma.js";
import { generateToken } from "../lib/jwt.js";

export const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { username },
                ],
            },
        });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists",
            });
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });

        const token = generateToken(user.id);

        return res.status(201).json({
            message: "Signup successful",
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            },
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};