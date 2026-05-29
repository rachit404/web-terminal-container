import docker from "../lib/docker.js";
import prisma from "../lib/prisma.js";

export const createContainer = async (req, res) => {

        try {

            const userId =
                req.user.userId;

            const container =
                await docker.createContainer({
                    Image: "ubuntu",
                    Tty: true,
                    OpenStdin: true,
                    Cmd: ["bash"],
                });

            await container.start();

            const dbContainer =
                await prisma.container.create({
                    data: {
                        containerId: container.id,
                        name: `lab-${Date.now()}`,
                        status: "running",
                        userId,
                    },
                });

            return res.status(201).json({
                message:
                    "Container created",
                container:
                    dbContainer,
            });

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                message:
                    "Failed to create container",
            });
        }
};

export const getMyContainers = async (req, res) => {
        try {
            const userId =
                req.user.userId;

            const containers =
                await prisma.container.findMany({
                    where: {
                        userId,
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                });

            return res.json(
                containers
            );

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                message:
                    "Failed to fetch containers",
            });
        }
};