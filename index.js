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


// PATCH and UPDATE
module.exports = app.patch('/api/grades/:record_pid', async (req, res, next) => {

    const { record_pid } = req.params;
        console.log(" req.params.pid: ", record_pid);

    const { course, grade, name } = req.body;
        console.log(" req.body of update: ", req.body);

    let errors = [];
    
    let counter = 0;

    try {

        const [checkStudent] = await db.query(`SELECT pid FROM grades WHERE pid = ?`, [record_pid]);

        console.log("checkStudent: ", checkStudent);
        console.log("checkStudent.length: ", checkStudent.length);
        
        if (checkStudent.length === 0) {

            console.log("req.body of Update is Undefined");

            errors.push(`No record found with an ID of: ${record_pid} `);

            res.status(404).send({
                code: 404,
                errors: errors,
                message: "Bad Patch Request"
                });

            return;
        }

        if (!course) {

        //  errors.push('No course name received');
            counter = counter + 1; 

        }

        if (!name) {

        // errors.push('No student name received');
           counter = counter + 1; 
        }

        if (!grade) {

        // errors.push('No grade received');  NOT NEEDE FOR THOSE 3
           counter = counter + 1; 
        }

        if (counter === 3) {

           errors.push("No valid fields received to update")

        res.status(400).send({
            code: 400,
            errors: errors,
            message: "Bad Patch Request"
            });

        return;
        
        }
        //} 

        
        if (grade) {
            errors = [];

            if (isNaN(grade) || grade < 0 || grade > 100) {

            errors.push( 'A grade should be a number between 0 and 100');

            res.status(422).send({
            code: 422,
            errors: errors,
            message: "Bad Patch Request"
            });

            return;           

            }
        }

        
        const [results] = await db.execute(`UPDATE grades SET course=?, grade=?, name=? WHERE pid=?`, [course, grade, name, record_pid]);

        const [studentToUpdate] = await db.query(`SELECT pid, course, grade, name, updated AS lastUpdated FROM grades WHERE pid = ?`, [record_pid]);

        res.send({
            messgae: 'Your student update was successful!',
            record: studentToUpdate            
        });

    }

    catch (error) {
        
        next(error);
    }
    

});


// DELETE a Student's Record
module.exports = app.delete('/api/grades/:record_pid', async (req, res, next) => {

    const { record_pid } = req.params;
        console.log(" req.params.pid: ", record_pid);

    let errors = [];
    
    try {

        const [checkStudentToDelete] = await db.query(`SELECT pid FROM grades WHERE pid = ?`, [record_pid]);

                
        if (checkStudentToDelete.length === 0) {

            errors.push(`No record found with an ID of: ${record_pid} `);

            res.status(404).send({
                code: 404,
                errors: errors,
                message: "Bad Delete Request"
                });

            return;
        }

        const [results] = await db.execute(`DELETE FROM grades WHERE pid=?`, [record_pid]);

        

        res.send({
            messgae: `Successfully deleted grade record: ${record_pid}`,
            deletedPid: record_pid            
        });

    }

    catch (error) {
        
        next(error);
    }
    

});



app.listen(PORT, () => {
    console.log('The server is listening at localhost ' + PORT);
});
