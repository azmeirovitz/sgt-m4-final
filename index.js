const db = require('./db');
const express = require('express');
const PORT = process.env.PORT || 9000;

const app = express();

app.use(express.json());

module.exports = app.get('/api/test', async (req, res)=> {

    // module.exports = async (req, res) => {
    const [studentInfo] = await db.query(`SELECT * FROM grades`);

    console.log('studentInfo: ', studentInfo);

    const results = studentInfo.map(item => {
        const {id, pid, course, grade, name, created, updated} = item;

        return {
            //item //{
                     id: id,
                     pid: pid,
                     course: course,
                     grade: grade,
                     name:name,
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
        const {pid, course, grade, name, lastUpdated} = item;

        return {
            //item //{
                     pid: pid,
                     course: course,
                     grade: grade,
                     name:name,
                     updated: lastUpdated
                 //}
            }

        });

    res.send({
        message: 'Test route /api/grades is working!',
        results: results
        
    });

});
    

app.listen(PORT, () => {
    console.log('The server is listening at localhost ' + PORT);
});