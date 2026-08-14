const bcrypt = require('bcryptjs');
const { Usuario, Finca } = require('../models');
const { Auditoria } = require('../models');

async function listarUsuarios() {
  return await Usuario.findAll({
    include: [{ model: Finca, as: 'finca', attributes: ['id', 'nombre'] }],
    attributes: { exclude: ['password'] },
  });
}

async function obtenerUsuarioPorId(id) {
  const usuario = await Usuario.findByPk(id, {
    include: [{ model: Finca, as: 'finca', attributes: ['id', 'nombre'] }],
    attributes: { exclude: ['password'] },
  });

  if (!usuario) {
    throw new Error('Usuario no encontrado');
  }

  return usuario;
}

async function crearUsuario(datos, usuarioActualId, ip) {
  const existeEmail = await Usuario.findOne({ where: { email: datos.email } });

  if (existeEmail) {
    throw new Error('El correo electrónico ya está registrado');
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(datos.password, salt);

  const usuario = await Usuario.create({
    ...datos,
    password: passwordHash,
  });

  await Auditoria.create({
    usuario_id: usuarioActualId,
    accion: 'CREACION',
    entidad: 'Usuario',
    entidad_id: usuario.id,
    datos_nuevos: usuario.toJSON(),
    ip,
  });

  const { password: _, ...usuarioSinPassword } = usuario.toJSON();

  return usuarioSinPassword;
}

async function actualizarUsuario(id, datos, usuarioActualId, ip) {
  const usuario = await Usuario.findByPk(id);

  if (!usuario) {
    throw new Error('Usuario no encontrado');
  }

  const datosAnteriores = usuario.toJSON();

  if (datos.password) {
    const salt = await bcrypt.genSalt(10);
    datos.password = await bcrypt.hash(datos.password, salt);
  }

  await usuario.update(datos);

  await Auditoria.create({
    usuario_id: usuarioActualId,
    accion: 'MODIFICACION',
    entidad: 'Usuario',
    entidad_id: id,
    datos_anteriores: datosAnteriores,
    datos_nuevos: usuario.toJSON(),
    ip,
  });

  const { password: _, ...usuarioSinPassword } = usuario.toJSON();

  return usuarioSinPassword;
}

async function eliminarUsuario(id, usuarioActualId, ip) {
  const usuario = await Usuario.findByPk(id);

  if (!usuario) {
    throw new Error('Usuario no encontrado');
  }

  const datosAnteriores = usuario.toJSON();

  await usuario.update({ activo: false });

  await Auditoria.create({
    usuario_id: usuarioActualId,
    accion: 'CAMBIO_ESTADO',
    entidad: 'Usuario',
    entidad_id: id,
    datos_anteriores: datosAnteriores,
    datos_nuevos: usuario.toJSON(),
    ip,
  });

  return true;
}

module.exports = {
  listarUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
};
