// Entregable 2 - Simulador de pedido con DOM y eventos

const productos = [
  { id: 1, nombre: "Empanadas", precio: 900 },
  { id: 2, nombre: "Pizza Napolitana", precio: 9500 },
  { id: 3, nombre: "Pizza Fugazzetta", precio: 9800 },
  { id: 4, nombre: "Pizza de Jamon y Morrones", precio: 10500 },
  { id: 5, nombre: "Pizza Muzzarella", precio: 8500 }
];

const STORAGE_KEY = "carritoPizzeria";
const CONFIG_STORAGE_KEY = "configPedidoPizzeria";
const COSTO_ENVIO = 1500;

class ItemCarrito {
  constructor(producto, cantidad) {
    this.id = producto.id;
    this.nombre = producto.nombre;
    this.precioUnitario = producto.precio;
    this.cantidad = cantidad;
  }

  subtotal() {
    return this.precioUnitario * this.cantidad;
  }
}

let carrito = [];
let configuracionPedido = null;

const btnIniciar = document.getElementById("btn-iniciar");
const seccionPedido = document.getElementById("seccion-pedido");
const formPedido = document.getElementById("form-pedido");
const selectProducto = document.getElementById("select-producto");
const inputCantidad = document.getElementById("input-cantidad");
const selectEntrega = document.getElementById("select-entrega");
const selectPago = document.getElementById("select-pago");
const infoOpciones = document.getElementById("info-opciones");
const mensaje = document.getElementById("mensaje");
const listaCarrito = document.getElementById("lista-carrito");
const outSubtotal = document.getElementById("out-subtotal");
const outEnvio = document.getElementById("out-envio");
const outDescuento = document.getElementById("out-descuento");
const outTotal = document.getElementById("out-total");
const btnVaciar = document.getElementById("btn-vaciar");
const btnConfirmar = document.getElementById("btn-confirmar");

function formatearMoneda(valor) {
  return "$" + valor.toLocaleString("es-AR");
}

function obtenerPorcentajeDescuento(pagoSeleccionado) {
  if (pagoSeleccionado === "efectivo") {
    return 0.2;
  }
  if (pagoSeleccionado === "santander") {
    return 0.1;
  }
  return 0;
}

function obtenerTextoEntrega(entregaSeleccionada) {
  return entregaSeleccionada === "delivery" ? "Delivery" : "Takeaway";
}

function obtenerTextoPago(pagoSeleccionado) {
  if (pagoSeleccionado === "efectivo") {
    return "Efectivo";
  }
  if (pagoSeleccionado === "santander") {
    return "Santander";
  }
  return "Transferencia";
}

function obtenerTextoBeneficioPago(pagoSeleccionado) {
  if (pagoSeleccionado === "efectivo") {
    return "20% de descuento";
  }
  if (pagoSeleccionado === "santander") {
    return "10% de descuento";
  }
  return "sin descuento";
}

function guardarCarritoEnStorage(carritoActual) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(carritoActual));
}

function cargarCarritoDesdeStorage() {
  const contenido = localStorage.getItem(STORAGE_KEY);
  if (!contenido) {
    return [];
  }

  try {
    const datos = JSON.parse(contenido);
    if (!Array.isArray(datos)) {
      return [];
    }

    return datos.map((itemGuardado) => {
      const producto = productos.find((p) => p.id === Number(itemGuardado.id));

      if (!producto) {
        return new ItemCarrito(
          {
            id: Number(itemGuardado.id),
            nombre: itemGuardado.nombre,
            precio: Number(itemGuardado.precioUnitario)
          },
          Number(itemGuardado.cantidad)
        );
      }

      return new ItemCarrito(producto, Number(itemGuardado.cantidad));
    });
  } catch (error) {
    return [];
  }
}

function guardarConfiguracionEnStorage(configuracion) {
  localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(configuracion));
}

function cargarConfiguracionDesdeStorage() {
  const contenido = localStorage.getItem(CONFIG_STORAGE_KEY);
  if (!contenido) {
    return null;
  }

  try {
    const config = JSON.parse(contenido);
    if (!config || typeof config !== "object") {
      return null;
    }

    const entregaValida = config.entrega === "delivery" || config.entrega === "takeaway";
    const pagoValido =
      config.pago === "efectivo" ||
      config.pago === "santander" ||
      config.pago === "transferencia";

    if (!entregaValida || !pagoValido) {
      return null;
    }

    return { entrega: config.entrega, pago: config.pago };
  } catch (error) {
    return null;
  }
}

function limpiarConfiguracionStorage() {
  localStorage.removeItem(CONFIG_STORAGE_KEY);
}

function mostrarMensaje(texto, tipo) {
  mensaje.textContent = texto;
  mensaje.classList.remove("ok", "error");

  if (tipo === "ok") {
    mensaje.classList.add("ok");
  } else if (tipo === "error") {
    mensaje.classList.add("error");
  }
}

