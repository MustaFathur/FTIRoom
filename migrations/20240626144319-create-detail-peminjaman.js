'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('DetailPeminjamans', {
      id_peminjaman: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Peminjamans',
          key: 'id_peminjaman'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      id_ruangan: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Ruangans',
          key: 'id_ruangan'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      tanggal_peminjaman: {
        type: Sequelize.DATEONLY
      },
      jam_mulai: {
        type: Sequelize.TIME
      },
      jam_selesai: {
        type: Sequelize.TIME
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
    await queryInterface.dropTable('DetailPeminjamans');
  }
};