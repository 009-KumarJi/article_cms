class CustomError extends Error {
	constructor(message, statusCode = 500, params = {}) {
		super(message);
		this.statusCode = statusCode;
		this.message = message;
		this.params = params;
		this.date = new Date();

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, this.constructor);
		}
	}

	// Method to generate a detailed error response
	toResponseObject() {
		return {
			success: false,
			message: this.message,
			...(Object.keys(this.params).length && { details: this.params }),
			...(process.env.NODE_ENV === 'development' && { stack: this.stack })
		};
	}
}

export default CustomError;