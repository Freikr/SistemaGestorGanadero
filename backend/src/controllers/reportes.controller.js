const { query, param } = require('express-validator');
const reportesService = require('../services/reportes.service');
const authMiddleware = require('../middleware/auth');
const permisosMiddleware = require('../middleware/permisos');
const { buildPDFStream } = require('../services/exporters/pdfExporter');
const { buildExcelStream } = require('../services/exporters/excelExporter');
const { buildCSVStream } = require('../services/exporters/csvExporter');
const { buildPagination, buildSort } = require('../utils/reportHelpers');

function validarErrores(req, res, next) {
  const errores = require('express-validator').validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({
      success: false,
      mensaje: 'Errores de validación',
      errores: errores.array().map((err) => err.msg),
    });
  }
  next();
}

function extraerFiltrosComunes(req) {
  return {
    fincaId: req.user.finca_id,
    page: parseInt(req.query.page, 10) || undefined,
    limit: parseInt(req.query.limit, 10) || undefined,
    sortBy: req.query.sortBy,
    sortOrder: req.query.sortOrder,
  };
}

function aplicarPaginacionYOrden(query, req) {
  const paginacion = buildPagination({ page: req.query.page, limit: req.query.limit });
  query.limit = paginacion.limit;
  query.offset = paginacion.offset;

  const sort = buildSort(req.query.sortBy, req.query.sortOrder);
  query.order = sort;

  return { ...query, paginacion };
}

