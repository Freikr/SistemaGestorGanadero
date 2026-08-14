const { DataTypes } = require('sequelize');

module.exports = {
  name: 'ProduccionLeche',
  attributes: {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    animal_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'animales', key: 'id' } },
    fecha: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    turno: { type: DataTypes.ENUM('MANANA', 'TARDE'), allowNull: false },
    cantidad_litros: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    usuario_id: { type: DataTypes.INTEGER, allowNull: true },
    observaciones: { type: DataTypes.TEXT, allowNull: true },
  },
  options: {
    tableName: 'produccion_leche',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
};