function renderSelectProductos(listaProductos) {
  selectProducto.innerHTML = "";

  listaProductos.forEach((producto) => {
    const option = document.createElement("option");
    option.value = producto.id;
    option.textContent = producto.nombre + " - " + formatearMoneda(producto.precio);
    selectProducto.appendChild(option);
  });
}

function renderCarrito(carritoActual) {
  listaCarrito.innerHTML = "";

  if (carritoActual.length === 0) {
    const liVacio = document.createElement("li");
    liVacio.textContent = "Tu carrito esta vacio.";
    listaCarrito.appendChild(liVacio);
    return;
  }

  carritoActual.forEach((item) => {
    const li = document.createElement("li");
    li.className = "item-carrito";
    li.innerHTML =
      "<span>" +
      item.nombre +
      " | Cantidad: " +
      item.cantidad +
      " | Subtotal: " +
      formatearMoneda(item.subtotal()) +
      "</span>" +
      '<button class="btn-quitar" data-id="' +
      item.id +
      '" type="button">Quitar</button>';

    listaCarrito.appendChild(li);
  });
}

function obtenerEntregaActiva() {
  return configuracionPedido ? configuracionPedido.entrega : selectEntrega.value;
}

function obtenerPagoActivo() {
  return configuracionPedido ? configuracionPedido.pago : selectPago.value;
}

function calcularDescuento(total, pagoSeleccionado) {
  return total * obtenerPorcentajeDescuento(pagoSeleccionado);
}

function renderTotales(carritoActual) {
  const entregaSeleccionada = obtenerEntregaActiva();
  const pagoSeleccionado = obtenerPagoActivo();

  const subtotal = carritoActual.reduce((acumulado, item) => acumulado + item.subtotal(), 0);
  const envio = entregaSeleccionada === "delivery" && carritoActual.length > 0 ? COSTO_ENVIO : 0;
  const totalSinDescuento = subtotal + envio;
  const descuento = calcularDescuento(totalSinDescuento, pagoSeleccionado);
  const totalFinal = totalSinDescuento - descuento;

  outSubtotal.textContent = formatearMoneda(subtotal);
  outEnvio.textContent = formatearMoneda(envio);
  outDescuento.textContent = formatearMoneda(descuento);
  outTotal.textContent = formatearMoneda(totalFinal);
}

function actualizarInfoOpciones() {
  const entregaActiva = obtenerEntregaActiva();
  const pagoActivo = obtenerPagoActivo();
  const textoEntrega = obtenerTextoEntrega(entregaActiva);
  const textoPago = obtenerTextoPago(pagoActivo);
  const beneficio = obtenerTextoBeneficioPago(pagoActivo);

  let texto = "Entrega: " + textoEntrega + ". Pago: " + textoPago + " (" + beneficio + ").";

  if (carrito.length > 0) {
    const subtotal = carrito.reduce((acumulado, item) => acumulado + item.subtotal(), 0);
    const envio = entregaActiva === "delivery" ? COSTO_ENVIO : 0;
    const descuento = calcularDescuento(subtotal + envio, pagoActivo);
    texto += " Podes agregar distintos productos. Entrega y pago quedan fijos para todo el pedido. Descuento actual: " + formatearMoneda(descuento) + ".";
  }

  infoOpciones.textContent = texto;
}

function actualizarVistaCompleta() {
  renderCarrito(carrito);
  renderTotales(carrito);
  actualizarInfoOpciones();
}

function aplicarConfiguracionPedido(entregaSeleccionada, pagoSeleccionado) {
  configuracionPedido = {
    entrega: entregaSeleccionada,
    pago: pagoSeleccionado
  };

  selectEntrega.value = entregaSeleccionada;
  selectPago.value = pagoSeleccionado;

  guardarConfiguracionEnStorage(configuracionPedido);
}

function liberarConfiguracionPedido() {
  configuracionPedido = null;
  limpiarConfiguracionStorage();
}

