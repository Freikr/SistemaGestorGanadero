const { DataTypes } = require('sequelize');

module.exports = {
  name: 'Enfermedad',
  attributes: {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING(150), allowNull: false },
    descripcion: { type: DataTypes.TEXT, allowNull: true },
    estado: { type: DataTypes.ENUM('ACTIVA', 'INACTIVA'), defaultValue: 'ACTIVA' },
  },
  options: {
    tableName: 'enfermedades',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
};
