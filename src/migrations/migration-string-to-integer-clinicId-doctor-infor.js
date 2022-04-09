module.exports = {
   up: (queryInterface, Sequelize) => {
      return Promise.all([
         queryInterface.changeColumn('Doctor_Infor', 'clinicId', {
            type: Sequelize.INTEGER,
            allowNull: true,
         })
      ])
   },

   down: (queryInterface, Sequelize) => {
      return Promise.all([
         queryInterface.changeColumn('Doctor_Infor', 'clinicId', {
            type: Sequelize.STRING,
            allowNull: true,
         })
      ])
   }
};