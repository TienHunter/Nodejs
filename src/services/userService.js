import db from "../models/index";
import bcrypt from "bcryptjs";


const salt = bcrypt.genSaltSync(10);

let hashUserPassword = (password) => {
  return new Promise(async (resole, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt);
      resole(hashPassword);

    } catch (error) {
      reject(error);
    }
  })
}

let handleUserLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};

      let isExist = await checkUserEmail(email);
      if (isExist) {
        // User already exist
        let user = await db.User.findOne({
          attributes: ["id", "email", "roleId", "password", "firstName", "lastName"], // get some attributes
          where: { email: email },
          raw: true,
        });
        if (user) {
          // Check password
          let check = await bcrypt.compareSync(password, user.password);
          if (check) {
            userData.errCode = 0;
            userData.message = "Oke login";
            console.log(user);
            delete user.password;
            userData.user = user;
          } else {
            userData.errCode = 3;
            userData.message = "Wrong password";
          }
        } else {
          userData.errCode = 2;
          userData.message = "User's email not found !";
        }

        // resolve();
      } else {
        // return error
        userData.errCode = 1;
        userData.message =
          "Your's email isn't exist in system . Plz try other email !";
      }
      resolve(userData);
    } catch (error) {
      reject(error);
    }
  });
};

let checkUserEmail = (userEmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { email: userEmail },
      });

      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (error) {
      reject(error);
    }
  });
};
let getAllUsers = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = ''
      if (userId === 'ALL') {
        users = await db.User.findAll({
          attributes: {
            exclude: ['password']
          }
        })
      }
      else if (userId) {
        users = await db.User.findOne({
          where: { id: userId },
          attributes: {
            exclude: ['password']
          }
        })
      }
      resolve(users)
    } catch (error) {
      reject(error)
    }
  })

}

let createNewUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {

      let check = await checkUserEmail(data.email);
      if (check === true) {
        resolve({
          errCode: 1,
          errMessage: 'This email is already used, Plz try another email'
        });
      } else {
        let hashPasswordFromBcryptjs = await hashUserPassword(data.password);
        await db.User.create({
          email: data.email,
          password: hashPasswordFromBcryptjs,
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          gender: data.gender,
          roleId: data.roleId,
          phoneNumber: data.phoneNumber,
          positionId: data.positionId,
          image: data.avatar
        });
        resolve({
          errCode: 0,
          message: 'OKE'
        });
      }


    } catch (e) {
      reject(e);
    }
  })
}

let deleteUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: userId }
      })

      if (!user) {
        resolve({
          errCode: 2,
          errMessage: `The user isn't exist`
        })
      }

      await db.User.destroy({
        where: { id: userId }
      });

      resolve({
        errCode: 0,
        message: 'The user is deteled'
      })
    } catch (error) {
      reject(error)
    }
  })
}

let updateUserData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        resolve({
          errCode: 2,
          errMessage: 'Missing requuired parameter'
        })
      } else {
        let user = await db.User.findOne({
          where: { id: data.id },
          raw: false
        })
        if (user) {
          user.firstName = data.firstName;
          user.lastName = data.lastName;
          user.address = data.address;
          user.phoneNumber = data.phoneNumber;
          user.gender = data.gender;
          user.positionId = data.positionId;
          user.roleId = data.roleId;
          if (data.avatar) {
            user.image = data.avatar;
          }
          await user.save();
          resolve({
            errCode: 0,
            message: 'Update user succeeds!'
          });
        } else {
          resolve({
            errCode: 1,
            errMessage: `User's not found!`
          });
        }
      }

    } catch (error) {
      reject(error)
    }
  })
}

let getAllCodeService = (type) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (type) {
        let res = {};
        let allcode = await db.Allcode.findAll({
          where: { type: type }
        })
        res.errCode = 0;
        res.data = allcode
        resolve(res)
      } else {
        resolve({
          errCode: 1,
          errMessage: 'Missing required parameter'
        })
      }
    } catch (e) {
      reject(e)
    }
  })
}
module.exports = {
  handleUserLogin: handleUserLogin,
  getAllUsers: getAllUsers,
  createNewUser: createNewUser,
  deleteUser: deleteUser,
  updateUserData: updateUserData,
  getAllCodeService: getAllCodeService
};
