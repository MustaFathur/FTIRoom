'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Ruangans', {
      id_ruangan: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_gedung: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Gedungs',
          key: 'id_gedung'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      nama_ruangan: {
        type: Sequelize.STRING
      },
      kapasitas: {
        type: Sequelize.INTEGER
      },
      fasilitas: {
        type: Sequelize.STRING
      },
      gambar_ruangan: {
        type: Sequelize.STRING
      },
      status_ketersediaan: {
        type: Sequelize.ENUM('Tersedia', 'Dipinjam'),
        defaultValue: 'Tersedia'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Ruangans');
  }
};