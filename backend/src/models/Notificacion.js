const { DataTypes } = require('sequelize');

module.exports = {
  name: 'Notificacion',
  attributes: {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'usuarios', key: 'id' } },
    tipo: { type: DataTypes.ENUM('STOCK_BAJO', 'PROXIMO_VENCER', 'VACUNA_PROXIMA', 'TRATAMIENTO_PENDIENTE', 'PARTO_PROXIMO', 'RECORDATORIO_REPRODUCTIVO', 'SISTEMA'), allowNull: false },
    titulo: { type: DataTypes.STRING(150), allowNull: false },
    mensaje: { type: DataTypes.TEXT, allowNull: false },
    referencia_tipo: { type: DataTypes.STRING(50), allowNull: true },
    referencia_id: { type: DataTypes.INTEGER, allowNull: true },
    leida: { type: DataTypes.BOOLEAN, defaultValue: false },
    fecha: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  options: {
    tableName: 'notificaciones',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
};
