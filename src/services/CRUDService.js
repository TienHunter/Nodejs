import bcrypt from 'bcryptjs';
import db from "../models/index";

const salt = bcrypt.genSaltSync(10);

let createNewUser = async(data) => {
    return new Promise(async(resolve, reject) => {
        try {
            let hashPasswordFromBcryptjs = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashPasswordFromBcryptjs,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                gender: data.gender == '1' ? true : false,
                roleId: data.roleId,
                phoneNumber: data.phoneNumber
            });
            resolve('ok! create user succeed!');
        } catch (e) {
            reject(e)
        }
    })

}
let hashUserPassword = (password) => {
    return new Promise(async(resole, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resole(hashPassword);

        } catch (error) {
            reject(error);
        }
    })
}
let getAllUser = () => {
    return new Promise(async(resolve, reject) => {
        try {
            let users = await db.User.findAll({
                raw: true
            });
            resolve(users);
        } catch (error) {
            reject(e);
        }
    })
}
let getUserInfoById = (userId) => {
    return new Promise(async(resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId },
                raw: true
            })
            if (user) {
                resolve(user);
            } else {
                resolve([]);
            }

        } catch (e) {
            reject(e);
        }
    })
}
let updateUserData = (data) => {
    // console.log('data from service')
    // console.log(data);
    return new Promise(async(resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: data.id }
            })
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;

                await user.save();
                let allUsers = await db.User.findAll();
                resolve(allUsers);
            } else {
                resolve();
            }

        } catch (error) {
            reject(error);
        }
    })

}
module.exports = {
    createNewUser: createNewUser,
    getAllUser: getAllUser,
    getUserInfoById: getUserInfoById,
    updateUserData: updateUserData,
}