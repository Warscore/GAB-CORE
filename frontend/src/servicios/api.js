const URL_POR_DEFECTO = 'https://gab-core-backend.onrender.com/api';

export const API_URL = (import.meta.env.VITE_API_URL || URL_POR_DEFECTO).replace(/\/+$/, '');

/**
 * Centraliza las solicitudes HTTP del frontend sin cambiar los endpoints
 * que ya consume el backend.
 */
async function solicitar(ruta, opciones = {}) {
  const encabezados = { ...(opciones.headers || {}) };

  if (opciones.body !== undefined && !encabezados['Content-Type']) {
    encabezados['Content-Type'] = 'application/json';
  }

  let respuesta;
  try {
    respuesta = await fetch(`${API_URL}${ruta.startsWith('/') ? ruta : `/${ruta}`}`, {
      ...opciones,
      headers: encabezados,
    });
  } catch {
    throw new Error('No se pudo conectar con el servidor. Verifica la URL de la API y tu conexión.');
  }

  const texto = await respuesta.text();
  let datos = null;

  if (texto) {
    try {
      datos = JSON.parse(texto);
    } catch {
      datos = { mensaje: texto };
    }
  }

  if (!respuesta.ok) {
    throw new Error(
      datos?.error || datos?.mensaje || `La solicitud falló (HTTP ${respuesta.status}).`
    );
  }

  return datos;
}

export function obtener(ruta) {
  return solicitar(ruta, { method: 'GET' });
}

export function enviar(ruta, contenido) {
  return solicitar(ruta, {
    method: 'POST',
    body: JSON.stringify(contenido),
  });
}

export function actualizar(ruta, contenido) {
  const opciones = { method: 'PUT' };

  if (contenido !== undefined) {
    opciones.body = JSON.stringify(contenido);
  }

  return solicitar(ruta, opciones);
}
