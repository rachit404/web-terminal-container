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

export const getContainerDetails = async (req, res) => {

        try {

            const userId =
                req.user.userId;

            const containerId =
                req.params.id;

            const dbContainer =
                await prisma.container.findFirst({
                    where: {
                        id: containerId,
                        userId,
                    },
                });

            if (!dbContainer) {
                return res.status(404).json({
                    message:
                        "Container not found",
                });
            }

            const container =
                docker.getContainer(
                    dbContainer.containerId
                );

            const inspect =
                await container.inspect();

            const actualStatus =
                inspect.State.Running
                    ? "running"
                    : "stopped";

            if (
                actualStatus !==
                dbContainer.status
            ) {

                await prisma.container.update({
                    where: {
                        id: dbContainer.id,
                    },
                    data: {
                        status:
                            actualStatus,
                    },
                });

                dbContainer.status =
                    actualStatus;
            }

            return res.json({
                ...dbContainer,
                dockerState:
                    inspect.State,
            });

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                message:
                    "Failed to inspect container",
            });
        }
};

export const startContainer = async (req, res) => {

        try {

            const userId =
                req.user.userId;

            const containerId =
                req.params.id;

            const dbContainer =
                await prisma.container.findFirst({
                    where: {
                        id: containerId,
                        userId,
                    },
                });

            if (!dbContainer) {
                return res.status(404).json({
                    message:
                        "Container not found",
                });
            }

            const container =
                docker.getContainer(
                    dbContainer.containerId
                );

            await container.start();

            await prisma.container.update({
                where: {
                    id: dbContainer.id,
                },
                data: {
                    status: "running",
                },
            });

            return res.json({
                message:
                    "Container started",
            });

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                message:
                    "Failed to start container",
            });
        }
};

export const stopContainer = async (req, res) => {

        try {

            const userId =
                req.user.userId;

            const containerId =
                req.params.id;

            const dbContainer =
                await prisma.container.findFirst({
                    where: {
                        id: containerId,
                        userId,
                    },
                });

            if (!dbContainer) {
                return res.status(404).json({
                    message:
                        "Container not found",
                });
            }

            const container =
                docker.getContainer(
                    dbContainer.containerId
                );

            await container.stop();

            await prisma.container.update({
                where: {
                    id: dbContainer.id,
                },
                data: {
                    status: "stopped",
                },
            });

            return res.json({
                message:
                    "Container stopped",
            });

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                message:
                    "Failed to stop container",
            });
        }
};