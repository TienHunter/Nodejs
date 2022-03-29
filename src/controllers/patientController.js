
import patientService from "../services/patientService"
let postBookingAppointment = async (req, res) => {
   try {
      let data = await patientService.postBookingAppointment(req.body);
      return res.status(200).json(data)
   } catch (error) {
      console.log('error post booking appointment: ', error);
      return res.status(200).json({
         errCode: -1,
         errMessage: 'Error from server'
      })
   }
}
let postVerifyBookingAppointment = async (req, res) => {
   try {
      let data = await patientService.postVerifyBookingAppointment(req.body);
      return res.status(200).json(data)
   } catch (error) {
      console.log('error post post verify booking appointment: ', error);
      return res.status(200).json({
         errCode: -1,
         errMessage: 'Error from server'
      })
   }
}
module.exports = {
   postBookingAppointment: postBookingAppointment,
   postVerifyBookingAppointment: postVerifyBookingAppointment
}