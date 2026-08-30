function definirAsociaciones(models) {
  const { Finca, Especie, Raza, Potrero, Animal, Usuario, Pesaje, Movimiento, Vacuna, AplicacionVacuna, Enfermedad, Tratamiento, Reproduccion, Parto, ProduccionLeche, Inventario, MovimientoInventario, Compra, DetalleCompra, Venta, DetalleVenta, Gasto, Notificacion, Configuracion, Auditoria } = models;

  Finca.hasMany(Animal, { foreignKey: 'finca_id', as: 'animales' });
  Animal.belongsTo(Finca, { foreignKey: 'finca_id', as: 'finca' });

  Finca.hasMany(Potrero, { foreignKey: 'finca_id', as: 'potreros' });
  Potrero.belongsTo(Finca, { foreignKey: 'finca_id', as: 'finca' });

  Finca.hasMany(Inventario, { foreignKey: 'finca_id', as: 'inventarios' });
  Inventario.belongsTo(Finca, { foreignKey: 'finca_id', as: 'finca' });

  Finca.hasMany(Gasto, { foreignKey: 'finca_id', as: 'gastos' });
  Gasto.belongsTo(Finca, { foreignKey: 'finca_id', as: 'finca' });

  Finca.hasMany(Compra, { foreignKey: 'finca_id', as: 'compras' });
  Compra.belongsTo(Finca, { foreignKey: 'finca_id', as: 'finca' });

  Finca.hasMany(Venta, { foreignKey: 'finca_id', as: 'ventas' });
  Venta.belongsTo(Finca, { foreignKey: 'finca_id', as: 'finca' });

  Finca.hasOne(Configuracion, { foreignKey: 'finca_id', as: 'configuracion' });
  Configuracion.belongsTo(Finca, { foreignKey: 'finca_id', as: 'finca' });

  Especie.hasMany(Raza, { foreignKey: 'especie_id', as: 'razas' });
  Raza.belongsTo(Especie, { foreignKey: 'especie_id', as: 'especie' });

  Especie.hasMany(Animal, { foreignKey: 'especie_id', as: 'animales' });
  Animal.belongsTo(Especie, { foreignKey: 'especie_id', as: 'especie' });

  Raza.hasMany(Animal, { foreignKey: 'raza_id', as: 'animales' });
  Animal.belongsTo(Raza, { foreignKey: 'raza_id', as: 'raza' });

  Animal.hasMany(Pesaje, { foreignKey: 'animal_id', as: 'pesajes' });
  Pesaje.belongsTo(Animal, { foreignKey: 'animal_id', as: 'animal' });

  Animal.hasMany(Movimiento, { foreignKey: 'animal_id', as: 'movimientos' });
  Movimiento.belongsTo(Animal, { foreignKey: 'animal_id', as: 'animal' });

  Potrero.hasMany(Movimiento, { foreignKey: 'potrero_destino_id', as: 'movimientos_entrada' });
  Potrero.hasMany(Movimiento, { foreignKey: 'potrero_origen_id', as: 'movimientos_salida' });
  Movimiento.belongsTo(Potrero, { foreignKey: 'potrero_destino_id', as: 'potrero_destino' });
  Movimiento.belongsTo(Potrero, { foreignKey: 'potrero_origen_id', as: 'potrero_origen' });
  Movimiento.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

  Vacuna.hasMany(AplicacionVacuna, { foreignKey: 'vacuna_id', as: 'aplicaciones' });
  AplicacionVacuna.belongsTo(Vacuna, { foreignKey: 'vacuna_id', as: 'vacuna' });

  Animal.hasMany(AplicacionVacuna, { foreignKey: 'animal_id', as: 'aplicaciones_vacunas' });
  AplicacionVacuna.belongsTo(Animal, { foreignKey: 'animal_id', as: 'animal' });

  Enfermedad.hasMany(Tratamiento, { foreignKey: 'enfermedad_id', as: 'tratamientos' });
  Tratamiento.belongsTo(Enfermedad, { foreignKey: 'enfermedad_id', as: 'enfermedad' });

  Animal.hasMany(Tratamiento, { foreignKey: 'animal_id', as: 'tratamientos' });
  Tratamiento.belongsTo(Animal, { foreignKey: 'animal_id', as: 'animal' });

  Animal.hasMany(Reproduccion, { foreignKey: 'animal_id', as: 'reproducciones' });
  Reproduccion.belongsTo(Animal, { foreignKey: 'animal_id', as: 'animal' });

  Animal.hasMany(Parto, { foreignKey: 'madre_id', as: 'partos' });
  Parto.belongsTo(Animal, { foreignKey: 'madre_id', as: 'madre' });

  Animal.hasMany(ProduccionLeche, { foreignKey: 'animal_id', as: 'produccion_leche' });
  ProduccionLeche.belongsTo(Animal, { foreignKey: 'animal_id', as: 'animal' });

  Inventario.hasMany(MovimientoInventario, { foreignKey: 'producto_id', as: 'movimientos' });
  MovimientoInventario.belongsTo(Inventario, { foreignKey: 'producto_id', as: 'producto' });

  Compra.hasMany(DetalleCompra, { foreignKey: 'compra_id', as: 'detalles' });
  DetalleCompra.belongsTo(Compra, { foreignKey: 'compra_id', as: 'compra' });

  DetalleCompra.belongsTo(Inventario, { foreignKey: 'producto_id', as: 'producto' });

  Venta.hasMany(DetalleVenta, { foreignKey: 'venta_id', as: 'detalles' });
  DetalleVenta.belongsTo(Venta, { foreignKey: 'venta_id', as: 'venta' });

  DetalleVenta.belongsTo(Animal, { foreignKey: 'animal_id', as: 'animal' });

  Usuario.hasMany(Animal, { foreignKey: 'created_by', as: 'animales_creados' });
  Usuario.hasMany(Notificacion, { foreignKey: 'usuario_id', as: 'notificaciones' });
  Notificacion.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

  Usuario.hasMany(Auditoria, { foreignKey: 'usuario_id', as: 'auditorias' });
  Auditoria.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
}

module.exports = definirAsociaciones;
