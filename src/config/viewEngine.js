import express from "express";

let configViewEngine = (app) => {
    //arrow function
    app.use(express.static("./src/public"));
    app.set("view engine", "ejs"); // user view engine with ejs library
    app.set("views", "./src/views");// set links láy các file view engine
}

module.exports = configViewEngine;
