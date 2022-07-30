const express = require('express');
const app = express();
const path = require('path');

app.use(express.static('public'));
app.use(express.json());

const connectDB = require("./config/db");
connectDB();

//Template Engine
app.set('views' , path.join(__dirname, '/views'))

//set ejs view engine
app.set('view engine' , 'ejs');

//Routes

app.use('/api/files' , require('./routes/files'));
app.use('/files' , require('./routes/show'));
app.use('/files/download' , require('./routes/download'));

const PORT = process.env.PORT || 4000;
app.listen(PORT , () =>{
    console.log(`Listning Server on port ${PORT}`);
})