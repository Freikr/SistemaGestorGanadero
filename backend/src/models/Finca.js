const { DataTypes } = require('sequelize');

module.exports = {
  name: 'Finca',
  attributes: {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING(100), allowNull: false },
    descripcion: { type: DataTypes.TEXT, allowNull: true },
    direccion: { type: DataTypes.STRING(255), allowNull: true },
    telefono: { type: DataTypes.STRING(20), allowNull: true },
    superficie: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    estado: { type: DataTypes.ENUM('ACTIVA', 'INACTIVA'), defaultValue: 'ACTIVA' },
  },
  options: {
    tableName: 'fincas',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
};
