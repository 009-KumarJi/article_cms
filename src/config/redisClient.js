import Redis from 'ioredis';

// Validate environment variables
if (!process.env.REDIS_HOST || !process.env.REDIS_PORT) {
	logger.error('Missing required environment variables: REDIS_HOST or REDIS_PORT');
	process.exit(1);
}

let retryCount = 0;

const redisClient = new Redis({
	host: process.env.REDIS_HOST,
	port: parseInt(process.env.REDIS_PORT),
	retryStrategy(times) {
		retryCount++;
		if (retryCount > 10) {
			console.error('Exceeded maximum retry attempts to connect to Redis');
			process.exit(1);
		}
		return Math.min(times * 50, 2000);
	},
});

export default redisClient;