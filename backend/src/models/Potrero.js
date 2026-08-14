const { DataTypes } = require('sequelize');

module.exports = {
  name: 'Potrero',
  attributes: {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    finca_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'fincas', key: 'id' } },
    nombre: { type: DataTypes.STRING(100), allowNull: false },
    descripcion: { type: DataTypes.TEXT, allowNull: true },
    superficie: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    capacidad: { type: DataTypes.INTEGER, allowNull: true },
    estado: { type: DataTypes.ENUM('ACTIVO', 'INACTIVO'), defaultValue: 'ACTIVO' },
  },
  options: {
    tableName: 'potreros',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
};
