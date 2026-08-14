const { DataTypes } = require('sequelize');

module.exports = {
  name: 'Configuracion',
  attributes: {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    finca_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'fincas', key: 'id' }, unique: true },
    moneda: { type: DataTypes.STRING(10), allowNull: false, defaultValue: 'USD' },
    unidad_peso: { type: DataTypes.STRING(10), allowNull: false, defaultValue: 'kg' },
    unidad_superficie: { type: DataTypes.STRING(10), allowNull: false, defaultValue: 'ha' },
    formato_fecha: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'YYYY-MM-DD' },
    zona_horaria: { type: DataTypes.STRING(50), allowNull: false, defaultValue: 'America/Bogota' },
    notificaciones_activadas: { type: DataTypes.BOOLEAN, defaultValue: true },
    alertas_stock: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  options: {
    tableName: 'configuraciones',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
};
