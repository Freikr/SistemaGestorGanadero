const { DataTypes } = require('sequelize');

module.exports = {
  name: 'Gasto',
  attributes: {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    finca_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'fincas', key: 'id' } },
    usuario_id: { type: DataTypes.INTEGER, allowNull: true },
    categoria: { type: DataTypes.ENUM('ALIMENTACION', 'MEDICAMENTOS', 'VETERINARIA', 'MANTENIMIENTO', 'TRANSPORTE', 'PERSONAL', 'SERVICIOS', 'OTROS'), allowNull: false },
    descripcion: { type: DataTypes.TEXT, allowNull: true },
    monto: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    fecha: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    metodo_pago: { type: DataTypes.STRING(50), allowNull: true },
    observaciones: { type: DataTypes.TEXT, allowNull: true },
  },
  options: {
    tableName: 'gastos',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
};
