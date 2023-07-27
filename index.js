// app create
const express = require("express");
const app = express();


// Port find
require("dotenv").config();
const PORT = process.env.PORT || 4000;

//middleware add krne h 
app.use(express.json());
const fileupload = require("express-fileupload");
app.use(fileupload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));




// connect to db
const db = require("./config/database");
db.connect();

// connect to cloud using cloudinary package
const cloudinary = require("./config/cloudinary");
cloudinary.cloudinaryConnect();

// adding route
const Upload = require("./routes/FileUpload");
app.use('/api/v1/upload', Upload);

//activate server
app.listen(PORT, () => {
    console.log(`App is running at ${PORT}`);
})