import db from "../models/index";
import emailService from "./emailService"
import { v4 as uuidv4 } from 'uuid';
require('dotenv').config()


let buildURLVerifyEmail = (doctorId, token) => {
   let result = `${process.env.URL_REACT}/verify-booking?doctorId=${doctorId}&token=${token}`
   return result;
}
// create or find account patient from db
let postBookingAppointment = (data) => {
   return new Promise(async (resolve, reject) => {
      if (!data.email || !data.doctorId || !data.date || !data.timeType
         || !data.firstName || !data.lastName ||
         !data.address || !data.phoneNumber || !data.gender ||
         !data.doctorName || !data.bookingTime || !data.language
      ) {
         resolve({
            errCode: 1,
            errMessage: 'Missing required parameter'
         })
      } else {

         let token = uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
         await emailService.sendEmail({
            language: data.language,
            email: data.email,
            patientName: data.patientName,
            time: data.bookingTime,
            doctorName: data.doctorName,
            redirectLink: buildURLVerifyEmail(data.doctorId, token)
         })
         let user = await db.User.findOrCreate({
            where: { email: data.email },
            defaults: {
               email: data.email,
               firstName: data.firstName,
               lastName: data.lastName,
               address: data.address,
               phoneNumber: data.phoneNumber,
               gender: data.gender,
               roleId: 'R3'
            },
         })
         // console.log('check find or create : ', user);
         if (user && user[0]) {
            await db.Booking.findOrCreate({
               where: { patientId: user[0].id },
               defaults: {
                  statusId: 'S1',
                  doctorId: data.doctorId,
                  patientId: user[0].id,
                  date: data.date,
                  token: token,
                  timeType: data.timeType,
               }
            })
         }
         resolve({
            errCode: 0,
            message: 'Save infro patient success'
         })
      }
   })
}

let postVerifyBookingAppointment = (data) => {
   return new Promise(async (resolve, reject) => {
      try {
         if (!data.doctorId || !data.token) {
            resolve({
               errCode: 1,
               errMessage: 'Missing required parameter'
            })
         } else {
            let appointment = await db.Booking.findOne({
               where: {
                  doctorId: data.doctorId,
                  token: data.token,
                  statusId: 'S1'
               },
               raw: false
            })
            if (appointment) {
               appointment.statusId = 'S2';
               await appointment.save();
               resolve({
                  errCode: 0,
                  message: 'Update booking appointment success'
               })
            } else {
               resolve({
                  errCode: 2,
                  errMessage: 'The appointment has been accepted or does not exist'
               })
            }
         }
      } catch (error) {
         reject(error)
      }
   })
}

module.exports = {
   postBookingAppointment: postBookingAppointment,
   postVerifyBookingAppointment: postVerifyBookingAppointment
}