async function dashboard(req, res) {
  try {
    const datos = await reportesService.obtenerDashboard(req.user.finca_id);
    res.json({ success: true, data: datos });
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
}

async function reporteAnimales(req, res) {
  try {
    const { fincaId } = extraerFiltrosComunes(req);
    const { paginacion, ...filtros } = aplicarPaginacionYOrden({}, req);
    filtros.fincaId = fincaId;
    filtros.especieId = req.query.especieId;
    filtros.razaId = req.query.razaId;
    filtros.sexo = req.query.sexo;
    filtros.estado = req.query.estado;
    filtros.edadMin = req.query.edadMin ? parseInt(req.query.edadMin, 10) : undefined;
    filtros.edadMax = req.query.edadMax ? parseInt(req.query.edadMax, 10) : undefined;

    const datos = await reportesService.obtenerReporteAnimales(filtros, paginacion);
    res.json({ success: true, data: datos });
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
}

async function reporteMovimientos(req, res) {
  try {
    const { fincaId } = extraerFiltrosComunes(req);
    const { paginacion } = aplicarPaginacionYOrden({}, req);
    const filtros = {
      fincaId,
      fechaInicio: req.query.fechaInicio,
      fechaFin: req.query.fechaFin,
      animalId: req.query.animalId,
    };

    const datos = await reportesService.obtenerReporteMovimientos(filtros, paginacion);
    res.json({ success: true, data: datos });
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
}

async function reporteSalud(req, res) {
  try {
    const { fincaId } = extraerFiltrosComunes(req);
    const { paginacion } = aplicarPaginacionYOrden({}, req);
    const filtros = {
      fincaId,
      fechaInicio: req.query.fechaInicio,
      fechaFin: req.query.fechaFin,
      animalId: req.query.animalId,
      vacunaId: req.query.vacunaId,
    };

    const datos = await reportesService.obtenerReporteSalud(filtros, paginacion);
    res.json({ success: true, data: datos });
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
}

async function reporteVacunas(req, res) {
  try {
    const { fincaId } = extraerFiltrosComunes(req);
    const { paginacion } = aplicarPaginacionYOrden({}, req);
    const filtros = {
      fincaId,
      fechaInicio: req.query.fechaInicio,
      fechaFin: req.query.fechaFin,
      animalId: req.query.animalId,
      vacunaId: req.query.vacunaId,
      estado: req.query.estado,
    };

    const datos = await reportesService.obtenerReporteVacunas(filtros, paginacion);
    res.json({ success: true, data: datos });
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
}

async function reporteVentas(req, res) {
  try {
    const { fincaId } = extraerFiltrosComunes(req);
    const { paginacion } = aplicarPaginacionYOrden({}, req);
    const filtros = {
      fincaId,
      fechaInicio: req.query.fechaInicio,
      fechaFin: req.query.fechaFin,
      usuarioId: req.query.usuarioId,
      cliente: req.query.cliente,
      animalId: req.query.animalId,
      razaId: req.query.razaId,
      sexo: req.query.sexo,
    };

    const datos = await reportesService.obtenerReporteVentas(filtros, paginacion);
    res.json({ success: true, data: datos });
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
}

async function reporteIngresos(req, res) {
  try {
    const { fincaId } = extraerFiltrosComunes(req);
    const filtros = {
      fincaId,
      periodo: req.query.periodo || 'mes',
      fechaInicio: req.query.fechaInicio,
      fechaFin: req.query.fechaFin,
    };

    const datos = await reportesService.obtenerReporteIngresos(filtros);
    res.json({ success: true, data: datos });
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
}

async function reporteInventario(req, res) {
  try {
    const { fincaId } = extraerFiltrosComunes(req);
    const filtros = {
      fincaId,
      categoria: req.query.categoria,
      estado: req.query.estado,
    };

    const datos = await reportesService.obtenerReporteInventario(filtros);
    res.json({ success: true, data: datos });
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
}

async function reporteMortalidad(req, res) {
  try {
    const { fincaId } = extraerFiltrosComunes(req);
    const { paginacion } = aplicarPaginacionYOrden({}, req);
    const filtros = {
      fincaId,
      fechaInicio: req.query.fechaInicio,
      fechaFin: req.query.fechaFin,
      razaId: req.query.razaId,
      sexo: req.query.sexo,
    };

    const datos = await reportesService.obtenerReporteMortalidad(filtros, paginacion);
    res.json({ success: true, data: datos });
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
}

async function reportePoblacion(req, res) {
  try {
    const { fincaId } = extraerFiltrosComunes(req);
    const filtros = {
      fincaId,
      meses: req.query.meses ? parseInt(req.query.meses, 10) : 12,
    };

    const datos = await reportesService.obtenerReportePoblacion(filtros);
    res.json({ success: true, data: datos });
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
}

async function reportePorRaza(req, res) {
  try {
    const { fincaId } = extraerFiltrosComunes(req);
    const filtros = {
      fincaId,
      razaId: req.query.razaId,
    };

    const datos = await reportesService.obtenerReportePorRaza(filtros);
    res.json({ success: true, data: datos });
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
}

async function reportePorFinca(req, res) {
  try {
    const { fincaId } = extraerFiltrosComunes(req);
    const filtros = {
      fincaId,
      estado: req.query.estado,
    };

    const datos = await reportesService.obtenerReportePorFinca(filtros);
    res.json({ success: true, data: datos });
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
}

async function reportePorPotrero(req, res) {
  try {
    const { fincaId } = extraerFiltrosComunes(req);
    const filtros = {
      fincaId,
    };

    const datos = await reportesService.obtenerReportePorPotrero(filtros);
    res.json({ success: true, data: datos });
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
}

async function reporteReproduccion(req, res) {
  try {
    const { fincaId } = extraerFiltrosComunes(req);
    const { paginacion } = aplicarPaginacionYOrden({}, req);
    const filtros = {
      fincaId,
      fechaInicio: req.query.fechaInicio,
      fechaFin: req.query.fechaFin,
    };

    const datos = await reportesService.obtenerReporteReproduccion(filtros, paginacion);
    res.json({ success: true, data: datos });
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
}

async function exportar(req, res, exporter) {
  try {
    const tipo = req.query.tipo;
    if (!tipo) {
      return res.status(400).json({ success: false, mensaje: 'El tipo de reporte es requerido' });
    }

    const fincaId = req.user.finca_id;
    const usuario = req.user;
    const titulo = `Reporte ${tipo.toUpperCase()}`;

    if (exporter === 'pdf') {
      await reportesService.exportarPDF(fincaId, tipo, (doc, datos) => {
        buildPDFStream(res, titulo, usuario, (documento) => {
          documento.text(`Tipo: ${tipo}`);
          documento.moveDown();
          reportesService.escribirPDF(datos, tipo, documento);
        });
      });
    } else if (exporter === 'excel') {
      await buildExcelStream(res, titulo, async (worksheet) => {
        const datos = await reportesService.obtenerDatosExportacion(fincaId, tipo);
        reportesService.escribirExcel(datos, tipo, worksheet);
      });
    } else if (exporter === 'csv') {
      buildCSVStream(res, titulo, () => {
        return reportesService.generarCSV(fincaId, tipo);
      });
    } else {
      res.status(400).json({ success: false, mensaje: 'Formato de exportación no soportado' });
    }
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
}

async function exportarPDF(req, res) {
  await exportar(req, res, 'pdf');
}

async function exportarExcel(req, res) {
  await exportar(req, res, 'excel');
}

async function exportarCSV(req, res) {
  await exportar(req, res, 'csv');
}

module.exports = {
  dashboard,
  reporteAnimales,
  reporteMovimientos,
  reporteSalud,
  reporteVacunas,
  reporteVentas,
  reporteIngresos,
  reporteInventario,
  reporteMortalidad,
  reportePoblacion,
  reportePorRaza,
  reportePorFinca,
  reportePorPotrero,
  reporteReproduccion,
  exportarPDF,
  exportarExcel,
  exportarCSV,
  validarErrores,
  validaciones: {
    animales: [
      query('especieId').optional().isInt(),
      query('razaId').optional().isInt(),
      query('sexo').optional().isIn(['MACHO', 'HEMBRA']),
      query('estado').optional().isIn(['ACTIVO', 'VENDIDO', 'FALLECIDO', 'EN_TRATAMIENTO']),
      query('edadMin').optional().isInt({ min: 0 }),
      query('edadMax').optional().isInt({ min: 0 }),
      query('limit').optional().isInt({ min: 1, max: 100 }),
      query('page').optional().isInt({ min: 1 }),
      query('sortBy').optional().isString(),
      query('sortOrder').optional().isIn(['ASC', 'DESC']),
      validarErrores,
    ],
    ventas: [
      query('fechaInicio').optional().isISO8601().toDate(),
      query('fechaFin').optional().isISO8601().toDate(),
      query('cliente').optional().isString(),
      query('animalId').optional().isInt(),
      query('razaId').optional().isInt(),
      query('sexo').optional().isIn(['MACHO', 'HEMBRA']),
      query('limit').optional().isInt({ min: 1, max: 100 }),
      query('page').optional().isInt({ min: 1 }),
      query('sortBy').optional().isString(),
      query('sortOrder').optional().isIn(['ASC', 'DESC']),
      validarErrores,
    ],
    movimientos: [
      query('fechaInicio').optional().isISO8601().toDate(),
      query('fechaFin').optional().isISO8601().toDate(),
      query('animalId').optional().isInt(),
      query('limit').optional().isInt({ min: 1, max: 100 }),
      query('page').optional().isInt({ min: 1 }),
      query('sortBy').optional().isString(),
      query('sortOrder').optional().isIn(['ASC', 'DESC']),
      validarErrores,
    ],
    salud: [
      query('fechaInicio').optional().isISO8601().toDate(),
      query('fechaFin').optional().isISO8601().toDate(),
      query('animalId').optional().isInt(),
      query('vacunaId').optional().isInt(),
      query('limit').optional().isInt({ min: 1, max: 100 }),
      query('page').optional().isInt({ min: 1 }),
      query('sortBy').optional().isString(),
      query('sortOrder').optional().isIn(['ASC', 'DESC']),
      validarErrores,
    ],
    vacunas: [
      query('fechaInicio').optional().isISO8601().toDate(),
      query('fechaFin').optional().isISO8601().toDate(),
      query('animalId').optional().isInt(),
      query('vacunaId').optional().isInt(),
      query('estado').optional().isIn(['PENDIENTE', 'PROXIMA', 'VENCIDA']),
      query('limit').optional().isInt({ min: 1, max: 100 }),
      query('page').optional().isInt({ min: 1 }),
      query('sortBy').optional().isString(),
      query('sortOrder').optional().isIn(['ASC', 'DESC']),
      validarErrores,
    ],
    reproduccion: [
      query('fechaInicio').optional().isISO8601().toDate(),
      query('fechaFin').optional().isISO8601().toDate(),
      query('limit').optional().isInt({ min: 1, max: 100 }),
      query('page').optional().isInt({ min: 1 }),
      query('sortBy').optional().isString(),
      query('sortOrder').optional().isIn(['ASC', 'DESC']),
      validarErrores,
    ],
    mortalidad: [
      query('fechaInicio').optional().isISO8601().toDate(),
      query('fechaFin').optional().isISO8601().toDate(),
      query('razaId').optional().isInt(),
      query('sexo').optional().isIn(['MACHO', 'HEMBRA']),
      query('limit').optional().isInt({ min: 1, max: 100 }),
      query('page').optional().isInt({ min: 1 }),
      query('sortBy').optional().isString(),
      query('sortOrder').optional().isIn(['ASC', 'DESC']),
      validarErrores,
    ],
    poblacion: [
      query('meses').optional().isInt({ min: 1, max: 60 }),
      validarErrores,
    ],
  },
  middleware: [authMiddleware, permisosMiddleware(['ADMINISTRADOR', 'DUEÑO', 'VETERINARIO', 'EMPLEADO'])],
};
