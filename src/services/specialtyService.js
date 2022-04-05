
import db from "../models/index";
require('dotenv').config()

let createNewSpecialty = (data) => {
   return new Promise(async (resolve, reject) => {
      try {
         if (!data.specialtyId || !data.descriptionMarkdown || !data.descriptionHTML || !data.image) {
            resolve({
               errCode: 1,
               errMessage: 'Missing required parameter'
            })
         } else {
            await db.Specialty.create({
               specialtyId: data.specialtyId,
               descriptionHTML: data.descriptionHTML,
               descriptionMarkdown: data.descriptionMarkdown,
               image: data.image,
            })
            resolve({
               errCode: 0,
               message: 'create new specialty success'
            })
         }
      } catch (error) {

      }
   })
}
let getAllSpecialties = () => {
   return new Promise(async (resolve, reject) => {
      try {
         let data = await db.Specialty.findAll({
            include: [
               { model: db.Allcode, as: 'specialtyData', attributes: ['valueEn', 'valueVi'] },
            ],
            raw: true,
            nest: true
         });
         if (data && data.length > 0) {
            data = data.map(item => {
               item.image = new Buffer(item.image, 'base64').toString('binary');
               return item;
            })
         }
         if (!data) data = [];
         resolve({
            errCode: 0,
            message: 'oke',
            data: data
         })
      } catch (error) {
         reject(error)
      }
   })
}
let getDetailSpecialty = (specialtyId) => {
   return new Promise(async (resolve, reject) => {
      try {
         if (!specialtyId) {
            resolve({
               errCode: 1,
               errMessage: 'Missing required parameter'
            })
         } else {
            let data = {};
            let specialty = await db.Specialty.findOne({
               where: { specialtyId: specialtyId },
               attributes: {
                  exclude: ["image"]
               }
            })
            if (specialty) {
               let doctors = await db.Doctor_Infor.findAll({
                  where: { specialtyId: specialtyId },
                  attributes: {
                     exclude: ['id', 'createdAt', 'updatedAt']
                  }
               })
               data.specialty = specialty;
               data.doctors = doctors;
            } else {
               data = [];
            }
            resolve({
               errCode: 0,
               data
            })
         }
      } catch (error) {
         reject(error)
      }
   })
}
module.exports = {
   createNewSpecialty,
   getAllSpecialties,
   getDetailSpecialty
}