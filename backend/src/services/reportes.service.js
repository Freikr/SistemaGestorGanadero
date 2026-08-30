const { Sequelize } = require('sequelize');
const { sequelize } = require('../../config/database');
const {
  Animal,
  Finca,
  Potrero,
  Especie,
  Raza,
  Venta,
  DetalleVenta,
  Inventario,
  MovimientoInventario,
  AplicacionVacuna,
  Vacuna,
  Tratamiento,
  Reproduccion,
  Parto,
  Gasto,
  Movimiento,
  Usuario,
  Pesaje,
} = require('../models');

function buildAnimalesQuery(fincaId, filtros = {}) {
  const where = { finca_id: fincaId };

  if (filtros.especieId) where.especie_id = filtros.especieId;
  if (filtros.razaId) where.raza_id = filtros.razaId;
  if (filtros.sexo) where.sexo = filtros.sexo;
  if (filtros.estado) where.estado = filtros.estado;
  if (filtros.edadMin || filtros.edadMax) {
    const ahora = new Date();
    const condiciones = {};
    if (filtros.edadMax) {
      const fechaMax = new Date(ahora.setFullYear(ahora.getFullYear() - filtros.edadMax));
      condiciones[sequelize.Op.lte] = fechaMax;
    }
    if (filtros.edadMin) {
      const fechaMin = new Date(ahora.setFullYear(ahora.getFullYear() - filtros.edadMin));
      condiciones[sequelize.Op.gte] = fechaMin;
    }
    where.fecha_nacimiento = condiciones;
  }

  const include = [
    { model: Especie, as: 'especie', attributes: ['id', 'nombre'] },
    { model: Raza, as: 'raza', attributes: ['id', 'nombre'] },
    { model: Finca, as: 'finca', attributes: ['id', 'nombre'] },
  ];

  const attributes = [
    'id', 'arete', 'nombre', 'sexo', 'estado', 'fecha_nacimiento',
    'fecha_ingreso', 'color', 'observaciones', 'created_at',
  ];

  const order = [];
  if (filtros.orden) {
    order.push([filtros.orden, filtros.direccion || 'ASC']);
  } else {
    order.push(['created_at', 'DESC']);
  }

  return { where, include, attributes, order, limit: filtros.limit, offset: filtros.offset };
}

