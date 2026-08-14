const { DataTypes } = require('sequelize');

module.exports = {
  name: 'Pesaje',
  attributes: {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    animal_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'animales', key: 'id' } },
    peso: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    fecha: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    usuario_id: { type: DataTypes.INTEGER, allowNull: true },
    observaciones: { type: DataTypes.TEXT, allowNull: true },
  },
  options: {
    tableName: 'pesajes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
};
