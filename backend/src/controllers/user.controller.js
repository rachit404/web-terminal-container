import prisma from "../lib/prisma.js";

export const getMe = async (
    req,
    res
) => {

    const user =
        await prisma.user.findUnique({
            where: {
                id: req.user.userId,
            },
            select: {
                id: true,
                username: true,
                email: true,
                createdAt: true,
            },
        });

    return res.json(user);
};