async function obtenerDashboard(fincaId) {
  const [
    animalesResult,
    ventasResult,
    gastosResult,
    inventarioResult,
    vacunasPendientesResult,
    tratamientosActivosResult,
    partosResult,
    reproduccionesResult,
  ] = await Promise.all([
    Animal.findAll({
      where: { finca_id: fincaId },
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'total'],
        [sequelize.fn('SUM', sequelize.literal("CASE WHEN estado = 'ACTIVO' THEN 1 ELSE 0 END")), 'activos'],
        [sequelize.fn('SUM', sequelize.literal("CASE WHEN estado = 'VENDIDO' THEN 1 ELSE 0 END")), 'vendidos'],
        [sequelize.fn('SUM', sequelize.literal("CASE WHEN estado = 'FALLECIDO' THEN 1 ELSE 0 END")), 'fallecidos'],
        [sequelize.fn('SUM', sequelize.literal("CASE WHEN estado = 'EN_TRATAMIENTO' THEN 1 ELSE 0 END")), 'enTratamiento'],
        [sequelize.fn('SUM', sequelize.literal("CASE WHEN sexo = 'MACHO' THEN 1 ELSE 0 END")), 'machos'],
        [sequelize.fn('SUM', sequelize.literal("CASE WHEN sexo = 'HEMBRA' THEN 1 ELSE 0 END")), 'hembras'],
      ],
      raw: true,
    }),
    Venta.findOne({
      where: { finca_id: fincaId, estado: 'COMPLETADA' },
      attributes: [[sequelize.fn('SUM', sequelize.col('total')), 'total']],
      raw: true,
    }),
    Gasto.findOne({
      where: { finca_id: fincaId },
      attributes: [[sequelize.fn('SUM', sequelize.col('monto')), 'total']],
      raw: true,
    }),
    Inventario.findAll({
      where: { finca_id: fincaId },
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalProductos'],
        [sequelize.fn('SUM', sequelize.literal("CASE WHEN cantidad_actual <= stock_minimo THEN 1 ELSE 0 END")), 'stockBajo'],
        [sequelize.fn('SUM', sequelize.literal("CASE WHEN cantidad_actual = 0 THEN 1 ELSE 0 END")), 'agotados'],
      ],
      raw: true,
    }),
    AplicacionVacuna.count({
      include: [
        { model: Animal, as: 'animal', where: { finca_id: fincaId }, required: true },
        { model: Vacuna, as: 'vacuna', where: { estado: 'ACTIVA' }, required: true },
      ],
      where: {
        proxima_dosis: { [sequelize.Op.lte]: new Date() },
      },
    }),
    Tratamiento.count({
      include: [{ model: Animal, as: 'animal', where: { finca_id: fincaId }, required: true }],
      where: { estado: 'EN_CURSO' },
    }),
    Parto.count({
      include: [{ model: Animal, as: 'madre', where: { finca_id: fincaId }, required: true }],
      where: { fecha: { [sequelize.Op.gte]: new Date(new Date().setMonth(new Date().getMonth() - 1)) } },
    }),
    Reproduccion.count({
      include: [{ model: Animal, as: 'animal', where: { finca_id: fincaId }, required: true }],
      where: { resultado: 'EXITOSO' },
    }),
  ]);

  const distribucionSexo = await Animal.findAll({
    where: { finca_id: fincaId },
    attributes: [
      'sexo',
      [sequelize.fn('COUNT', sequelize.col('id')), 'cantidad'],
    ],
    group: ['sexo'],
    raw: true,
  });

  const distribucionRaza = await Animal.findAll({
    where: { finca_id: fincaId, estado: 'ACTIVO' },
    include: [{ model: Raza, as: 'raza', attributes: ['nombre'] }],
    attributes: [
      [sequelize.col('raza.nombre'), 'raza'],
      [sequelize.fn('COUNT', sequelize.col('animal.id')), 'cantidad'],
    ],
    group: ['raza.id', 'raza.nombre'],
    raw: true,
  });

  const distribucionFinca = await Animal.findAll({
    where: { finca_id: fincaId, estado: 'ACTIVO' },
    include: [{ model: Finca, as: 'finca', attributes: ['nombre'] }],
    attributes: [
      [sequelize.col('finca.nombre'), 'finca'],
      [sequelize.fn('COUNT', sequelize.col('animal.id')), 'cantidad'],
    ],
    group: ['finca.id', 'finca.nombre'],
    raw: true,
  });

  const ventasPorMes = await Venta.findAll({
    where: { finca_id: fincaId, estado: 'COMPLETADA' },
    attributes: [
      [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('fecha')), 'mes'],
      [sequelize.fn('SUM', sequelize.col('total')), 'total'],
      [sequelize.fn('COUNT', sequelize.col('id')), 'cantidad'],
    ],
    group: [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('fecha'))],
    order: [[sequelize.fn('DATE_TRUNC', 'month', sequelize.col('fecha')), 'ASC']],
    raw: true,
  });

  return {
    animales: {
      total: parseInt(animalesResult[0]?.total || 0, 10),
      activos: parseInt(animalesResult[0]?.activos || 0, 10),
      vendidos: parseInt(animalesResult[0]?.vendidos || 0, 10),
      fallecidos: parseInt(animalesResult[0]?.fallecidos || 0, 10),
      enTratamiento: parseInt(animalesResult[0]?.enTratamiento || 0, 10),
      machos: parseInt(animalesResult[0]?.machos || 0, 10),
      hembras: parseInt(animalesResult[0]?.hembras || 0, 10),
    },
    finanzas: {
      ventas: parseFloat(ventasResult?.total || 0),
      gastos: parseFloat(gastosResult?.total || 0),
      balance: parseFloat(ventasResult?.total || 0) - parseFloat(gastosResult?.total || 0),
    },
    inventario: {
      productos: parseInt(inventarioResult[0]?.totalProductos || 0, 10),
      stockBajo: parseInt(inventarioResult[0]?.stockBajo || 0, 10),
      agotados: parseInt(inventarioResult[0]?.agotados || 0, 10),
    },
    salud: {
      vacunasPendientes: vacunasPendientesResult,
      tratamientosActivos: tratamientosActivosResult,
      partosRecientes: partosResult,
      reproduccionesExitosas: reproduccionesResult,
    },
    distribuciones: {
      sexo: distribucionSexo,
      raza: distribucionRaza,
      finca: distribucionFinca,
    },
    ventasPorMes: ventasPorMes.map((v) => ({
      mes: v.mes,
      total: parseFloat(v.total || 0),
      cantidad: parseInt(v.cantidad || 0, 10),
    })),
  };
}

