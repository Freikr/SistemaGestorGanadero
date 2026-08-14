const { DataTypes } = require('sequelize');

module.exports = {
  name: 'Movimiento',
  attributes: {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    animal_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'animales', key: 'id' } },
    potrero_origen_id: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'potreros', key: 'id' } },
    potrero_destino_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'potreros', key: 'id' } },
    fecha: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    motivo: { type: DataTypes.STRING(255), allowNull: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: true },
    observaciones: { type: DataTypes.TEXT, allowNull: true },
  },
  options: {
    tableName: 'movimientos',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
};
