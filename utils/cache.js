import { redisConnect } from "./redis";

export const fetchCache = async (key, fetchData, expiresIn) => {
    const cachedData = await getKey(key);
    if (cachedData)return cachedData
    return setValue(key, fetchData, expiresIn);
}

const getKey = async (key) => {
    const result = await redisConnect.get(key);
    if (result) return JSON.parse(result);
    return null;
}

const setValue = async (key, fetchData, expiresIn) => {
    const setValue = await fetchData();
    await redisConnect.set(key, JSON.stringify(setValue), "EX", expiresIn);
    return setValue;
}