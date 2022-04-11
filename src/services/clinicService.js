
import db from "../models/index";
require('dotenv').config()

let createNewClinic = (data) => {
   return new Promise(async (resolve, reject) => {
      try {
         if (!data.address || !data.descriptionMarkdown || !data.descriptionHTML || !data.image || !data.name) {
            resolve({
               errCode: 1,
               errMessage: 'Missing required parameter'
            })
         } else {
            await db.Clinic.create({
               address: data.address,
               descriptionMarkdown: data.descriptionMarkdown,
               descriptionHTML: data.descriptionHTML,
               image: data.image,
               name: data.name,
            })
            resolve({
               errCode: 0,
               message: 'create new specialty success'
            })
         }
      } catch (error) {
         reject(error)
      }
   })
}
let getAllClinics = () => {
   return new Promise(async (resolve, reject) => {
      try {
         let data = await db.Clinic.findAll();
         if (data && data.length > 0) {
            data = data.map(item => {
               item.image = Buffer.from(item.image, 'base64').toString('binary');
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
let getDetailClinic = (clinicId) => {
   return new Promise(async (resolve, reject) => {
      try {
         if (!clinicId) {
            resolve({
               errCode: 1,
               errMessage: 'Missing required parameter'
            })
         } else {
            let data = {};
            let clinic = await db.Clinic.findOne({
               where: { id: clinicId },
               // attributes: {
               //    exclude: ["image"]
               // }
            })
            if (clinic) {
               let doctors = await db.Doctor_Infor.findAll({
                  where: { clinicId: clinicId },
                  attributes: {
                     exclude: ['id', 'createdAt', 'updatedAt']
                  }
               })
               if (clinic.image) {
                  clinic.image = Buffer.from(clinic.image, 'base64').toString('binary');
               }
               data.clinic = clinic;
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
   createNewClinic,
   getAllClinics,
   getDetailClinic,
}