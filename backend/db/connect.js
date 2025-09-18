const mongoose = require('mongoose');

const connectDB =async ()=> {
    try{
        await mongoose.connect(`${process.env.db}`);
        console.log("mongoDB connected successfully!");
    }
    catch(err){
        console.log("DB connected error. ", err);
        throw err;
    }
}
module.exports = connectDB;