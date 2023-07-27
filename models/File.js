const mongoose = require('mongoose');
const nodemailer = require("nodemailer"); //INSTANCE FOR NODE MAILER

const fileSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    imageUrl:{
        type:String,
    },
    tags:{
        type:String,
    },
    email:{
        type:String,
    },

});


// TO GET MAIL FROM NODE USE NODEMAILER
// DOCUMANTATION FOR SYNTAX -> https://nodemailer.com/about/

 
// POST MIDDLEWARE
fileSchema.post("save", async function(doc) {
    try{
        console.log("DOC", doc)

        // transporter
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,

            },
        });

        // send email
        let info = await transporter.sendMail({
            from:`IMF - Ethan Hunt`,
            to: doc.email,
            subject: "Your mission, should you choose to accept it...",
            html: `<h2>Dear IMF AGENT, </h2> <h3>YOUR MISSION </h3> <p> View here: <a href="${doc.imageUrl}">${doc.imageUrl}</a> </p> <p>SELF DESTRUCT in 30 seconds....  </p>`,
        })

        console.log("INFO -> ", info);

    }
    catch(err){
            console.error(err);
    }
})

const File = mongoose.model("File", fileSchema);
module.exports = File;