async function obtenerReporteAnimales(fincaId, filtros = {}, paginacion = {}) {
  const { limit = 20, page = 1 } = paginacion;
  const offset = (page - 1) * limit;

  const query = buildAnimalesQuery(fincaId, { ...filtros, limit, offset });

  const { rows, count } = await Animal.findAndCountAll({
    where: query.where,
    include: query.include,
    attributes: query.attributes,
    order: query.order,
    limit: query.limit,
    offset: query.offset,
    distinct: true,
  });

  const totalPages = Math.ceil(count / limit);

  return {
    data: rows,
    pagination: {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      total: count,
      totalPages,
    },
    filters: filtros,
  };
}

async function obtenerReporteMovimientos(fincaId, filtros = {}, paginacion = {}) {
  const { limit = 20, page = 1 } = paginacion;
  const offset = (page - 1) * limit;
  const where = {};

  if (filtros.fechaInicio && filtros.fechaFin) {
    where.fecha = { [sequelize.Op.between]: [filtros.fechaInicio, filtros.fechaFin] };
  } else if (filtros.fechaInicio) {
    where.fecha = { [sequelize.Op.gte]: filtros.fechaInicio };
  } else if (filtros.fechaFin) {
    where.fecha = { [sequelize.Op.lte]: filtros.fechaFin };
  }

  if (filtros.animalId) where.animal_id = filtros.animalId;
  if (filtros.tipoMovimiento) where.tipo = filtros.tipoMovimiento;

  const include = [
    {
      model: Animal,
      as: 'animal',
      where: { finca_id: fincaId },
      required: true,
      attributes: ['id', 'arete', 'nombre', 'sexo'],
      include: [
        { model: Finca, as: 'finca', attributes: ['id', 'nombre'] },
        { model: Potrero, as: 'potrero', attributes: ['id', 'nombre'] },
      ],
    },
    {
      model: Potrero,
      as: 'potrero_origen',
      attributes: ['id', 'nombre'],
      required: false,
    },
    {
      model: Potrero,
      as: 'potrero_destino',
      attributes: ['id', 'nombre'],
      required: false,
    },
  ];

  const { rows, count } = await Movimiento.findAndCountAll({
    where,
    include,
    attributes: ['id', 'fecha', 'tipo', 'motivo', 'observaciones', 'usuario_id'],
    order: [['fecha', 'DESC']],
    limit,
    offset,
    distinct: true,
  });

  const totalPages = Math.ceil(count / limit);

  return {
    data: rows,
    pagination: { page: parseInt(page, 10), limit: parseInt(limit, 10), total: count, totalPages },
    filters: filtros,
  };
}

