const express = require('express')
const { authMiddleWare } = require('../middlewares')
const router = express.Router()
const {
	insertClass,
	listClass,
	viewClassAndDocument,
	viewClassByStudent,
	viewClassByTeacher,
	viewClass,
	viewClassInSemester,
	viewClassOfCourse,
	sumClassInstructor,
	top5Class,
	top5SemesterHighClass,
	getDetailClass
} = require('./service/class')

router.post(
	'/insert_class',
	(req, res, next) => authMiddleWare.checkAuth(req, res, next, 'FACULTY'),
	async (req, res, next) => {
		try {
			const result = await insertClass(req.body)
			return res.status(200).json({ result })
		} catch (err) {
			return res.status(500).json({ message: err })
		}
	}
)

router.post(
	'/list_class',
	(req, res, next) => authMiddleWare.decodeUser(),
	async (req, res, next) => {
		try {
			const { id, semester } = req.body
			let result
			if (current_user.ROLE == 'TEACHER') {
				result = await viewClassByTeacher(id, semester)
			} else if (current_user.ROLE == 'STUDENT') {
				result = await viewClassByStudent(id, semester)
			} else {
				result = await viewClass()
			}
			return res.status(200).json(result)
		} catch (err) {
			return res.status(500).json({ message: err })
		}
	}
)

router.post(
	'/view_class',
	// (req, res, next) => authMiddleWare.decodeUser(),
	async (req, res, next) => {
		try {
			// Muốn định danh cho class, phải có thêm course_id
			const { course_id, class_id } = req.body
			return res.status(200).json(await getDetailClass(course_id, class_id))
		} catch (err) {
			return res.status(500).json({ message: err })
		}
	}
)

router.post(
	'/view_class_by_student',
	(req, res, next) => authMiddleWare.checkAuth(req, res, next, 'AAO_STAFF'),
	async (req, res, next) => {
		try {
			return res
				.status(200)
				.json(await viewClassByStudent(req.body.student_id, req.body.semester))
		} catch (err) {
			return res.status(500).json({ message: err })
		}
	}
)

router.post(
	'/view_class_by_teacher',
	(req, res, next) => authMiddleWare.checkAuth(req, res, next, 'AAO_STAFF'),
	async (req, res, next) => {
		try {
			return res
				.status(200)
				.json(
					await viewClassByTeacher(req.body.instructor_id, req.body.semester)
				)
		} catch (err) {
			return res.status(500).json({ message: err })
		}
	}
)

router.post(
	'/view_class_and_document',
	(req, res, next) => authMiddleWare.checkAuth(req, res, next, 'STUDENT'),
	async (req, res, next) => {
		try {
			return res
				.status(200)
				.json(
					await viewClassAndDocument(req.body.student_id, req.body.semester)
				)
		} catch (err) {
			return res.status(500).json({ message: err })
		}
	}
)

router.post(
	'/view_class_of_course',
	(req, res, next) => authMiddleWare.checkAuth(req, res, next, 'STUDENT'),
	async (req, res, next) => {
		try {
			return res
				.status(200)
				.json(await viewClassOfCourse(req.body.student_id, req.body.semester))
		} catch (err) {
			return res.status(500).json({ message: err })
		}
	}
)

router.post(
	'/sum_class_of_instructor',
	(req, res, next) => authMiddleWare.checkAuth(req, res, next, 'INSTRUCTOR'),
	async (req, res, next) => {
		try {
			return res
				.status(200)
				.json(
					await sumClassInstructor(req.body.instructor_id, req.body.semester)
				)
		} catch (err) {
			return res.status(500).json({ message: err })
		}
	}
)

router.post(
	'/top_5_class',
	(req, res, next) => authMiddleWare.checkAuth(req, res, next, 'INSTRUCTOR'),
	async (req, res, next) => {
		try {
			return res.status(200).json(await top5Class(req.body.instructor_id))
		} catch (err) {
			return res.status(500).json({ message: err })
		}
	}
)

router.post(
	'/top_5_semeter_high_class',
	(req, res, next) => authMiddleWare.checkAuth(req, res, next, 'INSTRUCTOR'),
	async (req, res, next) => {
		try {
			return res
				.status(200)
				.json(await top5SemesterHighClass(req.body.instructor_id))
		} catch (err) {
			return res.status(500).json({ message: err })
		}
	}
)

module.exports = router
