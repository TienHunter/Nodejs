
import doctorService from "../services/doctorService";
let getTopDoctorHome = async (req, res) => {
   let limit = req.query.limit;
   if (!limit) limit = 10;
   try {
      let data = await doctorService.getTopDoctorHome(+limit);
      return res.status(200).json(data)
   } catch (e) {
      console.log(e);
      return res.status(200).json({
         errCode: -1,
         errMessage: 'Error from server ...'
      })
   }
}

let getAllDoctors = async (req, res) => {
   try {
      let data = await doctorService.getAllDoctors()

      return res.status(200).json(data)
   } catch (error) {
      console.log("get All doctor from doctor controller:", error);
      return res.status(200).json({
         errCode: -1,
         errMessage: 'Error from server'
      })
   }
}
let postInforDoctor = async (req, res) => {

   try {
      let respone = await doctorService.saveDetailInforDoctor(req.body)
      res.status(200).json(respone)
   } catch (e) {
      console.log('error post infor doctor :', e);
      return res.status(200).json({
         errCode: -1,
         errMessage: 'Error from server'
      })
   }
}
let getDetailDoctorById = async (req, res) => {
   try {
      let infor = await doctorService.getDetailDoctorById(req.query.id)
      return res.status(200).json(infor)
   } catch (e) {
      console.log(e)
      return res.status(200).json({
         errCode: -1,
         errMessage: 'Error from server'
      })
   }
}

let bulkScheduleDoctor = async (req, res) => {
   try {
      let data = await doctorService.bulkScheduleDoctor(req.body)
      return res.status(200).json(data)
   } catch (e) {
      console.log('bulk schedule doctor error: ', e);
      return res.status(200).json({
         errCode: -1,
         errMessage: 'Error from server'
      })
   }
}
let getScheduleDoctorById = async (req, res) => {
   try {
      let data = await doctorService.getScheduleDoctorById(req.query.doctorId, req.query.date);
      return res.status(200).json(data)
   } catch (error) {
      console.log('error get schedule doctor by id: ', error)
      return res.status(200).json({
         errCode: -1,
         errMessage: 'Error from server'
      })

   }
}
let getMedicalAddressByDoctorId = async (req, res) => {
   try {
      let data = await doctorService.getMedicalAddressByDoctorId(req.query.doctorId);
      return res.status(200).json(data)
   } catch (error) {
      console.log('error get medical address by doctorId: ', error)
      return res.status(200).json({
         errCode: -1,
         errMessage: 'Error from server'
      })

   }
}

module.exports = {
   getTopDoctorHome: getTopDoctorHome,
   getAllDoctors: getAllDoctors,
   postInforDoctor: postInforDoctor,
   getDetailDoctorById: getDetailDoctorById,
   bulkScheduleDoctor: bulkScheduleDoctor,
   getScheduleDoctorById: getScheduleDoctorById,
   getMedicalAddressByDoctorId: getMedicalAddressByDoctorId
}