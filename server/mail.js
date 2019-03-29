var  nodemailer = require("nodemailer")
const CDSMAIL    = process.env.CDSMAIL || "abarmardeatashyne@gmail.com"
const USERPASS    = process.env.USERPASS || "Qwerty*123"
const MAILSERVICE = process.env.MAILSERVICE || "gmail"
var transporter = nodemailer.createTransport({
    service: MAILSERVICE,
    auth:{
        user : CDSMAIL,
        pass : USERPASS
    }
})

module.exports = function mail(from, to, subject, html, attachments, cb){
    var mailOptions = {
        from : from,
        to : to,
        subject : subject,
        html : html,
        attachments : attachments
    };
    transporter.sendMail(mailOptions,cb)
}