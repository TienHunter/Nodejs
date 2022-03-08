import db from "../models/index";
require('dotenv').config()

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE

let getTopDoctorHome = (limit) => {
   return new Promise(async (resolve, reject) => {
      try {
         let doctors = await db.User.findAll({
            limit: limit,
            where: { roleId: 'R2' },
            order: [['createdAt', 'DESC']],
            attributes: {
               exclude: ['password']
            },
            include: [
               { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
               { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
            ],
            raw: true,
            nest: true
         })
         resolve({
            errCode: 0,
            data: doctors
         })
      } catch (e) {
         reject(e)
      }
   })
}

let getAllDoctors = () => {
   return new Promise(async (resolve, reject) => {
      try {
         let doctors = await db.User.findAll({
            where: { roleId: 'R2' },
            attributes: {
               exclude: ['password', 'image']
            },
            include: [
               { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
               { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
            ],
            raw: true,
            nest: true
         })
         resolve({
            errCode: 0,
            data: doctors
         })
      } catch (e) {
         reject(e)
      }
   })
}

let saveDetailInforDoctor = (inputData) => {
   return new Promise(async (resolve, reject) => {
      try {
         if (!inputData.doctorId || !inputData.contentHTML || !inputData.contentMarkdown || !inputData.description) {
            resolve({
               errCode: 1,
               errMessage: 'Missing required parameter'
            })
         } else {
            if (inputData.action === 'CREATE') {
               await db.Markdown.create({
                  contentHTML: inputData.contentHTML,
                  contentMarkdown: inputData.contentMarkdown,
                  description: inputData.description,
                  doctorId: inputData.doctorId
               });
               resolve({
                  errCode: 0,
                  message: 'Create infor doctor success'
               })
            } else if (inputData.action === 'UPDATE') {
               let doctorMarkdown = await db.Markdown.findOne({
                  where: { doctorId: inputData.doctorId },
                  raw: false
               })
               if (doctorMarkdown) {
                  doctorMarkdown.contentHTML = inputData.contentHTML;
                  doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
                  doctorMarkdown.description = inputData.description;
                  await doctorMarkdown.save();
                  resolve({
                     errCode: 0,
                     message: 'update infor doctor success'
                  })
               } else {
                  resolve({
                     errCode: 1,
                     errMessage: `Don't find infor doctor to update`
                  })
               }

            }
         }
      } catch (e) {
         reject(e)
      }
   })
}
let getDetailDoctorById = (id) => {
   return new Promise(async (resolve, reject) => {
      try {
         if (!id) {
            resolve({
               errCode: 1,
               errMessage: 'Missing required parameter'
            })
         } else {
            let data = await db.User.findOne({
               where: { id: id },
               attributes: {
                  exclude: ['password']
               },
               include: [
                  {
                     model: db.Markdown,
                     attributes: ['contentHTML', 'contentMarkdown', 'description']
                  },
                  {
                     model: db.Allcode,
                     as: 'positionData',
                     attributes: ['valueEn', 'valueVi']
                  },

               ],
               raw: false,
               nest: true
            })
            if (data && data.image) {
               data.image = new Buffer(data.image, 'base64').toString('binary');
            }
            resolve({
               errCode: 0,
               data: data
            })
         }
      } catch (error) {
         reject(error)
      }
   })
}
let bulkScheduleDoctor = (data) => {
   return new Promise(async (resolve, reject) => {
      try {
         if (!data.doctorId || !data.formateDate) {
            resolve({
               errCode: 1,
               errMessage: 'Missing required parameter'
            })
         } else {
            // delete old data in db
            console.log(data);
            await db.Schedule.destroy({
               where: {
                  doctorId: data.doctorId,
                  date: data.formateDate
               }
            });
            let schedules = data.arrSchedule
            if (schedules && schedules.length > 0) {
               schedules = schedules.map(item => ({
                  ...item,
                  maxNumber: MAX_NUMBER_SCHEDULE
               }))
               //create data in db
               await db.Schedule.bulkCreate(schedules)
            }
            resolve({
               errCode: 0,
               message: 'OKE'
            })
         }

      } catch (error) {
         reject(error)
      }
   })
}
let getScheduleDoctorById = (doctorId, date) => {
   return new Promise(async (resolve, reject) => {
      try {
         if (!doctorId || !date) {
            resolve({
               errCode: 1,
               errMessage: 'Missing required parameter'
            })
         } else {
            let schedules = await db.Schedule.findAll({
               where: {
                  doctorId,
                  date
               },
               include: [
                  { model: db.Allcode, as: 'timeData', attributes: ['valueEn', 'valueVi'] },
               ],
               raw: true,
               nest: true
            })
            if (!schedules) schedules = []
            resolve({
               errCode: 0,
               data: schedules
            })
         }
      } catch (error) {
         reject(error)
      }
   })
}
module.exports = {
   getTopDoctorHome: getTopDoctorHome,
   getAllDoctors: getAllDoctors,
   saveDetailInforDoctor: saveDetailInforDoctor,
   getDetailDoctorById: getDetailDoctorById,
   bulkScheduleDoctor: bulkScheduleDoctor,
   getScheduleDoctorById: getScheduleDoctorById
}