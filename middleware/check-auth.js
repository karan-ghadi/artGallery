const jwt = require('jsonwebtoken');
const secretKey = 'PubG';

module.exports = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		const decoded = jwt.verify(token, secretKey);
		req.userData = decoded;
		next();
	}
	catch (err) {
		res.status(401).json({ error: err, message: 'Auth Failed' });
	}
 }