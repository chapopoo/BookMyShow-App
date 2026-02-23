const nodemailer = require('nodemailer');
const fs = require("fs")
const dotenv = require('dotenv')
const path = require('path')

dotenv.config();

const { SENDGRID_API_KEY } = process.env;

function replaceContent(content, creds){
    let allkeysArr = Object.keys(creds);
    allkeysArr.forEach(function(key){
        // The pattern for placeholder can be anything that you decide eg.#{}, !{} 
        // BUT make sure it's the same for html file and this file
        content = content.replace(`#{${key}}`, creds[key]);
    })

    return content;
}

async function emailHelper(templateName, receiverEmail, creds){
    try{
        const templatePath = path.join(__dirname, templateName);
        let content = await fs.promises.readFile(templatePath, "utf-8")

        const emailDetails = {
            to:receiverEmail,
            from:'poojachapole28@gmail.com',
            subject: 'Mail from ScalerShows',
            text: `Hi ${creds.name} this your reset otp ${creds.otp}`,
            html: replaceContent(content, creds),
        }

        //configuration for sendgrid(taken while creating api key)
        const transportDetails = {
            host: 'smtp.sendgrid.net',
            port: 465,
            auth: {
                user: "apikey",
                pass: SENDGRID_API_KEY
            }
        }

        //create initial req to sendgrid that i want to connet with above api key
        const transporter = nodemailer.createTransport(transportDetails);
        await transporter.sendMail(emailDetails)
        console.log("email sent")
    }
    catch(err){
        console.log(err)
    }
}

module.exports = emailHelper;
