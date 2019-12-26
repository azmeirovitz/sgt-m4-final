const db = require('./db');
const express = require('express');
const PORT = process.env.PORT || 9000;

const app = express();

app.use(express.json());

module.exports = app.get('/api/test', async (req, res) => {

    // module.exports = async (req, res) => {
    const [studentInfo] = await db.query(`SELECT * FROM grades`);

    console.log('studentInfo: ', studentInfo);

    const results = studentInfo.map(item => {
        const { id, pid, course, grade, name, created, updated } = item;

        return {
            //item //{
            id: id,
            pid: pid,
            course: course,
            grade: grade,
            name: name,
            created: created,
            updated: updated
            //}
        }
    });

    // }

    res.send({
        message: 'Test route /api/test is working!',
        results: results

    });

});

module.exports = app.get('/api/grades', async (req, res) => {

    const [studentGrade] = await db.execute(`SELECT pid, course, grade, name, updated AS lastUpdated FROM grades`);

    console.log('studentGrade: ', studentGrade);

    const results = studentGrade.map(item => {
        const { pid, course, grade, name, lastUpdated } = item;

        return {
            //item //{
            pid: pid,
            course: course,
            grade: grade,
            name: name,
            updated: lastUpdated
            //}
        }

    });

    res.send({
        message: 'Test route /api/grades is working!',
        results: results

    });

});

module.exports = app.post('/api/grades', async (req, res, next) => {

    // console.log(" req.body: ", req.body)

    let errors = [];

    try {
        
        const { course, grade, name } = req.body;

        if (!course) {
            errors.push('No course name received');
        }

        if (!name) {
            errors.push('No student name received');
        }

        if (!grade) {
            errors.push('No grade received');
        } 

         if (isNaN(grade)) {
            errors.push( 'A grade should be a number');

        } else if (grade < 0 || grade > 100) {
            errors.push('A grade should be a number between 0 and 100');

        }
        

        if (errors.length) {

            res.status(422).send({
                code: 422,
                errors,
                message: "Bad Post Request"
            });

            return;

        }

        const [results] = await db.execute(`INSERT INTO grades (pid, course, grade, name) VALUES (UUID(), ?, ?, ?)`, [course, grade, name]);

        const [studentData] = await db.query(`SELECT pid, course, grade, name, updated AS lastUpdated FROM grades WHERE course = ? AND grade = ? AND name = ?`, [course, grade, name]);


        res.send({
            messgae: 'Inserting a new student works!',
            record: studentData
            
        });

    }

    catch (error) {
        next(error);
    }


});


app.listen(PORT, () => {
    console.log('The server is listening at localhost ' + PORT);
});
