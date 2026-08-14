const { DataTypes } = require('sequelize');

module.exports = {
  name: 'AplicacionVacuna',
  attributes: {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    animal_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'animales', key: 'id' } },
    vacuna_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'vacunas', key: 'id' } },
    fecha_aplicacion: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    proxima_dosis: { type: DataTypes.DATE, allowNull: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: true },
    observaciones: { type: DataTypes.TEXT, allowNull: true },
  },
  options: {
    tableName: 'aplicaciones_vacunas',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
};
