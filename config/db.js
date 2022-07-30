require('dotenv').config();
const mongoose = require('mongoose');


function connectDB(){
    //Database Connection

    mongoose.connect(process.env.MONGO_CONNECTION_URL , 
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
        ).catch(err => console.log("Connection Failed " , err));

        const connection = mongoose.connection;

        connection.once('open' , () =>{
            console.log("Database Connected.")
        })
}


module.exports = connectDB;