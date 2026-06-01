import api from "../api/axios";


export const getMyContainers = async () => {
    return api.get("/container/my");
};

export const createContainer = async () => {
    return api.post("/container/create");
};

export const startContainer = async (
    containerId: string
) => {
    return api.post(
        `/container/${containerId}/start`
    );
};

export const stopContainer = async (
    containerId: string
) => {
    return api.post(
        `/container/${containerId}/stop`
    );
};

