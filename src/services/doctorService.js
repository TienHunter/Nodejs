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
         if (!inputData.doctorId ||

            !inputData.contentHTML || !inputData.contentMarkdown || !inputData.description ||

            !inputData.priceId || !inputData.provinceId || !inputData.paymentId ||
            !inputData.addressClinic || !inputData.nameClinic || !inputData.note

         ) {
            resolve({
               errCode: 1,
               errMessage: 'Missing required parameter'
            })
         } else {
            if (inputData.action === 'CREATE') {
               //create data in table markdown
               await db.Markdown.create({
                  contentHTML: inputData.contentHTML,
                  contentMarkdown: inputData.contentMarkdown,
                  description: inputData.description,
                  doctorId: inputData.doctorId
               });
               // create data in table doctor_infor
               await db.Doctor_Infor.create({
                  priceId: inputData.priceId,
                  provinceId: inputData.provinceId,
                  paymentId: inputData.paymentId,
                  addressClinic: inputData.addressClinic,
                  nameClinic: inputData.nameClinic,
                  note: inputData.note,
                  doctorId: inputData.doctorId
               });
               resolve({
                  errCode: 0,
                  message: 'Create infor doctor  && markdown success __ infor'
               })
            }
            if (inputData.action === 'UPDATE') {
               let doctorMarkdown = await db.Markdown.findOne({
                  where: { doctorId: inputData.doctorId },
                  raw: false
               })
               let doctorInfor = await db.Doctor_Infor.findOne({
                  where: { doctorId: inputData.doctorId },
                  raw: false
               });
               if (!doctorMarkdown) {
                  resolve({
                     errCode: 1,
                     errMessage: "Don't find doctorMarkdown to update"
                  })
               }
               if (!doctorInfor) {
                  resolve({
                     errCode: 1,
                     errMessage: "Dont find doctorInfor to update"
                  })
               }
               if (doctorMarkdown) {
                  doctorMarkdown.contentHTML = inputData.contentHTML;
                  doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
                  doctorMarkdown.description = inputData.description;
                  await doctorMarkdown.save();
               }
               if (doctorInfor) {
                  doctorInfor.priceId = inputData.priceId;
                  doctorInfor.provinceId = inputData.provinceId;
                  doctorInfor.paymentId = inputData.paymentId;
                  doctorInfor.addressClinic = inputData.addressClinic;
                  doctorInfor.nameClinic = inputData.nameClinic;
                  doctorInfor.note = inputData.note;
                  await doctorInfor.save();
                  resolve({
                     errCode: 0,
                     message: 'update infor doctor && markdown success __infor'
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
                  // table markdown
                  {
                     model: db.Markdown,
                     attributes: ['contentHTML', 'contentMarkdown', 'description']
                  },
                  {
                     // allcode is associated to user
                     model: db.Allcode,
                     as: 'positionData',
                     attributes: ['valueEn', 'valueVi']
                  },

                  // table doctor infor
                  {
                     model: db.Doctor_Infor,
                     attributes: {
                        exclude: ['id', 'doctorId', 'createdAt', 'updatedAt']
                     },
                     // allcode is associated to doctor_infor
                     include: [
                        {
                           model: db.Allcode,
                           as: 'priceData',
                           attributes: ['valueEn', 'valueVi']
                        },
                        {
                           model: db.Allcode,
                           as: 'provinceData',
                           attributes: ['valueEn', 'valueVi']
                        },
                        {
                           model: db.Allcode,
                           as: 'paymentData',
                           attributes: ['valueEn', 'valueVi']
                        }
                     ]
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
let getMedicalAddressByDoctorId = (doctorId) => {
   return new Promise(async (resolve, reject) => {
      try {
         if (!doctorId) {
            resolve({
               errCode: 1,
               errMessage: 'Missing required parameter'
            })
         } else {
            let data = await db.Doctor_Infor.findOne({
               where: { doctorId: doctorId },
               attributes: ['priceId', 'provinceId', 'paymentId', 'addressClinic', 'nameClinic', 'note'],
               // allcode is associated to doctor_infor
               include: [
                  {
                     model: db.Allcode,
                     as: 'priceData',
                     attributes: ['valueEn', 'valueVi']
                  },
                  {
                     model: db.Allcode,
                     as: 'provinceData',
                     attributes: ['valueEn', 'valueVi']
                  },
                  {
                     model: db.Allcode,
                     as: 'paymentData',
                     attributes: ['valueEn', 'valueVi']
                  }
               ],
               raw: false,
               nest: true
            })
            if (!data) data = {};
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
let getProfileDoctorByDoctorId = (doctorId) => {
   return new Promise(async (resolve, reject) => {
      try {
         if (!doctorId) {
            resolve({
               errCode: 1,
               errMessage: 'Missing required parameter'
            })
         } else {
            let data = await db.User.findOne({
               where: { id: doctorId },
               attributes: {
                  exclude: ['password']
               },
               include: [
                  // table markdown
                  {
                     model: db.Markdown,
                     attributes: ['contentHTML', 'contentMarkdown', 'description']
                  },

                  // allcode is associated to user
                  {
                     model: db.Allcode,
                     as: 'positionData',
                     attributes: ['valueEn', 'valueVi']
                  },

                  // table doctor_infor
                  {
                     model: db.Doctor_Infor,
                     attributes: {
                        exclude: ['id', 'doctorId', 'createdAt', 'updatedAt']
                     },
                     // allcode is associated to doctor_infor
                     include: [
                        {
                           model: db.Allcode,
                           as: 'priceData',
                           attributes: ['valueEn', 'valueVi']
                        },
                        {
                           model: db.Allcode,
                           as: 'provinceData',
                           attributes: ['valueEn', 'valueVi']
                        },
                        {
                           model: db.Allcode,
                           as: 'paymentData',
                           attributes: ['valueEn', 'valueVi']
                        }
                     ]
                  },
               ],
               raw: false,
               nest: true
            })
            if (data && data.image) {
               data.image = new Buffer(data.image, 'base64').toString('binary');
            }
            if (!data) data = {}
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
module.exports = {
   getTopDoctorHome: getTopDoctorHome,
   getAllDoctors: getAllDoctors,
   saveDetailInforDoctor: saveDetailInforDoctor,
   getDetailDoctorById: getDetailDoctorById,
   bulkScheduleDoctor: bulkScheduleDoctor,
   getScheduleDoctorById: getScheduleDoctorById,
   getMedicalAddressByDoctorId: getMedicalAddressByDoctorId,
   getProfileDoctorByDoctorId: getProfileDoctorByDoctorId
}