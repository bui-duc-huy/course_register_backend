const { verifyToken } = require('../../utils')

const checkAuth = async (req, res, next, role) => {
	next()
	try {
		//	const token = req.headers.authorization.split(' ')[1]
		//	const decode = await verifyToken(token)
		//	if (role && decode.ROLE !== role) {
		//		return res.status(401).json({
		//			message: 'User dont have permission'
		//		})
		//	}
		//	req.current_user = decode
		//	next()
	} catch (error) {
		return res.status(401).json({
			message: 'Token is invalid'
		})
	}
}

const decodeUser = async (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1]
		const decode = await verifyToken(token)
		req.current_user = decode
		next()
	} catch (error) {
		return res.status(401).json({
			message: 'Token is invalid'
		})
	}
}

module.exports = {
	checkAuth,
	decodeUser
}
