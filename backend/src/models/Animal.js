const { DataTypes } = require('sequelize');

module.exports = {
  name: 'Animal',
  attributes: {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    finca_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'fincas', key: 'id' } },
    especie_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'especies', key: 'id' } },
    raza_id: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'razas', key: 'id' } },
    arete: { type: DataTypes.STRING(50), allowNull: true, unique: true },
    microchip: { type: DataTypes.STRING(100), allowNull: true, unique: true },
    codigo_qr: { type: DataTypes.STRING(100), allowNull: true, unique: true },
    nombre: { type: DataTypes.STRING(100), allowNull: true },
    sexo: { type: DataTypes.ENUM('MACHO', 'HEMBRA'), allowNull: false },
    fecha_nacimiento: { type: DataTypes.DATE, allowNull: true },
    color: { type: DataTypes.STRING(50), allowNull: true },
    estado: { type: DataTypes.ENUM('ACTIVO', 'VENDIDO', 'FALLECIDO', 'EN_TRATAMIENTO'), defaultValue: 'ACTIVO' },
    foto_url: { type: DataTypes.STRING(255), allowNull: true },
    observaciones: { type: DataTypes.TEXT, allowNull: true },
    created_by: { type: DataTypes.INTEGER, allowNull: true },
    updated_by: { type: DataTypes.INTEGER, allowNull: true },
  },
  options: {
    tableName: 'animales',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
};
