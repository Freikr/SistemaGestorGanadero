const { DataTypes } = require('sequelize');

module.exports = {
  name: 'Inventario',
  attributes: {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    finca_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'fincas', key: 'id' } },
    nombre: { type: DataTypes.STRING(150), allowNull: false },
    categoria: { type: DataTypes.ENUM('MEDICAMENTO', 'VACUNA', 'ALIMENTO', 'SUPLEMENTO', 'HERRAMIENTA', 'INSUMO', 'OTRO'), allowNull: false },
    unidad_medida: { type: DataTypes.STRING(50), allowNull: false },
    cantidad_actual: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
    stock_minimo: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    precio_compra: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    fecha_vencimiento: { type: DataTypes.DATE, allowNull: true },
    proveedor: { type: DataTypes.STRING(150), allowNull: true },
    estado: { type: DataTypes.ENUM('ACTIVO', 'INACTIVO', 'VENCIDO'), defaultValue: 'ACTIVO' },
  },
  options: {
    tableName: 'inventario',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
};
