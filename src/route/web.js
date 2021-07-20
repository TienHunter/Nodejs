import express from "express";
import homeController from "../controllers/homeController";

let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage);
    router.get('/about', homeController.getAboutPage);
    router.get('/hoidanit', (req, res) => {
        return res.send("Hello worrld hoi dan it");
    });
    router.get('/crud', homeController.getCRUD);
    return app.use("/", router);
}

module.exports = initWebRoutes;