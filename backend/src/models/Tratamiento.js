const { DataTypes } = require('sequelize');

module.exports = {
  name: 'Tratamiento',
  attributes: {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    animal_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'animales', key: 'id' } },
    enfermedad_id: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'enfermedades', key: 'id' } },
    fecha_inicio: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    fecha_fin: { type: DataTypes.DATE, allowNull: true },
    medicamento: { type: DataTypes.STRING(150), allowNull: false },
    dosis: { type: DataTypes.STRING(100), allowNull: true },
    veterinario: { type: DataTypes.STRING(150), allowNull: true },
    estado: { type: DataTypes.ENUM('EN_CURSO', 'FINALIZADO', 'CANCELADO'), defaultValue: 'EN_CURSO' },
    observaciones: { type: DataTypes.TEXT, allowNull: true },
  },
  options: {
    tableName: 'tratamientos',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
};
