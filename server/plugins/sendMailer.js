require('dotenv').config();
const nodemailer = require('nodemailer');

const { NODEMAILER_USER, 
        NODEMAILER_PASS } = process.env;

const transPorter = nodemailer.createTransport({
    service : "Naver",
    host : "smtp.naver.com",
    port : 587,
    secure : false,
    auth : {
        user : NODEMAILER_USER,
        pass : NODEMAILER_PASS
    },
});

function sendMailer() {
    let instance = null;
    return {
        getInstance : function() {
            console.log(instance);
            if (instance == null) {
                instance = async (from, to, subject, html) => {
                    console.log(to, subject, html);
                    const info = await transPorter.sendMail({
                        from : `${from} <${NODEMAILER_USER}>`,
                        to,
                        subject,
                        html,
                    });
                    console.log("sendMailer info :", info);
                    return info;
                }
            }
            return instance;
        }
    }
}
module.exports = sendMailer().getInstance();