import db from "../models/index";
require('dotenv').config()

// create or find account patient from db
let postBookingAppointment = (data) => {
   return new Promise(async (resolve, reject) => {
      if (!data.email || !data.doctorId || !data.date || !data.timeType
         || !data.firstName || !data.lastName || !data.address || !data.phoneNumber || !data.gender
      ) {
         resolve({
            errCode: 1,
            errMessage: 'Missing required parameter'
         })
      } else {
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
         console.log('check find or create : ', user);
         if (user && user[0]) {
            await db.Booking.findOrCreate({
               where: { patientId: user[0].id },
               defaults: {
                  statusId: 'S1',
                  doctorId: data.doctorId,
                  patientId: user[0].id,
                  date: data.date,
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

module.exports = {
   postBookingAppointment: postBookingAppointment
}