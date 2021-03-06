const { query } = require('../../helper')

async function insertCourse(param) {
	const { course_id, course_name, credit, fcode } = param
	const result = await query(`
        INSERT INTO COURSE
        VALUES ('${course_id.toUpperCase()}', 
                '${course_name.toUpperCase()}', 
                 ${credit}, 
                '${fcode.toUpperCase()}')`)
	return result
}

async function listAllCourse(fcode) {
	const result = await query(`
		SELECT * FROM COURSE WHERE FCODE = '${fcode}'
	`)
	return result
}

async function listCourse(semester) {
	const result = await query(`
        SELECT *
        FROM COURSE
        WHERE COURSE_ID IN (
            SELECT DISTINCT COURSE_ID 
            FROM CLASS
            WHERE YEAR_SEMESTER = '${semester}');
    `)
	return result
}

async function listCourseRegistered(student_id, semester) {
	const result = {}
	result.listCourseRegistered = await query(`
        SELECT *
        FROM REGISTER NATURAL JOIN COURSE
        WHERE SEMESTER = '${semester}' AND STUDENT_ID = '${student_id}';
    `)
	result.totalCredit = (
		await viewTotalCredit(student_id, semester)
	)[0].TOTAL_CREDIT
	return result
}

async function registerCourse(course_id, student_id, semester) {
	const result = await query(
		`CALL REGISTER_COURSE('${course_id}', '${student_id}', '${semester}');`
	)
	console.log(result)
	return result[0]
}

async function viewCourses(course_id) {
	const result = await query(
		`SELECT * FROM COURSE WHERE COURSE_ID = '${course_id}'');`
	)
	return result
}

async function viewTotalCredit(student_id, semester) {
	const result = await query(
		`CALL VIEW_TOTAL_CREDIT('${student_id}', '${semester}');`
	)
	return result[0]
}

async function viewTotalCourseRegisted(student_id, semester) {
	const result = await query(
		`CALL VIEW_TOTAL_COURSE_REGISTED('${student_id}', '${semester}');`
	)
	return result[0]
}

async function viewCourseDocument(staff_id, year_semester, class_id) {
	const result = await query(
		`CALL VIEW_COURSE_DOCUMENT('${staff_id}', '${year_semester}', '${class_id}');`
	)
	return result[0]
}

async function viewSumStudent(staff_id, year_semester, class_id) {
	const result = await query(
		`CALL VIEW_SUM_STUDENT('${staff_id}', '${year_semester}', '${class_id}');`
	)
	return result[0]
}

async function courseInSemester(semester, faculty) {
	const result = await query(
		`CALL COURSE_IN_SEMESTER('${semester}', '${faculty}');`
	)
	return result[0]
}

async function listClassOfCourse(course_id, semester) {
	const result = {}
	result.listClass = await query(
		`SELECT * FROM CLASS WHERE COURSE_ID = '${course_id}' AND YEAR_SEMESTER = '${semester}'`
	)
	result.totalStudent = (
		await query(`
		SELECT COUNT(STUDENT_ID) COUNT_STUDENT
		FROM REGISTER
		WHERE COURSE_ID = '${course_id}' AND SEMESTER = '${semester}'
	`)
	)[0].COUNT_STUDENT
	return result
}

module.exports = {
	insertCourse,
	listCourse,
	listAllCourse,
	listCourseRegistered,
	registerCourse,
	viewCourses,
	viewTotalCredit,
	viewTotalCourseRegisted,
	viewCourseDocument,
	viewSumStudent,
	courseInSemester,
	listClassOfCourse
}
