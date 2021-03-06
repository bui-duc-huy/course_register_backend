const { query } = require('../../helper')

async function createStudent(studentInfo) {
	const {
		SSN,
		fname,
		lname,
		gender,
		birthdate,
		email,
		student_id,
		fcode
	} = studentInfo
	await query(`
        INSERT INTO PERSON
        VALUES (
            '${SSN}', 
            '${fname.toUpperCase()}', 
            '${lname.toUpperCase()}', 
            'student',
            '${gender.toUpperCase()}',
            '${birthdate}',
            '${email}' );
    `)

	try {
		const gpa = studentInfo.gpa ? studentInfo.gpa : 'null'
		await query(`
            INSERT INTO STUDENT
            VALUES ('${student_id.toUpperCase()}', '${SSN}', ${gpa}, '${fcode.toUpperCase()}');
        `)
	} catch (err) {
		await query(`
            DELETE FROM PERSON
            WHERE SSN = '${SSN}';
        `)
		throw 'Fail to insert student'
	}
}

async function listStudentByFaculty(fcode) {
	let result = []
	if (fcode.toLowerCase().trim() == 'all')
		result = await query(`SELECT * FROM STUDENT NATURAL JOIN PERSON;`)
	else
		result = await query(
			`SELECT * FROM STUDENT NATURAL JOIN PERSON WHERE FCODE = '${fcode}'`
		)
	return result
}

async function getStudentId(ssn) {
	const result = await query(
		`SELECT STUDENT_ID FROM STUDENT WHERE SSN = '${ssn}'`
	)
	if (result[0]) return result[0].STUDENT_ID
	return null
}

async function viewTop3Semester(student_id) {
	const result = await query(`CALL VIEW_TOP3_SEMESTER('${student_id}');`)
	return result[0]
}

module.exports = {
	createStudent,
	listStudentByFaculty,
	getStudentId,
	viewTop3Semester
}
