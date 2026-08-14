const { DataTypes } = require('sequelize');

module.exports = {
  name: 'Vacuna',
  attributes: {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING(150), allowNull: false },
    fabricante: { type: DataTypes.STRING(150), allowNull: true },
    dosis: { type: DataTypes.STRING(100), allowNull: true },
    descripcion: { type: DataTypes.TEXT, allowNull: true },
    estado: { type: DataTypes.ENUM('ACTIVA', 'INACTIVA'), defaultValue: 'ACTIVA' },
  },
  options: {
    tableName: 'vacunas',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
};