async function obtenerReporteSalud(fincaId, filtros = {}, paginacion = {}) {
  const { limit = 20, page = 1 } = paginacion;
  const offset = (page - 1) * limit;
  const where = {};

  if (filtros.fechaInicio && filtros.fechaFin) {
    where.fecha_aplicacion = { [sequelize.Op.between]: [filtros.fechaInicio, filtros.fechaFin] };
  } else if (filtros.fechaInicio) {
    where.fecha_aplicacion = { [sequelize.Op.gte]: filtros.fechaInicio };
  } else if (filtros.fechaFin) {
    where.fecha_aplicacion = { [sequelize.Op.lte]: filtros.fechaFin };
  }

  if (filtros.animalId) where.animal_id = filtros.animalId;
  if (filtros.vacunaId) where.vacuna_id = filtros.vacunaId;

  const include = [
    {
      model: Animal,
      as: 'animal',
      where: { finca_id: fincaId },
      required: true,
      attributes: ['id', 'arete', 'nombre', 'sexo'],
      include: [{ model: Finca, as: 'finca', attributes: ['id', 'nombre'] }],
    },
    {
      model: Vacuna,
      as: 'vacuna',
      required: true,
      attributes: ['id', 'nombre', 'dosis'],
    },
  ];

  const { rows, count } = await AplicacionVacuna.findAndCountAll({
    where,
    include,
    attributes: ['id', 'fecha_aplicacion', 'proxima_dosis', 'observaciones', 'created_at'],
    order: [['fecha_aplicacion', 'DESC']],
    limit,
    offset,
    distinct: true,
  });

  const totalPages = Math.ceil(count / limit);

  const vacunasProximas = await AplicacionVacuna.findAll({
    include: [
      {
        model: Animal,
        as: 'animal',
        where: { finca_id: fincaId },
        required: true,
        attributes: ['id', 'arete', 'nombre', 'sexo'],
        include: [{ model: Finca, as: 'finca', attributes: ['id', 'nombre'] }],
      },
      { model: Vacuna, as: 'vacuna', required: true, attributes: ['id', 'nombre'] },
    ],
    where: {
      proxima_dosis: { [sequelize.Op.lte]: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
    },
    order: [['proxima_dosis', 'ASC']],
    limit: 50,
  });

  return {
    data: rows,
    pagination: { page: parseInt(page, 10), limit: parseInt(limit, 10), total: count, totalPages },
    vacunasProximas,
    filters: filtros,
  };
}

async function obtenerReporteVentas(fincaId, filtros = {}, paginacion = {}) {
  const { limit = 20, page = 1 } = paginacion;
  const offset = (page - 1) * limit;
  const where = { finca_id: fincaId, estado: 'COMPLETADA' };

  if (filtros.fechaInicio && filtros.fechaFin) {
    where.fecha = { [sequelize.Op.between]: [filtros.fechaInicio, filtros.fechaFin] };
  } else if (filtros.fechaInicio) {
    where.fecha = { [sequelize.Op.gte]: filtros.fechaInicio };
  } else if (filtros.fechaFin) {
    where.fecha = { [sequelize.Op.lte]: filtros.fechaFin };
  }

  if (filtros.usuarioId) where.usuario_id = filtros.usuarioId;
  if (filtros.cliente) where.cliente = { [sequelize.Op.iLike]: `%${filtros.cliente}%` };

  const include = [
    {
      model: DetalleVenta,
      as: 'detalles',
      include: [
        {
          model: Animal,
          as: 'animal',
          include: [
            { model: Raza, as: 'raza', attributes: ['nombre'] },
            { model: Especie, as: 'especie', attributes: ['nombre'] },
          ],
        },
      ],
    },
  ];

  const { rows, count } = await Venta.findAndCountAll({
    where,
    include,
    attributes: ['id', 'fecha', 'cliente', 'subtotal', 'impuestos', 'descuento', 'total', 'metodo_pago', 'observaciones'],
    order: [['fecha', 'DESC']],
    limit,
    offset,
    distinct: true,
  });

  const totalPages = Math.ceil(count / limit);

  const totalVentas = parseFloat(
    (
      await Venta.findOne({
        where,
        attributes: [[sequelize.fn('SUM', sequelize.col('total')), 'total']],
        raw: true,
      })
    )?.total || 0
  );

  const totalAnimales = await DetalleVenta.count({
    include: [
      { model: Venta, as: 'venta', where, required: true },
    ],
  });

  const promedioVenta = count > 0 ? totalVentas / count : 0;

  return {
    data: rows,
    pagination: { page: parseInt(page, 10), limit: parseInt(limit, 10), total: count, totalPages },
    resumen: {
      totalVentas,
      cantidadVentas: count,
      promedioVenta,
      totalAnimales,
    },
    filters: filtros,
  };
}

async function obtenerReporteInventario(fincaId, filtros = {}) {
  const where = { finca_id: fincaId };

  if (filtros.categoria) where.categoria = filtros.categoria;
  if (filtros.estado) where.estado = filtros.estado;

  const productos = await Inventario.findAll({
    where,
    include: [
      { model: MovimientoInventario, as: 'movimientos', limit: 5, order: [['fecha', 'DESC']] },
    ],
    order: [['nombre', 'ASC']],
  });

  const productosBajoMinimo = await Inventario.count({
    where: { ...where, cantidad_actual: { [sequelize.Op.lte]: sequelize.col('stock_minimo') } },
  });

  const productosAgotados = await Inventario.count({
    where: { ...where, cantidad_actual: 0 },
  });

  const valorInventario = await Inventario.findOne({
    where,
    attributes: [[sequelize.fn('SUM', sequelize.col('cantidad_actual') * sequelize.col('precio_compra')), 'valor']],
    raw: true,
  });

  return {
    data: productos,
    resumen: {
      totalProductos: productos.length,
      bajoMinimo: productosBajoMinimo,
      agotados: productosAgotados,
      valorEstimado: parseFloat(valorInventario?.valor || 0),
    },
    filters: filtros,
  };
}

async function obtenerReporteMortalidad(fincaId, filtros = {}, paginacion = {}) {
  const { limit = 20, page = 1 } = paginacion;
  const offset = (page - 1) * limit;
  const where = { finca_id: fincaId, estado: 'FALLECIDO' };

  if (filtros.fechaInicio && filtros.fechaFin) {
    where.updated_at = { [sequelize.Op.between]: [filtros.fechaInicio, filtros.fechaFin] };
  } else if (filtros.fechaInicio) {
    where.updated_at = { [sequelize.Op.gte]: filtros.fechaInicio };
  } else if (filtros.fechaFin) {
    where.updated_at = { [sequelize.Op.lte]: filtros.fechaFin };
  }

  if (filtros.razaId) where.raza_id = filtros.razaId;
  if (filtros.sexo) where.sexo = filtros.sexo;

  const include = [
    { model: Raza, as: 'raza', attributes: ['id', 'nombre'] },
    { model: Finca, as: 'finca', attributes: ['id', 'nombre'] },
    { model: Potrero, as: 'potrero', attributes: ['id', 'nombre'] },
  ];

  const { rows, count } = await Animal.findAndCountAll({
    where,
    include,
    attributes: ['id', 'arete', 'nombre', 'sexo', 'fecha_nacimiento', 'updated_at', 'observaciones'],
    order: [['updated_at', 'DESC']],
    limit,
    offset,
    distinct: true,
  });

  const totalPages = Math.ceil(count / limit);

  const mortalidadPorRaza = await Animal.findAll({
    where: { finca_id: fincaId, estado: 'FALLECIDO' },
    include: [{ model: Raza, as: 'raza', attributes: ['nombre'] }],
    attributes: [
      [sequelize.col('raza.nombre'), 'raza'],
      [sequelize.fn('COUNT', sequelize.col('id')), 'cantidad'],
    ],
    group: ['raza.id', 'raza.nombre'],
    raw: true,
  });

  return {
    data: rows,
    pagination: { page: parseInt(page, 10), limit: parseInt(limit, 10), total: count, totalPages },
    mortalidadPorRaza,
    filters: filtros,
  };
}

async function obtenerReportePorRaza(fincaId, filtros = {}) {
  const where = { finca_id: fincaId };

  if (filtros.razaId) where.raza_id = filtros.razaId;

  const razas = await Raza.findAll({
    where: { estado: 'ACTIVA' },
    include: [
      {
        model: Animal,
        as: 'animales',
        where,
        required: false,
        attributes: ['id', 'sexo', 'estado', 'fecha_nacimiento'],
      },
    ],
    attributes: ['id', 'nombre'],
  });

  const resultado = await Promise.all(
    razas.map(async (raza) => {
      const animales = raza.animales || [];
      const total = animales.length;
      const machos = animales.filter((a) => a.sexo === 'MACHO').length;
      const hembras = animales.filter((a) => a.sexo === 'HEMBRA').length;
      const vendidos = animales.filter((a) => a.estado === 'VENDIDO').length;
      const fallecidos = animales.filter((a) => a.estado === 'FALLECIDO').length;
      const activos = animales.filter((a) => a.estado === 'ACTIVO').length;

      let sumaEdades = 0;
      animales.forEach((a) => {
        if (a.fecha_nacimiento) {
          const edad = (Date.now() - new Date(a.fecha_nacimiento).getTime()) / (365.25 * 24 * 60 * 60 * 1000);
          sumaEdades += edad;
        }
      });
      const edadPromedio = total > 0 ? sumaEdades / total : 0;

      const pesoPromedio = await Pesaje.findOne({
        include: [
          { model: Animal, as: 'animal', where: { finca_id: fincaId, raza_id: raza.id }, required: true },
        ],
        attributes: [[sequelize.fn('AVG', sequelize.col('peso')), 'promedio']],
        raw: true,
      });

      return {
        raza: raza.nombre,
        total,
        machos,
        hembras,
        activos,
        vendidos,
        fallecidos,
        edadPromedio: Math.round(edadPromedio * 10) / 10,
        pesoPromedio: parseFloat(pesoPromedio?.promedio || 0),
      };
    })
  );

  return resultado.filter((r) => r.total > 0);
}

async function obtenerReportePorFinca(fincaId, filtros = {}) {
  const fincas = await Finca.findAll({
    where: { id: fincaId, estado: 'ACTIVA' },
    include: [
      {
        model: Potrero,
        as: 'potreros',
        required: false,
      },
    ],
  });

  const resultado = await Promise.all(
    fincas.map(async (finca) => {
      const animalesQuery = { finca_id: finca.id };
      if (filtros.estado) animalesQuery.estado = filtros.estado;

      const animales = await Animal.findAll({ where: animalesQuery });
      const total = animales.length;
      const machos = animales.filter((a) => a.sexo === 'MACHO').length;
      const hembras = animales.filter((a) => a.sexo === 'HEMBRA').length;

      let sumaEdades = 0;
      animales.forEach((a) => {
        if (a.fecha_nacimiento) {
          const edad = (Date.now() - new Date(a.fecha_nacimiento).getTime()) / (365.25 * 24 * 60 * 60 * 1000);
          sumaEdades += edad;
        }
      });
      const edadPromedio = total > 0 ? Math.round((sumaEdades / total) * 10) / 10 : 0;

      const ventas = await Venta.findOne({
        where: { finca_id: finca.id, estado: 'COMPLETADA' },
        attributes: [[sequelize.fn('SUM', sequelize.col('total')), 'total']],
        raw: true,
      });

      const fallecidos = animales.filter((a) => a.estado === 'FALLECIDO').length;

      const potreros = (finca.potreros || []).map((potrero) => ({
        id: potrero.id,
        nombre: potrero.nombre,
        capacidad: potrero.capacidad,
        superficie: potrero.superficie,
      }));

      return {
        finca: finca.nombre,
        total,
        machos,
        hembras,
        edadPromedio,
        ventas: parseFloat(ventas?.total || 0),
        fallecidos,
        potreros,
      };
    })
  );

  return resultado;
}

async function obtenerReporteReproduccion(fincaId, filtros = {}, paginacion = {}) {
  const { limit = 20, page = 1 } = paginacion;
  const offset = (page - 1) * limit;
  const where = {};

  if (filtros.fechaInicio && filtros.fechaFin) {
    where.fecha = { [sequelize.Op.between]: [filtros.fechaInicio, filtros.fechaFin] };
  } else if (filtros.fechaInicio) {
    where.fecha = { [sequelize.Op.gte]: filtros.fechaInicio };
  } else if (filtros.fechaFin) {
    where.fecha = { [sequelize.Op.lte]: filtros.fechaFin };
  }

  const hembras = await Animal.findAll({
    where: { finca_id: fincaId, sexo: 'HEMBRA' },
    attributes: ['id', 'arete', 'nombre'],
  });

  const include = [
    {
      model: Animal,
      as: 'animal',
      where: { finca_id: fincaId },
      required: true,
      attributes: ['id', 'arete', 'nombre'],
    },
    {
      model: Animal,
      as: 'madre',
      required: false,
      attributes: ['id', 'arete', 'nombre'],
    },
  ];

  const { rows: reproducciones, count: countReproducciones } = await Reproduccion.findAndCountAll({
    where,
    include,
    attributes: ['id', 'fecha', 'tipo', 'resultado', 'observaciones'],
    order: [['fecha', 'DESC']],
    limit,
    offset,
    distinct: true,
  });

  const { rows: partos, count: countPartos } = await Parto.findAndCountAll({
    where,
    include,
    attributes: ['id', 'fecha', 'cantidad_crias', 'observaciones'],
    order: [['fecha', 'DESC']],
    limit,
    offset,
    distinct: true,
  });

  const totalHembras = hembras.length;
  const gestaciones = reproducciones.filter((r) => r.resultado === 'EXITOSO').length;
  const abortos = reproducciones.filter((r) => r.resultado === 'FALLIDO').length;
  const criasNacidas = partos.reduce((sum, p) => sum + p.cantidad_crias, 0);
  const tasaNatalidad = totalHembras > 0 ? Math.round((criasNacidas / totalHembras) * 100) / 100 : 0;

  return {
    reproducciones,
    partos,
    resumen: {
      totalHembras,
      gestaciones,
      abortos,
      criasNacidas,
      tasaNatalidad,
    },
    pagination: {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      total: countReproducciones + countPartos,
      totalPages: Math.ceil((countReproducciones + countPartos) / limit),
    },
    filters: filtros,
  };
}

async function obtenerReporteMovimientosAnimales(fincaId, filtros = {}) {
  const where = {};

  if (filtros.fechaInicio && filtros.fechaFin) {
    where.fecha = { [sequelize.Op.between]: [filtros.fechaInicio, filtros.fechaFin] };
  } else if (filtros.fechaInicio) {
    where.fecha = { [sequelize.Op.gte]: filtros.fechaInicio };
  } else if (filtros.fechaFin) {
    where.fecha = { [sequelize.Op.lte]: filtros.fechaFin };
  }

  if (filtros.animalId) where.animal_id = filtros.animalId;

  const movimientos = await Movimiento.findAll({
    where,
    include: [
      {
        model: Animal,
        as: 'animal',
        where: { finca_id: fincaId },
        required: true,
        attributes: ['id', 'arete', 'nombre', 'sexo'],
      },
      {
        model: Potrero,
        as: 'potrero_origen',
        required: false,
        attributes: ['id', 'nombre'],
      },
      {
        model: Potrero,
        as: 'potrero_destino',
        required: false,
        attributes: ['id', 'nombre'],
      },
      {
        model: Usuario,
        as: 'usuario',
        required: false,
        attributes: ['id', 'nombre'],
      },
    ],
    attributes: ['id', 'fecha', 'tipo', 'motivo', 'observaciones'],
    order: [['fecha', 'DESC']],
  });

  const porTipo = await Movimiento.findAll({
    where: {
      ...where,
      animal_id: {
        [sequelize.Op.in]: sequelize.literal(`(SELECT id FROM animales WHERE finca_id = ${fincaId})`),
      },
    },
    attributes: [
      'tipo',
      [sequelize.fn('COUNT', sequelize.col('id')), 'cantidad'],
    ],
    group: ['tipo'],
    raw: true,
  });

  return {
    data: movimientos,
    resumen: {
      totalMovimientos: movimientos.length,
      porTipo: porTipo.map((m) => ({
        tipo: m.tipo,
        cantidad: parseInt(m.cantidad || 0, 10),
      })),
    },
    filters: filtros,
  };
}

async function obtenerReportePoblacion(fincaId, filtros = {}) {
  const periodos = [];
  const ahora = new Date();
  const meses = filtros.meses || 12;

  for (let i = meses - 1; i >= 0; i--) {
    const fecha = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1);
    const siguienteMes = new Date(ahora.getFullYear(), ahora.getMonth() - i + 1, 1);

    const poblacionInicial = await Animal.count({
      where: {
        finca_id: fincaId,
        created_at: { [sequelize.Op.lt]: siguienteMes },
      },
    });

    const nacimientos = await Animal.count({
      where: {
        finca_id: fincaId,
        created_at: { [sequelize.Op.between]: [fecha, siguienteMes] },
      },
    });

    const ventas = await Venta.count({
      where: {
        finca_id: fincaId,
        estado: 'COMPLETADA',
        fecha: { [sequelize.Op.between]: [fecha, siguienteMes] },
      },
    });

    const fallecimientos = await Animal.count({
      where: {
        finca_id: fincaId,
        estado: 'FALLECIDO',
        updated_at: { [sequelize.Op.between]: [fecha, siguienteMes] },
      },
    });

    const traslados = await Movimiento.count({
      where: {
        fecha: { [sequelize.Op.between]: [fecha, siguienteMes] },
        animal_id: {
          [sequelize.Op.in]: sequelize.literal(`(SELECT id FROM animales WHERE finca_id = ${fincaId})`),
        },
      },
    });

    periodos.push({
      mes: fecha.toISOString().slice(0, 7),
      poblacionInicial,
      nacimientos,
      ventas,
      fallecimientos,
      traslados,
      poblacionFinal: poblacionInicial + nacimientos - ventas - fallecimientos,
    });
  }

  return periodos;
}

module.exports = {
  obtenerDashboard,
  obtenerReporteAnimales,
  obtenerReporteMovimientos,
  obtenerReporteSalud,
  obtenerReporteVentas,
  obtenerReporteInventario,
  obtenerReporteMortalidad,
  obtenerReportePorRaza,
  obtenerReportePorFinca,
  obtenerReporteReproduccion,
  obtenerReporteMovimientosAnimales,
  obtenerReportePoblacion,
};
