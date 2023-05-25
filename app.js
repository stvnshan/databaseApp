const express = require('express');
const pool = require('./db');

const app = express();
const port = 3000;

app.get('/data',async (req, res) => {
    try{
        const{rows} = await pool.query('SELECT * FROM student');
        res.json(rows);
    }catch (error){
        console.error('Error executing query', error);
        res.status(500).json({error: 'Internal server error'});
    }
});

app.listen(port, ()=>{
    console.log(`server is running on port ${port}`);
});