const express = require('express');
const pool = require('./dbDesign');
const dotenv = require('dotenv').config();
const port = process.env.PORT || 3000;

const app = express();

/*
app.get('/data', async (req, res) => {
    try{
        //const{rows} = await pool.query();
        res.json(rows);
    }catch (error){
        console.error('Error executing query', error);
        res.status(500).json({error: 'Internal server error'});
    }
});
*/
/*
app.listen(port, ()=>{
    console.log(`server is running on port ${port}`);
});
*/