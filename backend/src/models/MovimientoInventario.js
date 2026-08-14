const { DataTypes } = require('sequelize');

module.exports = {
  name: 'MovimientoInventario',
  attributes: {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    producto_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'inventario', key: 'id' } },
    tipo: { type: DataTypes.ENUM('ENTRADA', 'SALIDA', 'AJUSTE', 'CONSUMO', 'VENCIMIENTO'), allowNull: false },
    cantidad: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    motivo: { type: DataTypes.STRING(255), allowNull: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: true },
    fecha: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    observaciones: { type: DataTypes.TEXT, allowNull: true },
  },
  options: {
    tableName: 'movimientos_inventario',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
};
