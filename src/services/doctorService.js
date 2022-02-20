import db from "../models/index";

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
         if (!inputData.doctorId || !inputData.contentHTML || !inputData.contentMarkdown) {
            resolve({
               errCode: 1,
               errMessage: 'Missing required parameter'
            })
         } else {
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
               errcode: 1,
               errMessage: 'Missing required parameter'
            })
         } else {
            let data = await db.User.findOne({
               where: { id: id },
               attributes: {
                  exclude: ['password', 'image']
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
               raw: true,
               nest: true
            })
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
}