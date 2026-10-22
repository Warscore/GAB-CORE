import { useCallback, useEffect, useState } from 'react';
import { actualizar, enviar, obtener } from '../servicios/api';

/**
 * Estado compartido y operaciones del negocio.
 * Las pantallas reciben datos y callbacks; no necesitan conocer la API.
 */
export default function useGAPCore() {
  const [temaOscuro, setTemaOscuro] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [paginaActiva, setPaginaActiva] = useState('productos');
  const [busqueda, setBusqueda] = useState('');
  const [carrito, setCarrito] = useState([]);

  const [productos, setProductos] = useState([]);
  const [productosCargando, setProductosCargando] = useState(true);
  const [errorProductos, setErrorProductos] = useState('');
  const [clientesAdmin, setClientesAdmin] = useState([]);
  const [ventasAdmin, setVentasAdmin] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [equipos, setEquipos] = useState([]);

  const [errorAuth, setErrorAuth] = useState('');
  const [autenticando, setAutenticando] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', temaOscuro ? 'dark' : 'light');
  }, [temaOscuro]);

  useEffect(() => {
    let cancelado = false;

    async function cargarProductos() {
      setProductosCargando(true);
      setErrorProductos('');

      try {
        const datos = await obtener('/productos');
        if (!Array.isArray(datos)) {
          throw new Error('El servidor no devolvió una lista válida de productos.');
        }
        if (!cancelado) setProductos(datos);
      } catch (error) {
        if (!cancelado) {
          setErrorProductos(error.message || 'No se pudo cargar el catálogo.');
          console.error('Error cargando productos:', error);
        }
      } finally {
        if (!cancelado) setProductosCargando(false);
      }
    }

    cargarProductos();
    return () => {
      cancelado = true;
    };
  }, []);

  const cargarDatos = useCallback(async (usuarioActual = usuario) => {
    if (!usuarioActual) return;

    try {
      const esAdmin = usuarioActual.rol === 'admin';
      const parametros = `cliente_id=${encodeURIComponent(usuarioActual.id)}&esAdmin=${esAdmin}`;

      const datosTickets = await obtener(`/tickets?${parametros}`);
      if (Array.isArray(datosTickets)) setTickets(datosTickets);

      const datosEquipos = await obtener(`/equipos?${parametros}`);
      if (Array.isArray(datosEquipos)) setEquipos(datosEquipos);

      if (esAdmin) {
        const datosClientes = await obtener('/admin/clientes');
        if (Array.isArray(datosClientes)) setClientesAdmin(datosClientes);

        const datosVentas = await obtener('/admin/ordenes');
        if (Array.isArray(datosVentas)) setVentasAdmin(datosVentas);
      } else {
        // Evita conservar datos administrativos al cambiar de cuenta.
        setClientesAdmin([]);
        setVentasAdmin([]);
      }
    } catch (error) {
      console.error('Error cargando datos del usuario:', error);
    }
  }, [usuario]);

  useEffect(() => {
    if (usuario) cargarDatos(usuario);
  }, [usuario, cargarDatos]);

  const iniciarSesion = async ({ correo, contrasena }) => {
    setErrorAuth('');
    setAutenticando(true);

    try {
      const datos = await enviar('/clientes/login', { correo, contrasena });
      if (!datos || datos.id === undefined || !datos.rol) {
        throw new Error('El servidor no devolvió los datos esperados de la cuenta.');
      }

      setUsuario(datos);
      setPaginaActiva(datos.rol === 'admin' ? 'admin' : 'productos');
      setBusqueda('');
      return true;
    } catch (error) {
      setErrorAuth(error.message || 'No se pudo conectar con el servidor.');
      return false;
    } finally {
      setAutenticando(false);
    }
  };

  const registrarCliente = async (nuevo) => {
    try {
      await enviar('/clientes/registro', {
        tipo_documento: nuevo.docTipo,
        numero_documento: nuevo.docNum,
        nombre_razon_social: nuevo.nombre,
        correo: nuevo.correo,
        telefono: nuevo.telefono,
        ciudad: nuevo.ciudad,
        contrasena: nuevo.pass,
      });
      window.alert('¡Registro guardado exitosamente en Supabase!');
      return true;
    } catch (error) {
      window.alert(error.message || 'Error al registrar el cliente.');
      return false;
    }
  };

  const cerrarSesion = () => {
    setUsuario(null);
    setPaginaActiva('productos');
    setBusqueda('');
    setCarrito([]);
    setTickets([]);
    setEquipos([]);
    setClientesAdmin([]);
    setVentasAdmin([]);
    setErrorAuth('');
  };

  const agregarAlCarrito = (producto) => {
    setCarrito((actual) => {
      const existente = actual.find((item) => item.id === producto.id);
      if (existente) {
        return actual.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...actual, { ...producto, cantidad: 1 }];
    });
    window.alert('Agregado al carrito');
  };

  const actualizarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      setCarrito((actual) => actual.filter((item) => item.id !== id));
      return;
    }

    setCarrito((actual) =>
      actual.map((item) => item.id === id ? { ...item, cantidad: nuevaCantidad } : item)
    );
  };

  const eliminarDelCarrito = (id) => {
    setCarrito((actual) => actual.filter((item) => item.id !== id));
  };

  const vaciarCarrito = () => setCarrito([]);

  const crearTicket = async (nuevoTicket) => {
    if (!usuario) return false;

    try {
      await enviar('/tickets', {
        cliente_id: usuario.id,
        asunto: nuevoTicket.asunto,
        categoria: nuevoTicket.categoria,
        prioridad: nuevoTicket.prioridad,
        descripcion: nuevoTicket.descripcion,
      });
      await cargarDatos(usuario);
      window.alert('Ticket creado con éxito.');
      return true;
    } catch (error) {
      window.alert(error.message || 'Error al crear el ticket.');
      return false;
    }
  };

  const resolverTicket = async (id) => {
    try {
      await actualizar(`/tickets/${id}/resolver`);
      await cargarDatos(usuario);
      return true;
    } catch (error) {
      window.alert(error.message || 'No se pudo resolver el ticket.');
      return false;
    }
  };

  return {
    temaOscuro,
    setTemaOscuro,
    usuario,
    paginaActiva,
    setPaginaActiva,
    busqueda,
    setBusqueda,
    carrito,
    productos,
    productosCargando,
    errorProductos,
    clientesAdmin,
    ventasAdmin,
    tickets,
    equipos,
    errorAuth,
    autenticando,
    iniciarSesion,
    registrarCliente,
    cerrarSesion,
    agregarAlCarrito,
    actualizarCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
    crearTicket,
    resolverTicket,
    recargarDatos: () => cargarDatos(usuario),
  };
}
