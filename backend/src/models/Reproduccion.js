const { DataTypes } = require('sequelize');

module.exports = {
  name: 'Reproduccion',
  attributes: {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    animal_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'animales', key: 'id' } },
    padre_id: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'animales', key: 'id' } },
    madre_id: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'animales', key: 'id' } },
    fecha: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    tipo: { type: DataTypes.ENUM('MONTA_NATURAL', 'INSEMINACION_ARTIFICIAL'), allowNull: false },
    resultado: { type: DataTypes.ENUM('EXITOSO', 'FALLIDO', 'PENDIENTE'), allowNull: true },
    observaciones: { type: DataTypes.TEXT, allowNull: true },
  },
  options: {
    tableName: 'reproducciones',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
};
