'use strict';

module.exports = {
    // email: DataTypes.STRING,
    //     password: DataTypes.STRING,
    //     firstName: DataTypes.STRING,
    //     lastName: DataTypes.STRING,
    //     address: DataTypes.STRING,
    //     gender: DataTypes.BOOLEAN,
    //     roleId: DataTypes.STRING,
    //     phoneNumber: DataTypes.STRING,
    //     postionId: DataTypes.STRING,
    //     image: DataTypes.STRING
    up: async(queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Users', [{
            email: 'example@example.com',
            password: '123456',
            firstName: 'John',
            lastName: 'Doe',
            address: 'HaiPhong',
            gender: 1,
            roleId: 'R1',
            phoneNumber: '123456789',
            positionId: 'doctor',
            image: 'url',

            createdAt: new Date(),
            updatedAt: new Date()
        }]);
    },

    down: async(queryInterface, Sequelize) => {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
    }
};