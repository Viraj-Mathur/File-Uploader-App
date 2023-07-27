const mongoose= require("mongoose");

require("dotenv").config();

exports.connect = () => {
    mongoose.connect(process.env.MONGOOSE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(console.log("DataBase connection successfull"))
    .catch( (error) => {
        console.log("DataBase connection issues");
        console.error(error);
        process.exit(1);
    });
};