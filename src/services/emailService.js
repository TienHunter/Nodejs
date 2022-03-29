require('dotenv').config()
import nodemailer from 'nodemailer'


let sendEmail = async (recipient) => {
   console.log('check mail send: ', recipient.email);
   // Generate test SMTP service account from ethereal.email
   // Only needed if you don't have a real mail account for testing
   // let testAccount = await nodemailer.createTestAccount();

   // create reusable transporter object using the default SMTP transport

   let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
         user: process.env.EMAIL_APP, // generated ethereal user
         pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
      },
   });

   // send mail with defined transport object
   let info = await transporter.sendMail({
      from: '"hỏi dân it 👻" <tienkbtnhp@gmail.com>', // sender address
      to: recipient.email, // list of receivers
      subject: "Thông tin lịch khám bệnh", // Subject line
      html: buildEmailHTML(recipient), // html body
   });
}
let buildEmailHTML = (recipient) => {
   if (recipient.language === 'vi') {
      return (`
    <h3>Xin chào ${recipient.patientName}</h3>
    <p>Bạn cần xác nhận lại thông tin đặt lịch khám bệnh trên HDIT</p>
    <p>Thời gian khám bệnh: ${recipient.time}</p>
    <p>Tên bác sỹ: ${recipient.doctorName}</p>
    <p>Để xác nhận lại vui lòng bấm vào đường link dưới đây
    <a href=${recipient.redirectLink}>Nhấn vào đây</a>
    </p>
    `)
   }
   if (recipient.language === 'en') {
      return (`
      <h3>Hello ${recipient.patientName}</h3>
      <p>You need to confirm your appointment booking information on HDIT</p>
      <p>Medical examination time: ${recipient.time}</p>
      <p>Doctor name: ${recipient.doctorName}</p>
      <p>To confirm, please click the link below
      <a href=${recipient.redirectLink}>Click here</a>
      </p>
      `)

   }
}

module.exports = {
   sendEmail,

}