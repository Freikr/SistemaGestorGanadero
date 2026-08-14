const { DataTypes } = require('sequelize');

module.exports = {
  name: 'Especie',
  attributes: {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    descripcion: { type: DataTypes.TEXT, allowNull: true },
    estado: { type: DataTypes.ENUM('ACTIVA', 'INACTIVA'), defaultValue: 'ACTIVA' },
  },
  options: {
    tableName: 'especies',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
};
