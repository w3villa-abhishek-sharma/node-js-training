const mongoose = require('mongoose');

const mongoURI = "mongodb://localhost:27017/test";

const connectToMongo = () => {
    mongoose.connect(mongoURI).then(() => {
        console.log("Successfully");
    }).catch(error => console.log(error));
}

module.exports = connectToMongo;