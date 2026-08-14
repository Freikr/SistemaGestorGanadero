const { DataTypes } = require('sequelize');

module.exports = {
  name: 'Auditoria',
  attributes: {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: true },
    accion: { type: DataTypes.ENUM('CREACION', 'MODIFICACION', 'ELIMINACION', 'CAMBIO_ESTADO'), allowNull: false },
    entidad: { type: DataTypes.STRING(50), allowNull: false },
    entidad_id: { type: DataTypes.INTEGER, allowNull: false },
    datos_anteriores: { type: DataTypes.JSONB, allowNull: true },
    datos_nuevos: { type: DataTypes.JSONB, allowNull: true },
    fecha: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    ip: { type: DataTypes.STRING(45), allowNull: true },
  },
  options: {
    tableName: 'auditoria',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
};
