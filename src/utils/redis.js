import { promisify } from 'util';
import redisClient from "../config/redisClient.js";

const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);
const delAsync = promisify(redisClient.del).bind(redisClient);

export {
	getAsync,
	setAsync,
	delAsync
}