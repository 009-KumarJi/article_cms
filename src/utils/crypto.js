import CryptoJS from 'crypto-js';

const secretKey = process.env.ENCRYPT_SECRET;

const encrypt = (data) => {
	try {
		return CryptoJS.AES.encrypt(
			JSON.stringify(data),
			secretKey
		).toString();
	} catch (error) {
		throw new Error(`Encryption failed: ${error.message}`);
	}
};

const decrypt = (data) => {
	try {
		const bytes = CryptoJS.AES.decrypt(data, secretKey);
		return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
	} catch (error) {
		throw new Error(`Decryption failed: ${error.message}`);
	}
};

export {
	encrypt,
	decrypt
};