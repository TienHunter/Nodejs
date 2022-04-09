import specialtyService from "../services/specialtyService"

let createNewSpecialty = async (req, res) => {
   try {
      let data = await specialtyService.createNewSpecialty(req.body);
      return res.status(200).json(data)
   } catch (error) {
      console.log('error create specialty: ', error);
      return res.status(200).json({
         errCode: -1,
         errMessage: 'Error from server'
      })
   }
}
let getAllSpecialties = async (req, res) => {
   try {
      let data = await specialtyService.getAllSpecialties()
      return res.status(200).json(data)
   } catch (error) {
      return res.status(200).json({
         errCode: -1,
         errMessage: 'Error from server'
      })
   }
}
let getDetailSpecialty = async (req, res) => {
   try {
      let data = await specialtyService.getDetailSpecialty(req.query.specialtyId)
      return res.status(200).json(data)
   } catch (error) {
      console.log('error getDetailSpecialty: ', error);
      return res.status(200).json({
         errCode: -1,
         errMessage: 'Error from server'
      })
   }
}
let getIntroSpecialty = async (req, res) => {
   try {
      let data = await specialtyService.getIntroSpecialty(req.query.specialtyId)
      return res.status(200).json(data)
   } catch (error) {
      console.log('error getIntroSpecialty: ', error);
      return res.status(200).json({
         errCode: -1,
         errMessage: 'Error from server'
      })
   }
}
module.exports = {
   createNewSpecialty,
   getAllSpecialties,
   getDetailSpecialty,
   getIntroSpecialty
}