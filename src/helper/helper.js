const cookieOptions = {
	maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
	httpOnly: true,
	sameSite: "none",
	secure: true,
};

export {
	cookieOptions
}