function agregarAlCarrito(event) {
  event.preventDefault();

  const idProducto = Number(selectProducto.value);
  const cantidad = Number(inputCantidad.value);
  const entregaSeleccionada = selectEntrega.value;
  const pagoSeleccionado = selectPago.value;

  const productoElegido = productos.find((producto) => producto.id === idProducto);

  if (!productoElegido) {
    mostrarMensaje("Producto invalido.", "error");
    return;
  }

  if (!Number.isInteger(cantidad) || cantidad < 1) {
    mostrarMensaje("La cantidad debe ser un numero mayor o igual a 1.", "error");
    return;
  }

  if (carrito.length === 0) {
    aplicarConfiguracionPedido(entregaSeleccionada, pagoSeleccionado);
  } else {
    const entregaActiva = obtenerEntregaActiva();
    const pagoActivo = obtenerPagoActivo();

    if (entregaSeleccionada !== entregaActiva || pagoSeleccionado !== pagoActivo) {
      selectEntrega.value = entregaActiva;
      selectPago.value = pagoActivo;

      mostrarMensaje(
        "No podes mezclar opciones en un mismo pedido. Todo debe ser " +
          obtenerTextoEntrega(entregaActiva) +
          " y pago " +
          obtenerTextoPago(pagoActivo) +
          ".",
        "error"
      );
      actualizarInfoOpciones();
      return;
    }
  }

  const itemExistente = carrito.find((item) => item.id === idProducto);

  if (itemExistente) {
    itemExistente.cantidad += cantidad;
  } else {
    carrito.push(new ItemCarrito(productoElegido, cantidad));
  }

  guardarCarritoEnStorage(carrito);
  actualizarVistaCompleta();

  inputCantidad.value = 1;
  mostrarMensaje(
    "Producto agregado. Pedido fijo en " +
      obtenerTextoEntrega(obtenerEntregaActiva()) +
      " y pago " +
      obtenerTextoPago(obtenerPagoActivo()) +
      ". Podes seguir agregando otros productos.",
    "ok"
  );
}

function quitarDelCarrito(event) {
  const botonQuitar = event.target.closest(".btn-quitar");
  if (!botonQuitar) {
    return;
  }

  const idAQuitar = Number(botonQuitar.dataset.id);
  carrito = carrito.filter((item) => item.id !== idAQuitar);

  if (carrito.length === 0) {
    liberarConfiguracionPedido();
  }

  guardarCarritoEnStorage(carrito);
  actualizarVistaCompleta();
  mostrarMensaje("Producto quitado del carrito.", "ok");
}

function vaciarCarrito() {
  carrito = [];
  liberarConfiguracionPedido();
  guardarCarritoEnStorage(carrito);
  actualizarVistaCompleta();
  mostrarMensaje("Carrito vacio.", "ok");
}

function confirmarPedido() {
  if (carrito.length === 0) {
    mostrarMensaje("No hay productos en el carrito para confirmar.", "error");
    return;
  }

  const entregaActiva = obtenerEntregaActiva();
  const pagoActivo = obtenerPagoActivo();

  const subtotal = carrito.reduce((acumulado, item) => acumulado + item.subtotal(), 0);
  const envio = entregaActiva === "delivery" ? COSTO_ENVIO : 0;
  const totalSinDescuento = subtotal + envio;
  const descuento = calcularDescuento(totalSinDescuento, pagoActivo);
  const totalFinal = totalSinDescuento - descuento;

  const detalleProductos = carrito
    .map((item) => item.nombre + " x" + item.cantidad)
    .join(", ");

  mostrarMensaje(
    "Pedido confirmado: " +
      detalleProductos +
      ". Entrega: " +
      obtenerTextoEntrega(entregaActiva) +
      ". Pago: " +
      obtenerTextoPago(pagoActivo) +
      ". Descuento: " +
      formatearMoneda(descuento) +
      ". Total final: " +
      formatearMoneda(totalFinal) +
      ".",
    "ok"
  );

  carrito = [];
  liberarConfiguracionPedido();
  guardarCarritoEnStorage(carrito);
  actualizarVistaCompleta();
}

function iniciarPedido() {
  seccionPedido.classList.remove("hidden");
  mostrarMensaje("Comenza tu pedido. Elegi producto y agrega al carrito.", "ok");
}

function manejarCambioOpciones() {
  if (carrito.length > 0 && configuracionPedido) {
    selectEntrega.value = configuracionPedido.entrega;
    selectPago.value = configuracionPedido.pago;
    mostrarMensaje("Podes cambiar de producto, pero entrega y pago ya estan fijados para este pedido.", "error");
    actualizarInfoOpciones();
    return;
  }

  renderTotales(carrito);
  actualizarInfoOpciones();
}

function iniciarApp() {
  carrito = cargarCarritoDesdeStorage();
  const configGuardada = cargarConfiguracionDesdeStorage();

  renderSelectProductos(productos);

  if (carrito.length > 0 && configGuardada) {
    aplicarConfiguracionPedido(configGuardada.entrega, configGuardada.pago);
  } else if (carrito.length > 0 && !configGuardada) {
    aplicarConfiguracionPedido(selectEntrega.value, selectPago.value);
  } else {
    liberarConfiguracionPedido();
  }

  actualizarVistaCompleta();

  btnIniciar.addEventListener("click", iniciarPedido);
  formPedido.addEventListener("submit", agregarAlCarrito);
  listaCarrito.addEventListener("click", quitarDelCarrito);
  btnVaciar.addEventListener("click", vaciarCarrito);
  btnConfirmar.addEventListener("click", confirmarPedido);
  selectEntrega.addEventListener("change", manejarCambioOpciones);
  selectPago.addEventListener("change", manejarCambioOpciones);
}

document.addEventListener("DOMContentLoaded", iniciarApp);
