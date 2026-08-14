const { DataTypes } = require('sequelize');

module.exports = {
  name: 'DetalleCompra',
  attributes: {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    compra_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'compras', key: 'id' } },
    producto_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'inventario', key: 'id' } },
    cantidad: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    precio_unitario: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    subtotal: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  },
  options: {
    tableName: 'detalle_compras',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
};
