import clinicService from "../services/clinicService"

let createNewClinic = async (req, res) => {
   try {
      let data = await clinicService.createNewClinic(req.body);
      return res.status(200).json(data)
   } catch (error) {
      console.log('error create clinic: ', error);
      return res.status(200).json({
         errCode: -1,
         errMessage: 'Error from server'
      })
   }
}
let getAllClinics = async (req, res) => {
   try {
      let data = await clinicService.getAllClinics()
      return res.status(200).json(data)
   } catch (error) {
      return res.status(200).json({
         errCode: -1,
         errMessage: 'Error from server'
      })
   }
}
let getDetailClinic = async (req, res) => {
   try {
      let data = await clinicService.getDetailClinic(req.query.clinicId)
      return res.status(200).json(data)
   } catch (error) {
      console.log('error getDetailClinic: ', error);
      return res.status(200).json({
         errCode: -1,
         errMessage: 'Error from server'
      })
   }
}
// let getIntroClinic = async (req, res) => {
//    try {
//       let data = await clinicService.getIntroClinic(req.query.clinicId)
//       return res.status(200).json(data)
//    } catch (error) {
//       console.log('error getIntroClinic: ', error);
//       return res.status(200).json({
//          errCode: -1,
//          errMessage: 'Error from server'
//       })
//    }
// }
module.exports = {
   createNewClinic,
   getAllClinics,
   getDetailClinic,
}