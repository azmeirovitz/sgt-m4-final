const express = require('express');
const PORT = process.env.PORT || 9000;

const app = express();

app.get('/api/test', (req, res)=> {
    
    res.send({
        message: 'Test route /api/test is working!',
        
    });
    });
    

app.listen(PORT, () => {
    console.log('The server is listening at localhost ' + PORT);
});