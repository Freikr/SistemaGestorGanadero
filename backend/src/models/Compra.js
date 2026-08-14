const { DataTypes } = require('sequelize');

module.exports = {
  name: 'Compra',
  attributes: {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    finca_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'fincas', key: 'id' } },
    usuario_id: { type: DataTypes.INTEGER, allowNull: true },
    proveedor: { type: DataTypes.STRING(150), allowNull: true },
    fecha: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    subtotal: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    impuestos: { type: DataTypes.DECIMAL(12, 2), allowNull: true, defaultValue: 0 },
    total: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    estado: { type: DataTypes.ENUM('PENDIENTE', 'COMPLETADA', 'CANCELADA'), defaultValue: 'PENDIENTE' },
    observaciones: { type: DataTypes.TEXT, allowNull: true },
  },
  options: {
    tableName: 'compras',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
};
