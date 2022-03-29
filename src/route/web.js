import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import doctorController from "../controllers/doctorController";
import patientController from "../controllers/patientController"
let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage);
    router.get('/about', homeController.getAboutPage);
    router.get('/crud', homeController.getCRUD);
    router.post('/post-crud', homeController.postCRUD);
    router.get('/get-crud', homeController.displayGetCRUD);
    router.get('/edit-crud', homeController.getEditCRUD);
    router.post('/put-crud', homeController.putCRUD);
    router.get('/delete-crud', homeController.deleteCRUD);

    router.post('/api/login', userController.handleLogin);
    router.get('/api/get-all-users', userController.handleAllUsers);
    router.post('/api/create-new-user', userController.handleCreateNewUser);
    router.put('/api/edit-user', userController.handleEditUser);
    router.delete('/api/delete-user', userController.handleDeleteUser);
    router.get('/api/allcode', userController.getAllCode)

    //doctorcontroller
    router.get('/api/top-doctor-home', doctorController.getTopDoctorHome)
    router.get('/api/get-all-doctors', doctorController.getAllDoctors)
    router.post('/api/create-infor-doctor', doctorController.postInforDoctor)
    router.get('/api/get-detail-doctor-by-id', doctorController.getDetailDoctorById)
    router.post('/api/bulk-schedule-doctor', doctorController.bulkScheduleDoctor)
    router.get('/api/get-schedule-doctor-by-id', doctorController.getScheduleDoctorById)
    router.get('/api/medical-address-by-doctorId', doctorController.getMedicalAddressByDoctorId)
    router.get('/api/get-profile-doctor-by-doctorId', doctorController.getProfileDoctorByDoctorId)

    //patientController
    router.post('/api/post-booking-appointment', patientController.postBookingAppointment)
    router.post('/api/post-verify-booking-appointment', patientController.postVerifyBookingAppointment)

    return app.use("/", router);
}

module.exports = initWebRoutes;