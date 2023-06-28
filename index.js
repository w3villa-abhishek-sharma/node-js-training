require('dotenv').config();
const express = require("express");
const cors = require("cors");
const connectToMongo = require('./db');
const compression = require("compression");



// Connect with Database
connectToMongo();

const PORT = process.env.PORT || 5000;

const app = express();
// Apply compression middleware globally
app.use(compression());


// use middleware
app.use(cors());
app.use(express.json());

app.use("/api/v1",require("./routes"));

// Server Listen
app.listen(PORT ,()=>{
    console.log("Server Start.");
})