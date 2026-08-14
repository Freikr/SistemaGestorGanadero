const { DataTypes } = require('sequelize');

module.exports = {
  name: 'DetalleVenta',
  attributes: {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    venta_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'ventas', key: 'id' } },
    animal_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'animales', key: 'id' } },
    cantidad: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    peso: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    precio_unitario: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    subtotal: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  },
  options: {
    tableName: 'detalle_ventas',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
};
